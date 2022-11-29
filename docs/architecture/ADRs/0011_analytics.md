# Site Analytics

Date - 29/11/22

## Status
In progress

## Context
We need to add analytics to the website, to track user information and site usage.

## Decision
Google Analytics seems to be free to use, but there are issues around GDPR which need to be addressed - it is banned in Italy, Austria, France and Denmark. It looks like we'll need to add a provacy policy to the site, as well as having a cookie acceptance banner. The steps are covered here -. https://www.cookieyes.com/blog/google-analytics-gdpr/.

## Consequences

Steps to add Google Analytics to the site:
1. Create a new account on analytics.google.com (one already created called vector-atlas)
1. Create a property (one already created called Vector Atlas Test - we'll need a new one for prod)
1. Register the details of the vector atlas site, and copy the resulting `Measurement ID`
1. Add the `Measurement ID` to the .env files in the UI project with `NEXT_PUBLIC_GOOGLE_ANALYTICS='<Measurement ID>'` where `<Measurement ID>` is the copied id
1. Add the following code to the return from _app.tsx, importing the next Script component first (see https://nextjs.org/docs/messages/next-script-for-ga)
```
<Script
  src="https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
  `}
</Script>
```
6. Start the UI running with the normal `npm run start:dev` and open the console. Type `dataLayer` in the console - if this is undefined, something has gone wrong. Otherwise, analytics has been added.
7. Click on the `Reports` section of the google analytics platform, then `Realtime` - you should see some analytics appearing
8. To get per-page views, add
```
<Head>
  <title>Title</title>
</Head>
```
to each page, where `Head` is imported from next/head, and `Title` is the title of the page.