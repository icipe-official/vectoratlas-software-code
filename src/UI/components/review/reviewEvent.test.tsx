import { render } from '../../test_config/render';
import { ReviewEventItem } from './reviewEvent';

jest.mock('@mui/icons-material/FileUpload',
  () =>
    function FileUploadsMock() {
      return <div>FileUpload mock</div>;
    }
);
jest.mock('@mui/icons-material/RemoveRedEye',
  () =>
    function RemoveRedEyeMock() {
      return <div>RemoveRedEye mock</div>;
    }
);
jest.mock('@mui/icons-material/DoneOutline',
  () =>
    function DoneOutlineMock() {
      return <div>DoneOutline mock</div>;
    }
);

describe('ReviewEventItem', () => {
  it('renders for In review event', () => {
    const event = {
      type: 'Reviewed',
      performedBy: 'user123',
      performedAt: '2023-02-02T10:35:50.061Z'
    };
    const { wrapper } = render(<ReviewEventItem event={event} />)
    expect(wrapper.container).toMatchSnapshot();
  });

  it('renders for Uploaded event', () => {
    const event = {
      type: 'Uploaded',
      performedBy: 'user123',
      performedAt: '2023-02-02T10:35:50.061Z'
    };
    const { wrapper } = render(<ReviewEventItem event={event} />)
    expect(wrapper.container).toMatchSnapshot();
  });

  it('renders for Approved event', () => {
    const event = {
      type: 'Approved',
      performedBy: 'user123',
      performedAt: '2023-02-02T10:35:50.061Z'
    };
    const { wrapper } = render(<ReviewEventItem event={event} />)
    expect(wrapper.container).toMatchSnapshot();
  });
});
