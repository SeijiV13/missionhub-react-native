import { PERSON_FIRST_NAME_CHANGED, PERSON_LAST_NAME_CHANGED, SAVE_NOTES, RESET_ONBOARDING_PERSON } from '../constants';

export function personFirstNameChanged(firstName) {
  return {
    type: PERSON_FIRST_NAME_CHANGED,
    personFirstName: firstName,
  };
}

export function personLastNameChanged(lastName) {
  return {
    type: PERSON_LAST_NAME_CHANGED,
    personLastName: lastName,
  };
}

export function saveNotes(personId, notes) {
  return { type: SAVE_NOTES, personId, notes };
}

export function resetPerson() {
  return { type: RESET_ONBOARDING_PERSON };
}