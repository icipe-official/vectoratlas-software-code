import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA")
  const session = getSession(req, res);
  console.log(session);
  const token = await fetch('http://localhost:3001/auth/token', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Authorization': 'Bearer ' + session?.accessToken
    }
  })
  console.log(token)
  res.status(200).json(token)
});