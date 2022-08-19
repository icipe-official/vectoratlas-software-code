import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function getAuth(req, res) {
  console.log('auth baby yeah')
  const { accessToken } = await getAccessToken(req, res);
  console.log(accessToken);
});
