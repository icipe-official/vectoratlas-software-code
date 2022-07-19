import { useEffect } from 'react'
import styles from '../../styles/Home.module.css'

import { useAppSelector, useAppDispatch } from '../../state/hooks';
import {
    getApiVersion,
    getUiVersion
} from '../../state/configSlice';

function Counter() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getApiVersion());
  }, []);
  useEffect(() => {
    dispatch(getUiVersion());
  }, []);

  const version_ui = useAppSelector((state) => state.config.version_ui);
  const version_api = useAppSelector((state) => state.config.version_api);

  return (
  <footer className={styles.footer}>
    UI Version: {version_ui}  <br />
    API Version: {version_api}
  </footer>
  )
}

export default Counter