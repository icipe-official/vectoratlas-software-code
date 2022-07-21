import Head from 'next/head'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic';
import ClientOnly from '../components/shared/clientOnly';
import Footer from '../components/shared/footer';
import { useAppSelector, useAppDispatch } from '../state/hooks';
import { useEffect } from 'react';
import { getFeatureFlags } from '../state/configSlice';

const MapComponent = dynamic(() => import("../components/map"), { ssr: false });

function Home(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFeatureFlags());
  }, []);

  const feature_flags = useAppSelector((state) => state.config.feature_flags);

  return (

    <div className={styles.container}>
      <Head>
        <title>VA</title>
        <meta name="description" content="Vector Atlas UI" />
        <link rel="icon" href="/Animals-Mosquito-icon.png" />
      </Head>

      <main className={styles.main}>
        <>
          <h1 className={styles.title}>
            Vector Atlas
          </h1>
          <br />
          <ClientOnly>
            {feature_flags.some(x => x.flag === "MAP" && x.on) && <MapComponent/>}
          </ClientOnly>
        </>
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/version.txt');
  const version = await res.text();
  return {
    props: {
      version,
    },
  }
}

export default Home
