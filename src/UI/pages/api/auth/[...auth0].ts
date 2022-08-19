import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

const afterCallback = (req: any, res: any, session: any, state: any) => {
  console.log(session.idToken);
  return session;
}

export default handleAuth({
  async callback(req, res) {
    await handleCallback(req, res, { afterCallback });
  }
});
