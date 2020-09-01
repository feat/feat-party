import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { formatMessage } from '@/services/intl';

import FtBlock from '@feat/feat-ui/lib/block';
import Button from '@feat/feat-ui/lib/button';
// import IconButton from '@feat/feat-ui/lib/button/IconButton';
import notification from '@feat/feat-ui/lib/notification';
import message from '@feat/feat-ui/lib/message';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import {
  PRICE_UNIT_HOUR,
  PRICE_UNIT_CASE,
  SERVICE_TYPE_WORKPLACE,
  SERVICE_TYPE_ONLINE,
  SERVICE_TYPE_ON_SITE,
  EXPERTISE_STATUS_PUBLISHED,
} from '@/modules/commerce/constants';

import ExpertiseForm from './ExpertiseForm';

import intlMessages, { form as formMessages } from './messages';

import {
  asyncFetchExpertises,
  asyncCreateExpertise,
  asyncUpdateExpertise,
  asyncPatchExpertise,
  asyncDeleteExpertise,
} from '../../actions/expertise';

import {
  selectExpertiseBlockState,
  selectExpertises,
  selectUserCurrency,
} from '../../selectors';

import './style.scss';

const getPlaceholderInfo = (base = {}) => [
  {
    type: SERVICE_TYPE_ONLINE,
    price: '',
    unit: base.unit || PRICE_UNIT_HOUR,
    is_available: false,
  },
  {
    type: SERVICE_TYPE_ON_SITE,
    price: '',
    unit: base.unit || PRICE_UNIT_HOUR,
    is_available: false,
  },
  {
    type: SERVICE_TYPE_WORKPLACE,
    price: '',
    unit: base.unit || PRICE_UNIT_HOUR,
    is_available: false,
  },
];

function getInitialExpertise(currency) {
  return {
    name: '',
    applications: [],
    services: getPlaceholderInfo(),
    // is_primary: false, // is_primary should be undefined
    // category: null,
    currency,
    profession: [],
    _id: `TMP_${Date.now()}`,
  };
}

function expertiseProcess(values) {
  const processed = { ...values };
  processed.applications = processed.applications.map((option) => option.label);
  // processed.category_profession = processed.profession[0].value;
  processed.profession_categories = processed.profession.map(
    (option) => option.label,
  );
  delete processed.profession;
  // processed.currency = 36;
  if (processed.category) {
    processed.category = processed.category.id || processed.category;
  }
  if (processed.category_exp) {
    processed.category_exp =
      processed.category_exp.id || processed.category_exp;
  }

  processed.services = processed.services.map((item) => ({
    ...item,
    price: item.price || 0,
  }));
  delete processed.is_primary;
  // processed.is_primary = Boolean(processed.is_primary);
  return processed;
}

const MAX_ITEM_COUNT = 3;

class ExpertiseBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tmpIdMap: {},
      records: [],
      recordCache: {},
      submitting: {},
    };

    this.newRecord = null;
    this.submitTimers = {};
    this.unitOptions = [
      {
        value: PRICE_UNIT_HOUR,
        label: formatMessage(formMessages.perHour),
      },
      {
        value: PRICE_UNIT_CASE,
        label: formatMessage(formMessages.perCase),
      },
    ];

    const { data } = props;

    if (data && !data.length) {
      const templateRecord = getInitialExpertise(this.props.userCurrency);
      this.state.records.push(templateRecord);
      this.newRecord = templateRecord._id;
    } else {
      this.state.records = data.map((a) => this.convertToFormState(a));
    }
  }

  componentDidMount() {
    const { blockState } = this.props;
    if (!blockState.onceFetched && !blockState.loading) {
      this.props.fetchExpertises().catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
  }

  saveRequest = (values) => {
    const processed = expertiseProcess(values);
    let promise;
    if (processed.id) {
      const { id, ...data } = processed;
      // should not update name;
      if (processed.status === EXPERTISE_STATUS_PUBLISHED) {
        delete data.name;
      }
      if (!data.category) {
        delete data.category;
        delete data.category_name;
      }
      // const diffData = formDiff(values, this.state.currentExpertise);
      promise = this.props.updateExpertise({ id, data });
    } else {
      promise = this.props.addExpertise(processed);
    }
    return promise;
  };

  handleDelaySave = (values, index, delay = 5000) => {
    const recordKey = values._id || values.id;
    clearTimeout(this.submitTimers[recordKey]);
    this.setState({
      recordCache: {
        ...this.state.recordCache,
        [recordKey]: values,
      },
    });
    const submitCallback = () => {
      this.setState({
        submitting: {
          ...this.state.submitting,
          [recordKey]: true,
        },
      });
      const initialValues = this.state.records[index];
      const processed =
        initialValues.id && !values.id
          ? {
            id: initialValues.id,
            ...values,
          }
          : values;
      if (values.is_primary === undefined) {
        processed.is_primary = initialValues.is_primary;
      }

      // is valid for save
      if (!processed.name) {
        return;
      }
      if (
        processed.status === EXPERTISE_STATUS_PUBLISHED &&
        (!processed.applications.length || !processed.profession.length)
      ) {
        return;
      }

      this.saveRequest(processed)
        .then((expertise) => {
          const nextInitial = this.convertToFormState(expertise);
          if (values._id) {
            nextInitial._id = values._id;
          }
          const updated = [
            ...this.state.records.slice(0, index),
            nextInitial,
            ...this.state.records.slice(index + 1),
          ];
          this.setState({
            records: updated,
          });
          if (!processed.id) {
            this.setState({
              tmpIdMap: {
                ...this.state.tmpIdMap,
                [processed._id]: expertise.id,
              },
            });
          }
        })
        .catch((err) => {
          logging.debug(err);
          notification.error({
            message: formatMessage(intlMessages.expertiseUpdateFailed),
            description: err.message,
          });
        })
        .finally(() => {
          const submitting = { ...this.state.submitting };
          delete submitting[recordKey];
          const recordCache = { ...this.state.recordCache };
          delete recordCache[recordKey];
          this.setState({
            submitting,
            recordCache,
          });
        });
    };
    this.submitTimers[recordKey] = setTimeout(submitCallback, delay);
  };

  convertToFormState(record) {
    const state = { ...record };
    state.services = getPlaceholderInfo(state.available_services[0]).map(
      (item) =>
        (state.available_services &&
          state.available_services.find((i) => i.type === item.type)) ||
        item,
    );
    // state.profession = [
    //   {
    //     value: state.category_profession,
    //     label: state.category_profession_name,
    //   },
    // ];
    state.profession = state.profession_categories.map((item) => ({
      label: item.name,
    }));
    delete state.available_services;

    // if (state.category && !(state.category instanceof Object)) {
    //   const category = this.props.categories.find(
    //     (item) => item.id === state.category,
    //   );
    //   state.category = category;
    // }
    // delete state.category_name;
    return state;
  }

  deleteRow = (index) => {
    const record = this.state.records[index];
    const recordKey = record._id || record.id;
    clearTimeout(this.submitTimers[recordKey]);
    const records = [
      ...this.state.records.slice(0, index),
      ...this.state.records.slice(index + 1),
    ];
    if (records.length === 0) {
      const tempRecord = getInitialExpertise(this.props.userCurrency);
      records.push(tempRecord);
    }
    this.setState({
      records,
    });
    const recordId = record.id || this.state.tmpIdMap[record._id];
    if (recordId) {
      this.props
        .deleteExpertise({ id: recordId })
        .then(() => {
          message.success({
            content: formatMessage(intlMessages.expertiseDeleted),
          });
        })
        .catch((err) => {
          notification.error({
            message: formatMessage(intlMessages.expertiseDeleteFailed),
            description: err.message,
          });
        });
    }
  };

  renderRecords() {
    const { records } = this.state;
    // const showDeleteButton = records.length > 1 || !!records[0].id;

    return (
      <div>
        {records.map((record, index) => {
          const recordKey = record._id || record.id;
          return (
            <ExpertiseForm
              key={recordKey}
              num={index + 1}
              initialValues={this.state.recordCache[recordKey] || record}
              showDeleteButton
              unitOptions={this.unitOptions}
              cancelSubmit={() => {
                clearTimeout(this.submitTimers[recordKey]);
              }}
              delaySubmit={(values, timeout) => {
                this.handleDelaySave(values, index, timeout);
              }}
              onDelete={() => {
                this.deleteRow(index);
              }}
              shouldAutoFocus={recordKey === this.newRecord}
            />
          );
        })}
        {records.length < MAX_ITEM_COUNT && (
          <Button
            className="margin_l_5"
            onClick={() => {
              const tempRecord = getInitialExpertise(this.props.userCurrency);
              this.newRecord = tempRecord._id;
              this.setState({
                records: [...this.state.records, tempRecord],
              });
            }}
          >
            <TranslatableMessage message={intlMessages.expertiseAddLabel} />
          </Button>
        )}
      </div>
    );
  }

  render() {
    const { blockState, data } = this.props;
    if (blockState.fetchError) {
      return (
        <FtBlock
          noPadding
          className="ExpertiseBlock"
          title={
            <span className="padding_x_5">
              <TranslatableMessage
                message={intlMessages.expertiseSectionTitle}
              />
            </span>
          }
          subTitle={
            <TranslatableMessage message={intlMessages.expertiseSectionHint} />
          }
        >
          <div>{blockState.fetchError.message}</div>
        </FtBlock>
      );
    }
    if (data) {
      return (
        <FtBlock
          noPadding
          className="ExpertiseBlock"
          title={
            <span className="padding_x_5">
              <TranslatableMessage
                message={intlMessages.expertiseSectionTitle}
              />
            </span>
          }
          subTitle={
            <TranslatableMessage message={intlMessages.expertiseSectionHint} />
          }
        >
          {this.renderRecords()}
        </FtBlock>
      );
    }

    return (
      <FtBlock
        noPadding
        className="ExpertiseBlock"
        title={
          <span className="padding_x_5">
            <TranslatableMessage message={intlMessages.expertiseSectionTitle} />
          </span>
        }
        subTitle={
          <TranslatableMessage message={intlMessages.expertiseSectionHint} />
        }
      >
        <div>Loading...</div>
      </FtBlock>
    );
  }
}

ExpertiseBlock.propTypes = {
  blockState: PropTypes.object,
  data: PropTypes.array,
  userCurrency: PropTypes.string,
  // categories: PropTypes.array,
  fetchExpertises: PropTypes.func,
  addExpertise: PropTypes.func,
  updateExpertise: PropTypes.func,
  deleteExpertise: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  blockState: selectExpertiseBlockState,
  data: selectExpertises,
  userCurrency: selectUserCurrency,
  // categories: selectUserCategories,
});

const mapDispatchToProps = {
  fetchExpertises: asyncFetchExpertises,
  addExpertise: asyncCreateExpertise,
  updateExpertise: asyncUpdateExpertise,
  patchExpertise: asyncPatchExpertise,
  deleteExpertise: asyncDeleteExpertise,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpertiseBlock);
