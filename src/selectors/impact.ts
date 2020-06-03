import { createSelector } from 'reselect';

import { Organization } from '../reducers/organizations';
import { RootState } from '../reducers';

const personIdSelector = (
  _: unknown,
  { person }: { person?: { id: string } } = {},
) => person?.id || '';
const orgIdSelector = (
  _: unknown,
  { organization = {} }: { organization?: Organization } = {},
) => organization.id || '';

export const impactSummarySelector = createSelector(
  ({ impact }: RootState) => impact.summary,
  personIdSelector,
  orgIdSelector,
  (summary, personId, orgId) => summary[`${personId}-${orgId}`] || {},
);
