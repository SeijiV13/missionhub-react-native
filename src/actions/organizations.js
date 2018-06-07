import {
  GET_ORGANIZATION_CONTACTS,
  GET_ORGANIZATIONS_CONTACTS_REPORT,
} from '../constants';

import callApi, { REQUESTS } from './api';

const getOrganizationsQuery = {
  limit: 100,
  include: '',
};

export function getMyOrganizations() {
  return getOrganizations(REQUESTS.GET_MY_ORGANIZATIONS, getOrganizationsQuery);
}

export function getAssignedOrganizations() {
  const query = {
    ...getOrganizationsQuery,
    filters: { assigned_tos: 'me' },
  };

  return getOrganizations(REQUESTS.GET_ORGANIZATIONS, query);
}

function getOrganizations(requestObject, query) {
  return dispatch => dispatch(callApi(requestObject, query));
}

export function getOrganizationsContactReports() {
  return async dispatch => {
    const { response } = await dispatch(
      callApi(REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT, { period: 'P1W' }),
    );

    dispatch({
      type: GET_ORGANIZATIONS_CONTACTS_REPORT,
      reports: response.map(r => ({
        id: `${r.organization_id}`,
        contactsCount: r.contact_count,
        unassignedCount: r.unassigned_count,
        uncontactedCount: r.uncontacted_count,
      })),
    });
    return response;
  };
}

export function getOrganizationContacts(orgId) {
  const query = {
    organization_id: orgId,
    filters: {
      permissions: 'no_permission',
    },
    include:
      'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions',
  };
  return async dispatch => {
    const { response } = await dispatch(
      callApi(REQUESTS.GET_PEOPLE_LIST, query),
    );
    dispatch({ type: GET_ORGANIZATION_CONTACTS, orgId, contacts: response });
    return response;
  };
}

export function addNewContact(data) {
  return (dispatch, getState) => {
    const {
      person: { id: myId },
    } = getState().auth;
    if (!data || !data.firstName) {
      return Promise.reject('InvalidData', data);
    }
    let included = [];
    included.push({
      type: 'contact_assignment',
      attributes: {
        assigned_to_id: myId,
        organization_id: data.orgId || undefined,
      },
    });
    if (data.orgId) {
      included.push({
        type: 'organizational_permission',
        attributes: { organization_id: data.orgId },
      });
    }
    if (data.email) {
      included.push({
        type: 'email',
        attributes: { email: data.email },
      });
    }
    if (data.phone) {
      included.push({
        type: 'phone_number',
        attributes: {
          number: data.phone,
          location: 'mobile',
        },
      });
    }
    const bodyData = {
      data: {
        type: 'person',
        attributes: {
          first_name: data.firstName,
          last_name: data.lastName || undefined,
          gender: data.gender || undefined,
        },
      },
      included,
    };
    const query = {};
    return dispatch(callApi(REQUESTS.ADD_NEW_PERSON, query, bodyData));
  };
}
