import { GetServerSidePropsContext } from 'next';

export const getMessages = async (context: GetServerSidePropsContext) => {
  const locale = context.locale || 'en';
  const cookies = context.req.cookies;
  // get saved locale or if not, return default
  const cookieLocale = (await cookies['VECTORATLAS_LOCALE']) || 'en';
  return {
    props: {
      messages: (await import(`../messages/${cookieLocale}.json`)).default,
      // Note that when `now` is passed to the app, you need to make sure the
      // value is updated from time to time, so relative times are updated. See
      // https://next-intl-docs.vercel.app/docs/usage/configuration#global-now-value
      now: new Date().getTime(),
    },
  };
};
