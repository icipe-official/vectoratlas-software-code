import axios from 'axios';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  const session = await getSession(req, res);
  try {
    // console.log(`Auth endpoint: ${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}`);
    const tokenResponse = await axios.get(
      // process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? '',
      'http://api:3001/auth/token',
      {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + session?.accessToken,
        },
      }
    );
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
