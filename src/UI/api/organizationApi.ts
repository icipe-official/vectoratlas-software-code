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

async function gql<T>(
  token: string | undefined,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3001'}/graphql`,
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