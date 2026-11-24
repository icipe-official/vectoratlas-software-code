import { getOrganizationLogoUrl } from './organizationApi';

// api/organizationService.ts
// All organization data access lives in this one file (replace the whole file).
//
// It talks to your real GraphQL API:
//   allOrganizations, organization(id), createOrganization(input), updateOrganization(input),
//   deleteOrganization(id)
// and maps the API's field names (logo, terms_and_conditions) to the names the UI uses
// (logoUrl, termsAndConditions), so the pages and form do not need to know the difference.
//
// USE_MOCK = true gives in-memory dummy data (IR Mapper, Vector Atlas) for a demo with no API.

export const USE_MOCK = false;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3001';

export interface OrganizationFields {
  name: string;
  website: string;
  acknowledgement: string;
  termsAndConditions: string;
}

export interface Organization extends OrganizationFields {
  id: string;
  logoUrl: string | null;
  occurrenceCount?: number; // only used by mock mode; the real API enforces the delete rule itself
}

export type OrganizationInput = OrganizationFields & { logoUrl: string | null };

export type LogoChange =
  | { type: 'keep' }
  | { type: 'remove' }
  | { type: 'replace'; file: File };

/* ------------------------------------------------------------ auth token */

// The UI route /api/protected/auth returns the API-signed token the GraphQL guard accepts.
// It is fetched on first use and cached for 50 minutes (the API issues 60-minute tokens).
let cachedToken: { value: string; fetchedAt: number } | null = null;
const TOKEN_TTL_MS = 50 * 60 * 1000;

async function resolveToken(token?: string): Promise<string | undefined> {
  if (token) return token;
  if (typeof window === 'undefined') return undefined;
  if (cachedToken && Date.now() - cachedToken.fetchedAt < TOKEN_TTL_MS) return cachedToken.value;
  try {
    const res = await fetch('/api/protected/auth');
    if (!res.ok) return undefined;
    const body = await res.json();
    if (typeof body === 'string' && body) {
      cachedToken = { value: body, fetchedAt: Date.now() };
      return body;
    }
  } catch {
    /* not signed in, or the route is unavailable */
  }
  return undefined;
}

/* --------------------------------------------------------------- graphql */

interface ApiOrganization {
  id: string;
  name: string;
  website?: string | null;
  logo?: string | null;
  acknowledgement?: string | null;
  terms_and_conditions?: string | null;
}

const FIELDS = 'id name website logo acknowledgement terms_and_conditions';

const toOrganization = (o: ApiOrganization): Organization => ({
  id: o.id,
  name: o.name,
  website: o.website ?? '',
  logoUrl: getOrganizationLogoUrl(o.logo) ?? null,
  acknowledgement: o.acknowledgement ?? '',
  termsAndConditions: o.terms_and_conditions ?? '',
});

const toApiInput = (input: OrganizationInput): Record<string, string> => ({
  name: input.name,
  website: input.website,
  logo: input.logoUrl ?? '',
  acknowledgement: input.acknowledgement,
  terms_and_conditions: input.termsAndConditions,
});

// Builds a GraphQL object literal, e.g. {name: "IR Mapper", website: "https://..."}.
// Writing the input inline means we do not depend on the input type names.
const literal = (values: Record<string, string>): string =>
  `{${Object.entries(values)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join(', ')}}`;

const friendlyMessage = (message: string): string => {
  if (/unauthori[sz]ed|forbidden/i.test(message)) {
    return 'You need to be signed in with an admin role to do this.';
  }
  // organization.name is unique in the database
  if (/duplicate key|unique constraint|already exists/i.test(message)) {
    return 'An organization with this name already exists. Choose a different name.';
  }
  return message;
};

