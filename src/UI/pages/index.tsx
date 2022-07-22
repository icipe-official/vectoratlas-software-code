import Head from 'next/head';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import ClientOnly from '../components/shared/clientOnly';
import Footer from '../components/shared/footer';
import { useAppSelector } from '../state/hooks';

const MapComponent = dynamic(() => import("../components/map"), { ssr: false });

function Home(): JSX.Element {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);

  const is_flag_on = (name: string) => {
    return feature_flags.some(x => x.flag === name && x.on);
  };

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
            {is_flag_on("MAP") && <MapComponent/>}
          </ClientOnly>
        </>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
