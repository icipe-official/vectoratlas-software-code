import { handleAuth, handleCallback, handleLogin } from '@auth0/nextjs-auth0';

const getLoginState: any = (
  req: { headers: { referer: any } },
  loginOptions: any
) => {
  let returnTo = req.headers.referer || '/';

  // Prevent redirecting back to the NestJS backend if the referer was an API call
  if (returnTo.includes('/vector-api')) {
    returnTo = '/';
  }

  console.log('RETURN TO', returnTo);

  return {
    // returnTo: req.headers.referer,
    returnTo: returnTo,
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      // Add the `offline_access` scope to also get a Refresh Token
      scope: 'openid profile email read',
    },
  };
};

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, {
        afterCallback: (req, res, session, state) => {
          // Log the generated ID to your terminal upon successful login
          console.log('\n=== AUTH0 LOGIN SUCCESS ===');
          console.log(`User Email: ${session.user.email}`);
          console.log(`Auth0 ID:   ${session.user.sub}`);
          console.log('===========================\n');
          return session;
        },
      });
    } catch (error) {
      console.error('Auth0 Callback Error:', error);
      res.redirect('/');
    }
  },
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        getLoginState,
      });
    } catch (error: any) {
      res.status(error.status || 400).end(error.message);
    }
  },
});
