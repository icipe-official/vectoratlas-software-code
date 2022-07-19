import { useEffect, useState } from 'react'

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
  <footer>
    <small >UI Version: {version_ui}</small> <br />
    <small >API Version: {version_api}</small>
  </footer>
  )
}

export default Counter