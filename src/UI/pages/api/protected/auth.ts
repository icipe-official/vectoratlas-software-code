import axios from 'axios';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  const session = await getSession(req, res);
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

/*
export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  const session = await getSession(req, res);
  try {
    const url = process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? '';
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

*/

/*
export default async function ProtectedRoute(req: any, res: any) {
  console.log('Calling auth/protected, ', req);
  const session = await getSession(req, res);
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
}
*/
