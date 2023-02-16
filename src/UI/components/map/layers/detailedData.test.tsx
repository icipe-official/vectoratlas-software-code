import { DetailedOccurrence } from '../../../state/map/mapSlice';
import { render, screen } from '../../../test_config/render';
import DetailedData from './detailedData';

jest.mock(
  '@mui/icons-material/Thunderstorm',
  () =>
    function MockThunderstormIcon() {
      return <div>Thunderstorm</div>;
    }
);
jest.mock(
  '@mui/icons-material/WbSunny',
  () =>
    function MockWbSunnyIcon() {
      return <div>WbSunny</div>;
    }
);

describe('DetailedData', () => {
  const data: DetailedOccurrence = {
    id: '123',
    year_start: 1990,
    month_start: 7,
    sample: {
      mossamp_tech_1: 'HRI',
    },
    recorded_species: {
      species: 'gambaie',
    },
    reference: {
      author: 'Test Author',
      year: 1989,
      citation: 'Test citation',
    },
    bionomics: {
      adult_data: true,
      larval_site_data: false,
      season_given: 'Rainy',
      season_calc: null,
    },
  };

  it('shows all regular data correctly', () => {
    render(<DetailedData data={data} />);
    expect(screen.getByText('Anopheles gambaie')).toBeInTheDocument();
    expect(screen.getByText('7/1990')).toBeInTheDocument();
    expect(screen.getByText('HRI')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Test citation')).toBeInTheDocument();
    expect(screen.getByText('1989')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('shows adult data correctly', () => {
    render(<DetailedData data={data} />);
    expect(screen.getByText('Adult')).toBeInTheDocument();
    expect(screen.queryByText('Larval')).not.toBeInTheDocument();
  });

  it('shows larval data correctly', () => {
    data.bionomics.adult_data = false;
    data.bionomics.larval_site_data = true;
    render(<DetailedData data={data} />);
    expect(screen.getByText('Larval')).toBeInTheDocument();
    expect(screen.queryByText('Adult')).not.toBeInTheDocument();
  });

  it('shows rainy data correctly', () => {
    render(<DetailedData data={data} />);
    expect(screen.getByText('Thunderstorm')).toBeInTheDocument();
    expect(screen.queryByText('WbSunny')).not.toBeInTheDocument();
  });

  it('shows dry data correctly', () => {
    data.bionomics.season_given = 'dry';
    render(<DetailedData data={data} />);
    expect(screen.getByText('WbSunny')).toBeInTheDocument();
    expect(screen.queryByText('Thunderstorm')).not.toBeInTheDocument();
  });
});
