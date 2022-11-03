import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  const session = getSession(req, res);
  console.log(session)
  const tokenResponse = await fetch(
    process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? '',
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: 'Bearer ' + session?.accessToken,
      },
    }
  );
  const token = await tokenResponse.text();
  res.status(200).json(token);
});
