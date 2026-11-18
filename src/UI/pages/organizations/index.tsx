import React from 'react';
import OrganizationManager from '../../components/organization/OrganizationManager';

// TODO: replace with however the Source List page gets its Auth0 access token
const getToken = async (): Promise<string | undefined> => {
  const res = await fetch('/api/auth/token'); // adjust to your existing token route
  if (!res.ok) return undefined;
  return (await res.json()).accessToken;
};

export default function OrganizationsPage() {
  return <OrganizationManager getToken={getToken} />;
}
