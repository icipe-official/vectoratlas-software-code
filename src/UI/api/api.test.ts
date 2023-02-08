import {
  fetchLocalVersion,
  fetchApiVersion,
  fetchFeatureFlags,
  fetchMapStyles,
  fetchTileServerOverlays,
  fetchSpeciesList,
  fetchAllData,
  fetchAuth,
  fetchGraphQlData,
  downloadModelOutputData,
  postDataFileAuthenticated,
  postDataFileValidated,
} from './api';
import axios from 'axios';

const protectedUrl = '/api/protected/';
const apiUrl = '/vector-api/';
const graphQlUrl = '/vector-api/graphql';

jest.mock('axios');
jest.mock('js-file-download');

axios.get = jest.fn().mockResolvedValue({ data: 'test get' });
axios.post = jest.fn().mockResolvedValue({ data: 'test post' });

describe(fetchLocalVersion.name, () => {
  it('delegates to axios.get method', async () => {
    await fetchLocalVersion();
    expect(axios.get).toHaveBeenCalledWith('/version.txt');
  });
});
describe(fetchApiVersion.name, () => {
  it('delegates to axios.get method', async () => {
    await fetchApiVersion();
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}config/version`);
  });
});
describe(fetchFeatureFlags.name, () => {
  it('delegates to axios.get method', async () => {
    await fetchFeatureFlags();
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}config/featureFlags`);
  });
});
describe(fetchMapStyles.name, () => {
  it('delegates to axios.get method', async () => {
    await fetchMapStyles();
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}config/map-styles`);
  });
});
describe(fetchTileServerOverlays.name, () => {
  it('delegates to axios.get method', async () => {
    await fetchTileServerOverlays();
    expect(axios.get).toHaveBeenCalledWith(
      `${apiUrl}config/tile-server-overlays`
    );
  });
});
describe(fetchSpeciesList.name, () => {
  it('delegates to axios.get method', async () => {
    await fetchSpeciesList();
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}config/species-list`);
  });
});
describe(fetchAllData.name, () => {
  it('delegates to axios.get method', async () => {
    await fetchAllData();
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}export/downloadAll`);
  });
});
describe(fetchAuth.name, () => {
  it('delegates to axios.get method', async () => {
    await fetchAuth();
    expect(axios.get).toHaveBeenCalledWith(`${protectedUrl}auth`);
  });
});
describe(fetchGraphQlData.name, () => {
  it('delegates to axios.post method', async () => {
    await fetchGraphQlData('query test');
    expect(axios.post).toHaveBeenCalledWith(graphQlUrl, {
      query: 'query test',
    });
  });
});

describe('downloadModelOutputData', () => {
  it('delegates to axios.post for the models/download route', async () => {
    await downloadModelOutputData('blob/location');

    expect(axios.post).toHaveBeenCalledWith(
      `${apiUrl}models/download`,
      { blobLocation: 'blob/location' },
      { responseType: 'blob' }
    );
  });
});

describe('postDataFileAuthenticated', () => {
  it('delegates to axios.post for the ingest/upload route for bionomics data', async () => {
    await postDataFileAuthenticated(
      new File(['aaaaaaaaaaa'], 'test-file'),
      'token123',
      'bionomics',
      'vector-atlas'
    );
    const config = {
      headers: {
        Authorization: 'Bearer token123',
        'Content-Type': 'multipart/form-data',
      },
    };

    expect(axios.post).toHaveBeenCalledWith(
      `${apiUrl}ingest/upload?dataSource=vector-atlas&dataType=bionomics`,
      expect.anything(),
      config
    );
  });

  it('delegates to axios.post for the ingest/uploadOccurrence route for occurrence data with datasetId', async () => {
    await postDataFileAuthenticated(
      new File(['aaaaaaaaaaa'], 'test-file'),
      'token123',
      'occurrence',
      'vector-atlas',
      'id123'
    );
    const config = {
      headers: {
        Authorization: 'Bearer token123',
        'Content-Type': 'multipart/form-data',
      },
    };

    expect(axios.post).toHaveBeenCalledWith(
      `${apiUrl}ingest/upload?dataSource=vector-atlas&dataType=occurrence&datasetId=id123`,
      expect.anything(),
      config
    );
  });
});

describe('postDataFileValidated', () => {
  it('delegates to axios.post for the validate route for bionomics data', async () => {
    await postDataFileValidated(
      new File(['aaaaaaaaaaa'], 'test-file'),
      'token123',
      'bionomics',
      'vector-atlas'
    );
    const config = {
      headers: {
        Authorization: 'Bearer token123',
        'Content-Type': 'multipart/form-data',
      },
    };

    expect(axios.post).toHaveBeenCalledWith(
      `${apiUrl}validation/validateUpload?dataSource=vector-atlas&dataType=bionomics`,
      expect.anything(),
      config
    );
  });

  it('delegates to axios.post for the validate route for occurrence data', async () => {
    await postDataFileValidated(
      new File(['aaaaaaaaaaa'], 'test-file'),
      'token123',
      'occurrence',
      'vector-atlas'
    );
    const config = {
      headers: {
        Authorization: 'Bearer token123',
        'Content-Type': 'multipart/form-data',
      },
    };

    expect(axios.post).toHaveBeenCalledWith(
      `${apiUrl}validation/validateUpload?dataSource=vector-atlas&dataType=occurrence`,
      expect.anything(),
      config
    );
  });
});
