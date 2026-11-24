export interface Organization {
  id: string;
  name: string;
  website?: string | null;
  logo?: string | null;
  acknowledgement?: string | null;
  terms_and_conditions?: string | null;
}

export type OrganizationFormValues = Omit<Organization, 'id'>;

const FIELDS = 'id name website logo acknowledgement terms_and_conditions';

/**
 * Route stored organization-logo URLs through the API.
 * Other URLs, such as the Vector Atlas static logo, remain unchanged.
 */
export const getOrganizationLogoUrl = (
  logo?: string | null
): string | undefined => {
  if (!logo) return undefined;

  try {
    const parsed = new URL(logo);
    const segments = parsed.pathname.split('/');
    const folderIndex = segments.indexOf('organization-logos');

    if (folderIndex === -1 || folderIndex !== segments.length - 2) {
      return logo;
    }

    const fileName = decodeURIComponent(segments[folderIndex + 1]);

    if (!fileName) return logo;

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '/vector-api';

    return `${apiBase.replace(/\/$/, '')}/organization/logo/${encodeURIComponent(fileName)}`;
  } catch {
    return logo;
  }
};


async function gql<T>(
  token: string | undefined,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? '/vector-api'}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Request failed with status ${res.status}`);
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return json.data as T;
}

export const fetchOrganizations = async (token?: string) =>
  (
    await gql<{ allOrganizations: Organization[] }>(
      token,
      `query { allOrganizations { ${FIELDS} } }`
    )
  ).allOrganizations;

export const createOrganization = async (
  token: string | undefined,
  input: OrganizationFormValues
) =>
  (
    await gql<{ createOrganization: Organization }>(
      token,
      `mutation($input: CreateOrganizationInput!) {
         createOrganization(input: $input) { ${FIELDS} }
       }`,
      { input }
    )
  ).createOrganization;

export const updateOrganization = async (
  token: string | undefined,
  id: string,
  input: OrganizationFormValues
) =>
  (
    await gql<{ updateOrganization: Organization }>(
      token,
      `mutation($input: UpdateOrganizationInput!) {
         updateOrganization(input: $input) { ${FIELDS} }
       }`,
      { input: { id, ...input } }
    )
  ).updateOrganization;

export const deleteOrganization = async (
  token: string | undefined,
  id: string
) =>
  (
    await gql<{ deleteOrganization: Organization }>(
      token,
      `mutation($id: String!) {
         deleteOrganization(id: $id) { id }
       }`,
      { id }
    )
  ).deleteOrganization;
export const uploadOrganizationLogo = async (
  token: string | undefined,
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? '/vector-api'}/organization/upload-logo`,
    {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }
  );

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Logo upload failed with status ${res.status}`);
  }

  if (!res.ok) {
    throw new Error(
      json.message || `Logo upload failed with status ${res.status}`
    );
  }

  if (!json.logoUrl) {
    throw new Error('The server did not return a logo URL');
  }

  return json.logoUrl;
};
