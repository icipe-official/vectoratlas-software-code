import styles from '../../styles/Home.module.css';

import { useAppSelector } from '../../state/hooks';

function Footer() {
  const version_ui = useAppSelector((state) => state.config.version_ui);
  const version_api = useAppSelector((state) => state.config.version_api);

  return (
    <>
    <footer className={styles.footer}>
      UI Version: {version_ui}  <br />
      API Version: {version_api}
    </footer></>
  );
}

export default Footer;