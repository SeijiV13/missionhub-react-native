/* eslint max-lines: 0 */
import React from 'react';
import { ActionSheetIOS } from 'react-native';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { ORG_PERMISSIONS } from '../../../constants';
import { orgPermissionSelector } from '../../../selectors/people';
import { getPersonDetails } from '../../../actions/person';
import { navigatePush } from '../../../actions/navigation';
import { RelationshipTypeEnum } from '../../../../__generated__/globalTypes';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';

import AddContactFields from '..';

jest.mock('../../../selectors/people');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');

const orgPermission = { permission_id: ORG_PERMISSIONS.CONTACT };
const getPersonDetailsResults = { type: 'get person details' };
const navigatePushResults = { type: 'navigate push' };

const initialState = { auth: { person: {} } };
const onUpdateData = jest.fn();
const emptyPerson = {
  id: '',
  firstName: '',
  lastName: '',
  relationshipType: null,
  stage: null,
};

beforeEach(() => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
    orgPermission,
  );
  (getPersonDetails as jest.Mock).mockReturnValue(getPersonDetailsResults);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResults);
});

it('renders correctly | No Person', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      organization={null}
      onUpdateData={onUpdateData}
      person={emptyPerson}
    />,
    {
      initialState,
    },
  );
  snapshot();
});

it('render correctly | With Person', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      organization={null}
      onUpdateData={onUpdateData}
      person={{
        id: '1',
        relationshipType: null,
        firstName: 'Christian',
        lastName: 'Huffman',
        stage: {
          name: 'Forgiven',
          __typename: 'Stage',
        },
      }}
    />,
    {
      initialState,
    },
  );
  snapshot();
});

describe('calls methods', () => {
  it('calls update firstName and changeFocusedField', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddContactFields
        organization={null}
        onUpdateData={onUpdateData}
        person={emptyPerson}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    fireEvent(getByTestId('firstNameInput'), 'onFocus');
    fireEvent.changeText(getByTestId('firstNameInput'), 'Christian');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      firstName: 'Christian',
      id: '',
      lastName: '',
      relationshipType: null,
      stage: null,
    });
  });

  it('calls update lastName and changeFocusedField', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddContactFields
        organization={null}
        onUpdateData={onUpdateData}
        person={emptyPerson}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    fireEvent(getByTestId('lastNameInput'), 'onFocus');
    fireEvent.changeText(getByTestId('lastNameInput'), 'Huffman');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      firstName: '',
      lastName: 'Huffman',
      id: '',
      relationshipType: null,
      stage: null,
    });
  });

  it('updates relationshipType', () => {
    ActionSheetIOS.showActionSheetWithOptions = jest.fn();
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddContactFields
        organization={null}
        onUpdateData={onUpdateData}
        person={{
          id: '1',
          relationshipType: RelationshipTypeEnum.family,
          firstName: 'Christian',
          lastName: 'Huffman',
          stage: {
            name: 'Forgiven',
            __typename: 'Stage',
          },
        }}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    fireEvent(getByTestId('popupMenuButton'), 'onPress');
    (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
      1,
    );
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      firstName: 'Christian',
      lastName: 'Huffman',
      id: '1',
      relationshipType: RelationshipTypeEnum.friend,
      stage: {
        name: 'Forgiven',
        __typename: 'Stage',
      },
    });
  });

  it('updates Stage', () => {
    ActionSheetIOS.showActionSheetWithOptions = jest.fn();
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddContactFields
        organization={null}
        onUpdateData={onUpdateData}
        person={{
          id: '1',
          relationshipType: RelationshipTypeEnum.family,
          firstName: 'Christian',
          lastName: 'Huffman',
          stage: {
            __typename: 'Stage',
            name: 'Forgiven',
          },
        }}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    fireEvent.press(getByTestId('stageSelectButton'));
    expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
      enableBackButton: false,
      personId: '1',
      section: 'people',
      subsection: 'person',
      orgId: undefined,
      isEdit: true,
      onComplete: expect.any(Function),
    });
    (navigatePush as jest.Mock).mock.calls[0][1].onComplete({
      name: 'Growing',
    });
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      firstName: 'Christian',
      lastName: 'Huffman',
      id: '1',
      relationshipType: RelationshipTypeEnum.family,
      stage: {
        name: 'Growing',
      },
    });
  });
});
