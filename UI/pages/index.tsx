import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as api from '../api/api';
import { VectorPoint } from "../data_types/vector_point";
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import("../components/map"), { ssr: false });

function Home({ value }: {value: any}): JSX.Element {

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
          <MapComponent points={value}/>
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

export async function getServerSideProps() {
  const value = await api.getData();
  return { props: { value }};
}

export default Home
