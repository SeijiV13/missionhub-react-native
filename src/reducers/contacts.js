import { LOGOUT, ORGANIZATION_CONTACTS_SEARCH } from '../constants';

const initialState = {
  allByOrg: {
    personal: { id: 'personal', allById: {} },
  },
};

export default function contactsReducer(state = initialState, action) {
  switch (action.type) {
    case ORGANIZATION_CONTACTS_SEARCH:
      return loadContacts(state, action);
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

function loadContacts(state, action) {
  const { orgId, contacts } = action;
  const org = state.allByOrg[orgId] || { id: orgId, allById: {} };

  contacts.forEach(c => {
    const e = org.allById[c.id];
    org.allById[c.id] = e ? { ...e, ...c } : c;
  });

  return {
    ...state,
    allByOrg: {
      ...state.allByOrg,
      [orgId]: org,
    },
  };
}
