import lodash from 'lodash';

import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialState = {
  all: [],
};

function organizationsReducer(state = initialState, action) {
  const results = action.results;
  let orgId;
  switch (action.type) {
    case REQUESTS.GET_MY_ORGANIZATIONS.SUCCESS:
      const myOrgs = (results.findAll('organization') || []).map(o => ({
        text: o.name,
        ...o,
      }));
      return {
        ...state,
        all: myOrgs,
      };
    case REQUESTS.GET_ORGANIZATIONS.SUCCESS:
      const orgs = (results.findAll('organization') || []).map(o => ({
        text: o.name,
        ...o,
      }));
      const allOrgs = lodash.uniqBy([].concat(state.all, orgs), 'id');

      return {
        ...state,
        all: allOrgs,
      };
    case REQUESTS.GET_CONTACTS_COUNT.SUCCESS:
      orgId = action.query.organization_id;
      let contactCount = 0;
      let unassignedCount = 0;
      results.response.assigned_tos.forEach(a => {
        contactCount += a.count;
        unassignedCount += a.person_id === 'unassigned' ? a.count : 0;
      });
      return {
        ...state,
        all: orgId
          ? state.all.map(
              o =>
                o.id === orgId ? { ...o, unassignedCount, contactCount } : o,
            )
          : state.all,
      };
    case REQUESTS.GET_PEOPLE_LIST.SUCCESS:
      orgId = action.query.organization_id;
      const contacts = results.response;
      return {
        ...state,
        all: orgId
          ? state.all.map(o => (o.id === orgId ? { ...o, contacts } : o))
          : state.all,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default organizationsReducer;
