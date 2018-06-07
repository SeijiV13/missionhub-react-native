import lodash from 'lodash';

import {
  LOGOUT,
  GET_ORGANIZATION_CONTACTS,
  GET_ORGANIZATION_SURVEYS,
} from '../constants';
import { REQUESTS } from '../actions/api';
import { getPagination } from '../utils/common';

const initialState = {
  all: [],
  surveysPagination: {
    hasNextPage: true,
    page: 1,
  },
  celebratePagination: {
    hasNextPage: true,
    page: 1,
  },
};

function organizationsReducer(state = initialState, action) {
  const results = action.results;
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
    case GET_ORGANIZATION_CONTACTS:
      const { orgId, contacts } = action;
      return {
        ...state,
        all: orgId
          ? state.all.map(o => (o.id === orgId ? { ...o, contacts } : o))
          : state.all,
      };
    case GET_ORGANIZATION_SURVEYS:
      const { orgId: surveyOrgId, query: surveyQuery, surveys } = action;
      const currentOrg = state.all.find(o => o.id === surveyOrgId);
      if (!currentOrg) return state; // Return if the organization does not exist
      const existingSurveys = currentOrg.surveys || [];
      const allSurveys =
        surveyQuery.page && surveyQuery.page.offset > 0
          ? [...existingSurveys, ...surveys]
          : surveys;
      return {
        ...state,
        all: surveyOrgId
          ? state.all.map(
              o => (o.id === surveyOrgId ? { ...o, surveys: allSurveys } : o),
            )
          : state.all,
        surveysPagination: getPagination(action, allSurveys.length),
      };
    case REQUESTS.GET_GROUP_CELEBRATE_FEED.SUCCESS:
      const newItems = action.results.response;
      const celebrateOrgId = action.query.orgId;
      console.log(newItems);

      const allItems =
        action.query.page && action.query.page.offset > 0
          ? [...(state.items || []), ...newItems]
          : newItems;

      return {
        ...state,
        all: celebrateOrgId
          ? state.all.map(
              o =>
                o.id === celebrateOrgId
                  ? { ...o, celebrateItems: allItems }
                  : o,
            )
          : state.all,
        celebratePagination: getPagination(action, allItems.length),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default organizationsReducer;
