import { initialState } from '../../state/configSlice';
import { AppState } from '../../state/store';
import { render } from '../../test_config/render';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './footer';

describe('Footer component', () => {
  it('displays the versions from the store', () => {
    const state: Partial<AppState> = {
      config: { ...initialState, version_ui: 'ui_test' },
    };

    render(<Footer />, state);
    expect(screen.getByRole('contentinfo')).toHaveTextContent('ui_test');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('local_api');
  });
});
