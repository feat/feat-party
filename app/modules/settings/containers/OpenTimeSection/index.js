import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { formatMessage } from '@/services/intl';
import mapErrorMessages from '@/utils/mapErrorMessages';

import Block from '@feat/feat-ui/lib/block';
import Button from '@feat/feat-ui/lib/button';
import notification from '@feat/feat-ui/lib/notification';
import message from '@feat/feat-ui/lib/message';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import OpenTimeForm from './OpenTimeForm';
import OpenTimeSectionList from './OpenTimeSectionList';
import { blockAction } from '../../messages';
import intlMessages from './messages';

import {
  asyncFetchOpenTimes,
  asyncUpdateOpenTime,
} from '../../actions/commerce';

import { selectOpenTimeBlockState, selectOpenTime } from '../../selectors';

import {
  mergeRecords,
  periodIsContinue,
  periodsIsEqual,
  periodMerge,
  openScheduleMerge,
  encodePeriods,
} from './utils';

import './style.scss';

class OpenTimeSection extends React.PureComponent {
  state = {
    isEditModeEnabled: false,
  };

  componentDidMount() {
    const { blockState, data } = this.props;
    if (!blockState.onceFetched && !blockState.loading) {
      this.props.fetchData().catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
    if (blockState.onceFetched && (!data || !data.length)) {
      this.setState({
        isEditModeEnabled: true,
        initialFormValues: this.getInitialFormValues(),
      });
    }
  }

  componentDidUpdate() {
    const { data, blockState } = this.props;
    if (
      !this.state.isEditModeEnabled &&
      blockState.onceFetched &&
      !blockState.loading &&
      !data
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isEditModeEnabled: true,
        initialFormValues: this.getInitialFormValues(),
      });
    }
  }

  getGroupedSections() {
    const { data } = this.props;
    const sections = {};
    if (data && data.length) {
      data.forEach((record) => {
        const key = record.weekdays.join('_');
        const start = moment.utc(record.start).local();
        const until = moment.utc(record.until).local();
        if (sections[key]) {
          sections[key].periods.push({
            start: moment()
              .startOf('day')
              .set('hour', start.get('hour'))
              .set('minute', start.get('minute')),
            until: moment()
              .startOf('day')
              .set('hour', until.get('hour'))
              .set('minute', until.get('minute')),
          });
        } else {
          sections[key] = {
            weekdays: record.weekdays,
            periods: [
              {
                start: moment()
                  .startOf('day')
                  .set('hour', start.get('hour'))
                  .set('minute', start.get('minute')),
                until: moment()
                  .startOf('day')
                  .set('hour', until.get('hour'))
                  .set('minute', until.get('minute')),
              },
            ],
          };
        }
      });
    }
    return Object.keys(sections).map((key) => sections[key]);
  }

  getInitialFormValues() {
    const sectionsArray = this.getGroupedSections();
    const records = [...new Array(7).keys()].map(
      (_, index) =>
        sectionsArray[index] || {
          weekdays: [],
          periods: [],
        },
    );
    return { records };
  }

  formRef = (n) => {
    this.formProps = n;
  };

  toggleLock = (e) => {
    e.preventDefault();
    if (this.state.isEditModeEnabled) {
      if (this.formProps.dirty) {
        this.formProps.submitForm();
      } else {
        this.setState({
          isEditModeEnabled: false,
        });
      }
    } else {
      this.setState({
        isEditModeEnabled: true,
        initialFormValues: this.getInitialFormValues(),
      });
    }
  };

  handleSubmit = (values, { setSubmitting, setErrors }) => {
    // 排序技巧： 不切换时区下， HHmm 格式比较
    const sorted = values.records
      .filter((record) => record.weekdays.length && record.periods.length)
      .map((record) => {
        const sortedPeriods = record.periods
          .map((period) => ({
            start: period.start.startOf('minute'),
            until: period.until.startOf('minute'),
          }))
          .sort((a, b) => a.start.format('HHmm') - b.start.format('HHmm'));

        return {
          weekdays: record.weekdays,
          periods: mergeRecords(
            sortedPeriods,
            undefined,
            periodMerge,
            periodIsContinue,
          ),
        };
      })
      .sort((a, b) => encodePeriods(a.periods) - encodePeriods(b.periods));

    const records = mergeRecords(
      sorted,
      undefined,
      openScheduleMerge,
      periodsIsEqual,
    ).map((record) => ({
      weekdays: record.weekdays,
      periods: record.periods.map((period) => ({
        start: period.start.utc().format(),
        until: period.until.utc().format(),
      })),
    }));

    this.setState({
      isSaving: true,
    });

    return this.props
      .updateOpenTime({
        records,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      .then(() => {
        message.success({
          content: formatMessage(intlMessages.openTimeUpdated),
        });
        this.setState({
          isEditModeEnabled: false,
        });
      })
      .catch((err) => {
        logging.debug(err);
        setSubmitting(false);
        if (err.code === 'VALIDATION_EXCEPTION') {
          if (err.data.records) {
            setErrors(mapErrorMessages(err.data.records));
          } else {
            setErrors(mapErrorMessages(err.data));
          }
        } else {
          notification.error({
            message: 'Error',
            description: err.message,
          });
        }
      })
      .finally(() => {
        this.setState({
          isSaving: false,
        });
      });
  };

  renderToggleButton() {
    return (
      <Button
        type="link"
        className="st-Block__toggleBtn"
        onClick={this.toggleLock}
        style={{ float: 'right' }}
        disabled={this.state.isSaving}
      >
        {!this.state.isEditModeEnabled ? (
          <TranslatableMessage message={blockAction.edit} />
        ) : (
          <TranslatableMessage message={blockAction.lock} />
        )}
      </Button>
    );
  }

  renderEditWidget() {
    return (
      <OpenTimeForm
        formRef={(n) => {
          this.formRef(n);
          if (this.props.formRef) {
            this.props.formRef(n);
          }
        }}
        initialValues={this.state.initialFormValues}
        onSubmit={this.handleSubmit}
      />
    );
  }

  renderInfo() {
    const sections = this.getGroupedSections();
    return <OpenTimeSectionList data={sections} />;
  }

  renderContent() {
    const { blockState, data } = this.props;
    if (blockState.fetchError) {
      return <div>{blockState.fetchError.message}</div>;
    }
    if (this.state.isEditModeEnabled) {
      return this.renderEditWidget();
    }
    if (data) {
      return this.renderInfo();
    }
    return <div>Loading...</div>;
  }

  render() {
    return (
      <Block
        title={
          <TranslatableMessage message={intlMessages.openTimeSectionTitle} />
        }
        subHeader={this.renderToggleButton()}
      >
        {this.renderContent()}
      </Block>
    );
  }
}

OpenTimeSection.propTypes = {
  data: PropTypes.array,
  blockState: PropTypes.object,
  fetchData: PropTypes.func,
  updateOpenTime: PropTypes.func,
  formRef: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  blockState: selectOpenTimeBlockState,
  data: selectOpenTime,
});

const mapDispatchToProps = {
  fetchData: asyncFetchOpenTimes,
  updateOpenTime: asyncUpdateOpenTime,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OpenTimeSection);
