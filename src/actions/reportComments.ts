import { ThunkDispatch } from 'redux-thunk';

import { ACTIONS } from '../constants';
import { formatApiDate } from '../utils/common';
import { REQUESTS } from '../api/routes';
import { CelebrateComment } from '../reducers/celebrateComments';
import { AuthState } from '../reducers/auth';

import { trackActionWithoutData } from './analytics';
import callApi from './api';

export function reportComment(orgId: string, item: CelebrateComment) {
  return async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: ThunkDispatch<{}, {}, any>,
    getState: () => { auth: AuthState },
  ) => {
    const { id: myId } = getState().auth.person;
    const commentId = item.id;

    const result = await dispatch(
      callApi(
        REQUESTS.CREATE_REPORT_COMMENT,
        { orgId },
        {
          data: {
            attributes: {
              comment_id: commentId,
              person_id: myId,
            },
          },
        },
      ),
    );

    dispatch(trackActionWithoutData(ACTIONS.CELEBRATE_COMMENT_REPORTED));
    return result;
  };
}

export function ignoreReportComment(orgId: string, reportCommentId: string) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: ThunkDispatch<{}, {}, any>,
  ) =>
    dispatch(
      callApi(
        REQUESTS.UPDATE_REPORT_COMMENT,
        {
          orgId,
          reportCommentId,
        },
        {
          data: {
            attributes: { ignored_at: formatApiDate() },
          },
        },
      ),
    );
}

export function getReportedComments(orgId: string) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: ThunkDispatch<{}, {}, any>,
  ) =>
    dispatch(
      callApi(
        REQUESTS.GET_REPORTED_COMMENTS,
        {
          orgId,
        },
        {
          filters: { ignored: false },
          include: 'comment,comment.person,person',
        },
      ),
    );
}
