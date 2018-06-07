import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { mockFnWithParams } from '../../testUtils';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';
import {
  getMySurveys,
  getOrgSurveys,
  getOrgSurveysNextPage,
} from '../../src/actions/surveys';
import { GET_ORGANIZATION_SURVEYS } from '../../src/constants';

let store;
const apiResponse = { type: 'successful' };

beforeEach(() => (store = configureStore([thunk])()));

describe('getMySurveys', () => {
  const query = {
    limit: 100,
    include: '',
  };

  it('should get my surveys', () => {
    mockFnWithParams(api, 'default', apiResponse, REQUESTS.GET_SURVEYS, query);

    store.dispatch(getMySurveys());

    expect(store.getActions()).toEqual([apiResponse]);
  });
});

describe('getOrgSurveys', () => {
  const orgId = '123';
  const query = {
    organization_id: orgId,
  };
  const surveys = [
    {
      name: 'person',
      id: '1',
    },
    {
      name: 'person',
      id: '2',
    },
  ];
  const surveysResponse = {
    type: 'successful',
    response: surveys,
    meta: { total: 50 },
  };
  const getSurveysAction = {
    type: GET_ORGANIZATION_SURVEYS,
    orgId,
    surveys,
    query,
    meta: { total: 50 },
  };

  it('should get surveys in organization', async () => {
    mockFnWithParams(
      api,
      'default',
      surveysResponse,
      REQUESTS.GET_GROUP_SURVEYS,
      query,
    );

    await store.dispatch(getOrgSurveys(orgId));
    expect(store.getActions()).toEqual([surveysResponse, getSurveysAction]);
  });
});

describe('getOrgSurveysNextPage', () => {
  const orgId = '123';
  const query = {
    page: {
      limit: 25,
      offset: 25,
    },
    organization_id: orgId,
  };
  const surveys = [
    {
      id: '1',
      title: 'person',
      contacts_count: 5,
      unassigned_contacts_count: 5,
      uncontacted_contacts_count: 5,
    },
    {
      id: '2',
      title: 'person',
      contacts_count: 5,
      unassigned_contacts_count: 5,
      uncontacted_contacts_count: 5,
    },
  ];
  const surveysResponse = {
    type: 'successful',
    response: surveys,
    meta: { total: 50 },
  };
  const getSurveysAction = {
    type: GET_ORGANIZATION_SURVEYS,
    orgId,
    surveys,
    query,
    meta: { total: 50 },
  };

  it('should get surveys next page in organization', async () => {
    store = configureStore([thunk])({
      organizations: { surveysPagination: { hasNextPage: true, page: 1 } },
    });

    mockFnWithParams(
      api,
      'default',
      surveysResponse,
      REQUESTS.GET_GROUP_SURVEYS,
      query,
    );

    await store.dispatch(getOrgSurveysNextPage(orgId));
    expect(store.getActions()).toEqual([surveysResponse, getSurveysAction]);
  });
});
