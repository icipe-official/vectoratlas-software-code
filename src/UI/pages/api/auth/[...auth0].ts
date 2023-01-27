import { handleAuth, handleCallback, handleLogin } from '@auth0/nextjs-auth0';

const getLoginState: any = (
  req: { headers: { referer: any } },
  loginOptions: any
) => {
  return {
    returnTo: req.headers.referer,
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
      await handleCallback(req, res)
    } catch (error) {
      res.redirect('/')
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
