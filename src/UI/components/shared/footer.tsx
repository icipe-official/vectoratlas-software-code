import styles from '../../styles/Home.module.css';

import { useAppSelector } from '../../state/hooks';
import { useTranslations } from 'next-intl';

function Footer() {
  const t = useTranslations('Footer');
  const version_ui = useAppSelector((state) => state.config.version_ui);
  const version_api = useAppSelector((state) => state.config.version_api);

  return <footer className={styles.footer}></footer>;
}

export default Footer;
