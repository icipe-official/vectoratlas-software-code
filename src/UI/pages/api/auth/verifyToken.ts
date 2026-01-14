import type { NextApiRequest, NextApiResponse } from 'next';
import * as njwt from 'njwt';

// 🚨 Use the server-only secret key. This must NOT be prefixed with NEXT_PUBLIC_.
const TOKEN_KEY = process.env.TOKEN_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // This route is designed to receive the token via POST in the body.
  if (req.method === 'POST') {
    try {
      if (!TOKEN_KEY) {
        // Log a critical error if the server secret is missing
        console.error(
          'CRITICAL: TOKEN_KEY is not configured in the server environment.'
        );
        throw new Error('Server configuration error: Key missing.');
      }

      // 1. RECEIVE TOKEN from the request body sent by the Redux Thunk
      const { token } = req.body;

      if (!token || typeof token !== 'string') {
        throw new Error('No valid token provided for verification.');
      }

      // 2. SECURELY VERIFY TOKEN: Using the server-only key
      const verifiedToken: any = njwt.verify(token, TOKEN_KEY);

      // 3. Return the verified, safe user data
      const userInfo = {
        sub: verifiedToken?.body.sub,
        token: token,
        // Safely split the scope field into an array of roles
        roles: verifiedToken?.body.scope?.split(',') || [],
      };

      res.status(200).json(userInfo);
    } catch (error: any) {
      console.error('Token verification failed:', error);

      let errorMessage = 'Authentication failed. Please log in again.';
      let statusCode = 401;

      if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (
          message.includes('expired') ||
          message.includes('signature') ||
          message.includes('malformed')
        ) {
          // 401 for JWT validation failures
          statusCode = 401;
        } else {
          // 400 for structural errors (e.g., missing token in body)
          statusCode = 400;
          errorMessage = `Verification error: ${error.message}`;
        }
      }

      // Send the error message back to the client
      res.status(statusCode).json({ error: errorMessage });
    }
  } else {
    // Block all other methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
