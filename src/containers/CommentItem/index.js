import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { Text, Touchable, Flex } from '../../components/common';
import CardTime from '../../components/CardTime';
import CelebrateItemName from '../../containers/CelebrateItemName';

import styles from './styles';

class CommentItem extends Component {
  ref = c => (this.view = c);

  handleLongPress = () => {
    const { item, onLongPress } = this.props;
    onLongPress(item, this.view);
  };

  render() {
    const {
      item: { content, created_at, person },
      organization,
      me,
      isEditing,
      isPressable,
    } = this.props;
    const {
      content: contentStyle,
      editingStyle,
      itemStyle,
      myStyle,
      text,
      myText,
      name: nameStyle,
    } = styles;

    const name = `${person.first_name} ${person.last_name}`;
    const isMine = person.id === me.id;

    return (
      <View style={[contentStyle, isEditing ? editingStyle : null]}>
        <Flex direction="row" align="center">
          {isMine ? (
            <Flex value={1} />
          ) : (
            <CelebrateItemName
              name={name}
              person={person}
              organization={organization}
              pressable={isPressable !== false}
              customContent={<Text style={nameStyle}>{name}</Text>}
            />
          )}
          <CardTime date={created_at} />
        </Flex>
        <Flex direction="row">
          {isMine ? <Flex value={1} /> : null}
          <Touchable
            disabled={isPressable === false}
            onLongPress={this.handleLongPress}
          >
            <View ref={this.ref} style={[itemStyle, isMine ? myStyle : null]}>
              <Text style={[text, isMine ? myText : null]}>{content}</Text>
            </View>
          </Touchable>
          {!isMine ? <Flex value={1} /> : null}
        </Flex>
      </View>
    );
  }
}

CommentItem.propTypes = {
  item: PropTypes.object.isRequired,
  organization: PropTypes.object,
  onLongPress: PropTypes.func,
  isPressable: PropTypes.bool,
};
const mapStateToProps = (
  { auth, celebrateComments: { editingCommentId } },
  { item },
) => ({
  me: auth.person,
  isEditing: editingCommentId === item.id,
});

export default connect(mapStateToProps)(CommentItem);
