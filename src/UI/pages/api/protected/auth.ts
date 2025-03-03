import axios from 'axios';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  const session = await getSession(req, res);
  try {
    console.log(`Auth endpoint: ${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}`);
    console.log(`Auth session: ${session?.accessToken}`);
    const url = '/vector-api/auth/token'; // process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? '', 'http://api:3001/auth/token'
    console.log(`Auth url: ${url}`);
    const tokenResponse = await axios.get(url, {
      withCredentials: true,
      headers: {
        Authorization: 'Bearer ' + session?.accessToken,
      },
    });
    console.log('token response', tokenResponse);

    res.status(200).json(tokenResponse.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});
