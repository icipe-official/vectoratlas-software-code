import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic';
import type { GeoJsonObject } from 'geojson';
import ClientOnly from '../components/clientOnly';

const MapComponent = dynamic(() => import("../components/map"), { ssr: false });

function Home({countryData}: {countryData: GeoJsonObject}): JSX.Element {

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
            <MapComponent countryData={countryData}/>
          </ClientOnly>
        </>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}


export async function getStaticProps() {
  const res = await fetch('http://localhost:3001/data/countryBorders')
  const countryData = await res.json();
  return { props: { countryData } };
}

export default Home
