import { REQUESTS } from '../api/routes';
import { LOGOUT, LogoutAction } from '../constants';
import { getLocalizedStages } from '../utils/stages';

interface LocalizedPathwayStage {
  locale: string;
  name: string;
  description: string;
  self_followup_description: string;
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  self_followup_description: string;
  position: number;
  name_i18n: string;
  description_i18n: string;
  icon_url: string;
  localized_pathway_stages: LocalizedPathwayStage[];
  locale: string; // Spread from current localized_pathway_stages. Could be updated to a selector instead.
}

export interface StagesState {
  stages: Stage[];
  stagesObj?: { [key: string]: Stage };
}

const initialStagesState: StagesState = {
  stages: [],
  stagesObj: undefined,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stagesReducer(
  state = initialStagesState,
  action:
    | {
        type: typeof REQUESTS.GET_STAGES.SUCCESS;
        results: { response: Stage[] };
      }
    | LogoutAction,
) {
  switch (action.type) {
    case REQUESTS.GET_STAGES.SUCCESS:
      const stages = getLocalizedStages(action.results.response);
      const stagesObj = stages.reduce(
        (stagesObj, stage) => ({
          ...stagesObj,
          [stage.id]: stage,
        }),
        {},
      );
      return {
        ...state,
        stages,
        stagesObj,
      };
    case LOGOUT:
      return initialStagesState;
    default:
      return state;
  }
}

export default stagesReducer;