async function gql<T>(query: string, token?: string): Promise<T> {
  const auth = await resolveToken(token);
  const res = await fetch(`${API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
    },
    body: JSON.stringify({ query }),
  });

  let json: { data?: T; errors?: { message: string }[] };
  try {
    json = await res.json();
  } catch {
    throw new Error(`The server returned an unexpected response (${res.status}).`);
  }
  if (json.errors?.length) throw new Error(friendlyMessage(json.errors[0].message));
  return json.data as T;
}

/* ------------------------------------------------------------------ mock */

let mockStore: Organization[] = [
  {
    id: '1',
    name: 'Vector Atlas',
    website: 'https://vectoratlas.icipe.org',
    logoUrl: null,
    acknowledgement: 'Data provided by Vector Atlas.',
    termsAndConditions: 'Data may be used for non-commercial research with citation.',
    occurrenceCount: 0,
  },
  {
    id: '2',
    name: 'IR Mapper',
    website: 'https://www.irmapper.com',
    logoUrl: null,
    acknowledgement: 'Insecticide resistance data sourced from IR Mapper.',
    termsAndConditions: 'Refer to IR Mapper for terms of use.',
    occurrenceCount: 1250,
  },
];

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('The logo could not be read.'));
    reader.readAsDataURL(file);
  });

/* ---------------------------------------------------------------- public */

export async function listOrganizations(token?: string): Promise<Organization[]> {
  if (USE_MOCK) {
    await wait();
    return [...mockStore];
  }
  const data = await gql<{ allOrganizations: ApiOrganization[] }>(
    `query { allOrganizations { ${FIELDS} } }`,
    token,
  );
  return (data.allOrganizations ?? []).map(toOrganization);
}

export async function getOrganization(id: string, token?: string): Promise<Organization> {
  if (USE_MOCK) {
    await wait();
    const found = mockStore.find((o) => o.id === id);
    if (!found) throw new Error('Organization not found.');
    return { ...found };
  }
  const data = await gql<{ organization: ApiOrganization | null }>(
    `query { organization(id: ${JSON.stringify(id)}) { ${FIELDS} } }`,
    token,
  );
  if (!data.organization) throw new Error('Organization not found.');
  return toOrganization(data.organization);
}

export async function createOrganization(input: OrganizationInput, token?: string): Promise<Organization> {
  if (USE_MOCK) {
    await wait();
    const created: Organization = { ...input, id: String(Date.now()), occurrenceCount: 0 };
    mockStore = [...mockStore, created];
    return { ...created };
  }
  const data = await gql<{ createOrganization: ApiOrganization }>(
    `mutation { createOrganization(input: ${literal(toApiInput(input))}) { ${FIELDS} } }`,
    token,
  );
  return toOrganization(data.createOrganization);
}

export async function updateOrganization(
  id: string,
  input: OrganizationInput,
  token?: string,
): Promise<Organization> {
  if (USE_MOCK) {
    await wait();
    const index = mockStore.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Organization not found.');
    mockStore[index] = { ...mockStore[index], ...input };
    return { ...mockStore[index] };
  }
  const data = await gql<{ updateOrganization: ApiOrganization }>(
    `mutation { updateOrganization(input: ${literal({ id, ...toApiInput(input) })}) { ${FIELDS} } }`,
    token,
  );
  return toOrganization(data.updateOrganization);
}

// The API refuses to delete an organization that still has datasets with occurrence records.
// Its message is passed straight through, so the list page shows it in the error toast.
export async function deleteOrganization(id: string, token?: string): Promise<void> {
  if (USE_MOCK) {
    await wait();
    const found = mockStore.find((o) => o.id === id);
    if (!found) throw new Error('Organization not found.');
    if ((found.occurrenceCount ?? 0) > 0) {
      throw new Error(`${found.name} cannot be deleted because records are linked to it.`);
    }
    mockStore = mockStore.filter((o) => o.id !== id);
    return;
  }
  await gql<{ deleteOrganization: { id: string } }>(
    `mutation { deleteOrganization(id: ${JSON.stringify(id)}) { id name } }`,
    token,
  );
}

// Uploads an (already resized) logo and returns the value to store in the organization's logo field.
// Uses the existing POST /organization/upload-logo route (multipart field "file").
// The API responds with { logoUrl, filePath }; logoUrl is stored in the organization's logo field.
export async function uploadLogo(file: File, token?: string): Promise<string> {
  if (USE_MOCK) {
    await wait(200);
    return fileToDataUrl(file);
  }
  const auth = await resolveToken(token);
  const body = new FormData();
  body.append('file', file);

  const res = await fetch(`${API_URL}/organization/upload-logo`, {
    method: 'POST',
    headers: auth ? { Authorization: `Bearer ${auth}` } : {},
    body,
  });
  const text = await res.text();
  if (!res.ok) {
    let message = `The logo could not be uploaded (${res.status}).`;
    try {
      const parsed = JSON.parse(text);
      if (parsed?.message) message = friendlyMessage(String(parsed.message));
    } catch {
      /* not JSON */
    }
    throw new Error(message);
  }

  let location = '';
  try {
    const parsed = JSON.parse(text);
    location =
      typeof parsed === 'string'
        ? parsed
        : parsed?.logoUrl ?? parsed?.url ?? parsed?.logo ?? parsed?.filePath ?? parsed?.path ?? '';
  } catch {
    location = text.trim().replace(/^"|"$/g, '');
  }
  if (!location) throw new Error('The logo was uploaded, but the server did not say where it was saved.');
  return location;
}

export async function applyLogoChange(
  change: LogoChange,
  currentUrl: string | null,
  token?: string,
): Promise<string | null> {
  if (change.type === 'remove') return null;
  if (change.type === 'replace') return uploadLogo(change.file, token);
  return currentUrl;
}
