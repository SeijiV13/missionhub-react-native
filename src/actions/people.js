import callApi, { REQUESTS } from './api';


export function getPeopleList() {
  return (dispatch, getState) => {
    const orgId = getState().organizations.myOrgId;
    if (!orgId) {
      LOG('Could not get users organization id');
      return Promise.reject('NoOrganization');
    }
    const query = {
      organization_id: orgId,
      // filters: {}
    };
    return dispatch(callApi(REQUESTS.GET_PEOPLE_LIST, query));
  };
}

export function searchPeople(text, filters = {}) {
  return (dispatch) => {
    if (!text) {
      return Promise.reject('NoText');
    }
    const query = {
      q: text,
      filters,
    };
    return dispatch(callApi(REQUESTS.SEARCH, query));
  };
}