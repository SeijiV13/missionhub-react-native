import i18next from 'i18next';

import { CUSTOM_STEP_TYPE } from '../constants';

export function buildCustomStep(text, self_step) {
  return {
    body: text,
    locale: i18next.language,
    challenge_type: CUSTOM_STEP_TYPE,
    self_step,
  };
}

export function insertName(steps, name) {
  return steps.map(step => {
    if (step.description_markdown) {
      return {
        ...step,
        body: step.body.replace('<<name>>', name),
        description_markdown: step.description_markdown.replace(
          /<<name>>/g,
          name,
        ),
      };
    }
    return {
      ...step,
      body: step.body.replace('<<name>>', name),
    };
  });
}
