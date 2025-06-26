'use client';

import {
  Checkbox,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useRouter } from 'next/router';
// import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import { useAppDispatch } from '../../state/hooks';
import { setLocale as setUserLocale } from '../../state/localization/localizationSlice';

export const LanguageSwitcher = () => {
  const [locale, setLocale] = useState<string>('');
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // check if cookie exists
    const cookieLocale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('VECTORATLAS_LOCALE='))
      ?.split('=')[1];

    if (cookieLocale) {
      // if locale has been set previously
      setLocale(cookieLocale);
      dispatch(setUserLocale(cookieLocale));
    } else {
      // get the browser default locale
      const browserLocale = navigator.language.slice(0, 2);
      setLocale(browserLocale);
      dispatch(setUserLocale(browserLocale));
      //set cookie
      document.cookie = `VECTORATLAS_LOCALE=${browserLocale};`;
      // Refresh the page
      router.reload(); //.refresh();
    }
  }, [router]);

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    dispatch(setUserLocale(newLocale));
    document.cookie = `VECTORATLAS_LOCALE=${newLocale}`;
    router.reload(); //.refresh();
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        // width: 250,
      },
    },
  };

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
    changeLocale(event.target.value);
  };

  function getStyles(lang: string, theme: Theme) {
    return {
      fontWeight:
        locale === lang
          ? theme.typography.fontWeightMedium
          : theme.typography.fontWeightRegular,
    };
  }
  const theme = useTheme();
  const langs = [
    { key: 'en', value: 'English' },
    { key: 'fr', value: 'Francais' },
  ];
  return (
    <div
      style={
        {
          // flex: 1,
          // justifyItems: 'center',
          // // gap: 10,
          // alignItems: 'center',
        }
      }
    >
      <Select
        value={locale}
        onChange={handleChange}
        // input={<OutlinedInput label="Name" />}
        style={{ border: 0 }}
        MenuProps={MenuProps}
      >
        {langs.map((el) => (
          <MenuItem
            key={el.key}
            value={el.key}
            style={getStyles(el.key, theme)}
          >
            {el.value}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
  return (
    <div>
      <h1>Logo</h1>
      <div
        style={{
          flex: 1,
          justifyItems: 'center',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <button
          style={{
            padding: 10,
            margin: 10,
            backgroundColor: locale == 'en' ? 'cyan' : 'white',
          }}
          onClick={() => changeLocale('en')}
        >
          EN
        </button>
        <button
          style={{
            padding: 10,
            margin: 10,
            backgroundColor: locale == 'fr' ? 'cyan' : 'white',
          }}
          onClick={() => changeLocale('fr')}
        >
          FR
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
