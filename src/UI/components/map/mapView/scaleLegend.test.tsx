import { render } from '../../../test_config/render';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import ScaleLegend from './scaleLegend';
import { AppState } from '../../../state/store';
import { initialState } from '../../../state/map/mapSlice';

jest.mock('./layerUtils', () => ({
  linearGradientColorMap: jest
    .fn()
    .mockReturnValue('linear-gradient(rgb(0,0,0,1))'),
  maxMinUnitsScaleValues: jest
    .fn()
    .mockReturnValue({ max: 10, min: 0, unit: '%' }),
}));

describe('ScaleLegend component', () => {
  let state: Partial<AppState>;
  state = {
    map: initialState(),
  };
  it('renders the component with expected values', () => {
    render(
      <ScaleLegend key="key" overlayName={{ overlayName: 'test' }} />,
      state
    );
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
