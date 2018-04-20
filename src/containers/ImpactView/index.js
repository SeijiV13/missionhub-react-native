import React, { Component } from 'react';
import { ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { getGlobalImpact, getMyImpact, getUserImpact, getImpactById } from '../../actions/impact';

import styles from './styles';
import { Flex, Text, Button, Icon } from '../../components/common';
import { INTERACTION_TYPES } from '../../constants';

const reportPeriods = [
  {
    id: 1,
    text: '1w',
    period: 'P1W',
  },
  {
    id: 2,
    text: '1m',
    period: 'P1M',
  },
  {
    id: 3,
    text: '3m',
    period: 'P3M',
  },
  {
    id: 4,
    text: '6m',
    period: 'P6M',
  },
  {
    id: 5,
    text: '1y',
    period: 'P1Y',
  },
];

@translate('impact')
export class ImpactView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userImpact: {},
      interactions: [],
      period: 'P1W',
      impactById: null,
    };
  }

  componentWillMount() {
    if (this.props.isContactScreen) {
      this.getInteractionReport();
      this.props.dispatch(getImpactById(this.props.user.id)).then((results) => {
        this.setState({ impactById: results.findAll('impact_report')[0] || {} });
      });
    } else {
      this.props.dispatch(getGlobalImpact());
      this.props.dispatch(getMyImpact());
    }
  }

<<<<<<< HEAD
  componentWillReceiveProps() {
    this.getInteractionReport();
  }

  async getInteractionReport() {
    const { dispatch, user, me, organization = {} } = this.props;

    const { response: personReports } = await dispatch(getUserImpact(user ? user.id : me.id, organization.id, this.state.period));

    const report = personReports[0];
    const interactions = report ? report.interactions : [];
    const arr = Object.keys(INTERACTION_TYPES).filter((k) => !INTERACTION_TYPES[k].hideReport).map((key) => {
      let num = 0;
      if (INTERACTION_TYPES[key].requestFieldName) {
        num = report ? report[INTERACTION_TYPES[key].requestFieldName] : 0;
      } else {
        const interaction = interactions.find((i) => i.interaction_type_id === INTERACTION_TYPES[key].id);
        num = interaction ? interaction.interaction_count : 0;
      }
      return {
        ...INTERACTION_TYPES[key],
        num,
      };
=======
  getInteractionReport() {
    const { dispatch, user, organization = {} } = this.props;
    dispatch(getUserImpact(user.id, organization.id, this.state.period)).then((r) => {
      const report = r.findAll('person_report')[0];
      const interactions = report ? report.interactions : [];
      const arr = Object.keys(INTERACTION_TYPES).filter((k) => !INTERACTION_TYPES[k].hideReport).map((key) => {
        let num = 0;
        if (INTERACTION_TYPES[key].requestFieldName) {
          num = report ? report[INTERACTION_TYPES[key].requestFieldName] : 0;
        } else {
          const interaction = interactions.find((i) => i.interaction_type_id === INTERACTION_TYPES[key].id);
          num = interaction ? interaction.interaction_count : 0;
        }
        return {
          ...INTERACTION_TYPES[key],
          num,
        };
      });
      this.setState({ userImpact: r, interactions: arr });
>>>>>>> master
    });
  }

  handleChangePeriod(period) {
    this.setState({ period }, () => {
      this.getInteractionReport();
    });
  }

  buildImpactSentence({ steps_count = 0, receivers_count = 0, step_owners_count = 0, pathway_moved_count = 0 }, global = false) {
    const { t, isContactScreen, user } = this.props;
    const initiator = global ? '$t(users)' : isContactScreen ? user.first_name : '$t(you)';
    const context = (count) => count === 0 ? global ? 'emptyGlobal' : isContactScreen ? 'emptyContact' : 'empty' : '';

    const stepsSentenceOptions = {
      context: context(steps_count),
      year: new Date().getFullYear(),
      numInitiators: global ? step_owners_count : '',
      initiator: initiator,
      stepsCount: steps_count,
      receiversCount: receivers_count,
    };

    const stageSentenceOptions = {
      context: context(pathway_moved_count),
      initiator: initiator,
      pathwayMovedCount: pathway_moved_count,
    };

    return `${t('stepsSentence', stepsSentenceOptions)}\n\n${t('stageSentence', stageSentenceOptions)}`;
  }

  renderContactReport() {
    return (
      <Flex style={styles.interactionsWrap} direction="column">
        <Flex style={{ paddingBottom: 30 }} align="center" justify="center" direction="row">
          {
            reportPeriods.map((p) => {
              return (
                <Button
                  key={p.id}
                  text={p.text}
                  onPress={() => this.handleChangePeriod(p.period)}
                  style={this.state.period === p.period ? styles.activeButton : styles.periodButton}
                  buttonTextStyle={styles.buttonText}
                />
              );
            })
          }
        </Flex>
        {
          this.state.interactions.map((i) => {
            return (
              <Flex align="center" style={styles.interactionRow} key={i.id} direction="row">
                <Flex value={1}>
                  <Icon type="MissionHub" style={styles.icon} name={i.iconName} />
                </Flex>
                <Flex value={4}>
                  <Text style={styles.interactionText}>{this.props.t(i.translationKey)}</Text>
                </Flex>
                <Flex value={1} justify="center" align="end">
                  <Text style={styles.interactionNumber}>{i.num || '-'}</Text>
                </Flex>
              </Flex>
            );
          })
        }
      </Flex>
    );
  }

  render() {
    const { globalImpact, myImpact, isContactScreen } = this.props;
    let impact = this.state.impactById || myImpact;
    return (
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
      >
        <Flex style={styles.topSection}>
          <Text style={[ styles.text, styles.topText ]}>
            {this.buildImpactSentence(isContactScreen && this.state.userImpact ? this.state.userImpact : impact)}
          </Text>
        </Flex>
        <Image style={styles.image} source={require('../../../assets/images/impactBackground.png')} />
        <Flex style={isContactScreen ? styles.interactionSection : styles.bottomSection}>
          {
            isContactScreen ? this.renderContactReport() : (
              <Text style={[ styles.text, styles.bottomText ]}>
                {this.buildImpactSentence(globalImpact, true)}
              </Text>
            )
          }
        </Flex>
      </ScrollView>
    );
  }
}

ImpactView.propTypes = {
  isContactScreen: PropTypes.bool,
  user: PropTypes.object,
};

export const mapStateToProps = ({ impact }) => ({
  myImpact: impact.mine,
  globalImpact: impact.global,
});

export default connect(mapStateToProps)(ImpactView);
