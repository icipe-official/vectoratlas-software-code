'use client';

import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import { useAppDispatch } from '../../state/hooks';
import { setLocale as setUserLocale } from '../../state/localization/localizationSlice';
import { SUPPORTED_LANGUAGES } from '../../utils/localization';

export const LanguageSwitcher = () => {
  const [locale, setLocale] = useState<string>('');
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // check if cookie exists
    const cookieLocale = document.cookie
      .split('; ')
      .filter((row) => row.startsWith('VECTORATLAS_LOCALE='))
      .pop() // take the LAST match, not the first
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
      document.cookie = `VECTORATLAS_LOCALE=${browserLocale}; path=/`;

      // Refresh the page
      router.reload();
    }
  }, [router]);

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    dispatch(setUserLocale(newLocale));
    document.cookie = `VECTORATLAS_LOCALE=${newLocale}; path=/`;
    router.reload(); //.refresh();
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
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
  const langs = SUPPORTED_LANGUAGES;
  return (
    <div>
      <Select
        value={locale}
        onChange={handleChange}
        style={{ border: 0 }}
        MenuProps={MenuProps}
      >
        {langs.map((el) => (
          <MenuItem
            key={el.code}
            value={el.code}
            style={getStyles(el.code, theme)}
          >
            {el.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
