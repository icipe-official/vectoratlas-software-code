import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  const session = getSession(req, res);
  const tokenResponse = await fetch('http://localhost:3001/auth/token', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: 'Bearer ' + session?.accessToken,
    },
  });
  const token = await tokenResponse.text();
  res.status(200).json(token);
});
