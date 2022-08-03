import Head from 'next/head';
import dynamic from 'next/dynamic';
import ClientOnly from '../components/shared/clientOnly';
import Footer from '../components/shared/footer';
import { useAppSelector } from '../state/hooks';
import NavBar from '../components/shared/navbar';

const MapComponent = dynamic(() => import("../components/map"), { ssr: false });

function Home(): JSX.Element {
  const feature_flags = useAppSelector((state) => state.config.feature_flags);

  const is_flag_on = (name: string) => {
    return feature_flags.some(x => x.flag === name && x.on);
  };

  return (

    <div>
      <Head>
        <title>VA</title>
        <meta name="description" content="Vector Atlas UI" />
        <link rel="icon" href="/Animals-Mosquito-icon.png" />
      </Head>

      <main >
        <>
          <NavBar />
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
