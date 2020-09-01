import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import {
  EDUCATION_TYPE_TRAINING,
  EDUCATION_TYPE_SENIOR,
} from '@/modules/user/constants';
import { formatMessage } from '@/services/intl';
import { initCache } from '@/services/cache';
import { selectCurrentUser } from '@/modules/auth/selectors';
import mapErrorMessages from '@/utils/mapErrorMessages';

import Button from '@feat/feat-ui/lib/button';
import FtBlock from '@feat/feat-ui/lib/block';
import notification from '@feat/feat-ui/lib/notification';
import message from '@feat/feat-ui/lib/message';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import EducationForm from './EducationForm';
import EducationList from './EducationList';
import EducationItem from './EducationItem';
import intlMessages from './messages';
import { blockAction } from '../../messages';

import {
  asyncFetchEducations,
  asyncCreateEducation,
  asyncDeleteEducation,
} from '../../actions/education';
import { selectEducationBlockState, selectEducations } from '../../selectors';

class Education extends Component {
  constructor(props) {
    super(props);
    const { blockState, educations } = props;
    this.cache = initCache({
      userId: props.currentUser.uid,
      cacheKey: 'settings.education',
      src: null,
    });
    if (this.cache.hasData()) {
      this.state = {
        createMode: this.cache.get('createMode'),
      };
    } else if (
      !blockState.onceFetched ||
      blockState.loading ||
      !educations ||
      educations.length
    ) {
      this.state = {
        createMode: false,
      };
    } else {
      this.state = {
        createMode: true,
      };
    }
  }

  componentDidMount() {
    const { blockState } = this.props;
    if (!blockState.onceFetched && !blockState.loading) {
      this.props.fetchEducations().catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
  }

  componentDidUpdate() {
    const { blockState, educations } = this.props;
    if (
      !this.state.createMode &&
      blockState.onceFetched &&
      !blockState.loading &&
      (educations && educations.length === 0)
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.initCreate();
    }
  }

  initCreate = () => {
    this.setState({
      createMode: true,
    });
    this.cache.set('createMode', true);
  };

  exitCreate = () => {
    this.setState({
      createMode: false,
    });
    this.cache.set('createMode', false);
    this.cache.set('formValues', null);
  };

  handleSave = (values, { setSubmitting, setErrors }) => {
    const data = { ...values };
    if (data.type === EDUCATION_TYPE_SENIOR) {
      delete data.title;
    } else {
      delete data.city;
    }

    data.since =
      data.type === EDUCATION_TYPE_TRAINING
        ? moment(data.period.since)
          .startOf('month')
          .format('YYYY-MM-DD')
        : moment(data.period.since)
          .startOf('year')
          .format('YYYY-MM-DD');
    data.until =
      data.type === EDUCATION_TYPE_TRAINING
        ? moment(data.period.until)
          .startOf('month')
          .format('YYYY-MM-DD')
        : moment(data.period.until)
          .startOf('year')
          .format('YYYY-MM-DD');

    delete data.period;

    this.props
      .createEducation(data)
      .then(() => {
        this.exitCreate();
        message.success({
          content: formatMessage(intlMessages.educationCreated),
        });
      })
      .catch((err) => {
        setSubmitting(false);
        if (err.code === 'VALIDATION_EXCEPTION') {
          setErrors(mapErrorMessages(err.data));
        } else {
          notification.error({
            message: 'Error',
            description: err.message,
          });
        }
      });
  };

  handleDelete = (item) => {
    this.props
      .deleteEducation(item)
      .then(() => {
        message.success({
          content: formatMessage(intlMessages.educationDeleted),
        });
      })
      .catch((err) => {
        notification.error({
          message: formatMessage(intlMessages.educationDeleteFailed),
          description: err.message,
        });
      });
  };

  renderItems() {
    const { educations } = this.props;
    return (
      <React.Fragment>
        <FtBlock.Help className="padding_5">
          <TranslatableMessage message={intlMessages.sectionHint} />
        </FtBlock.Help>
        {educations &&
          !!educations.length && (
          <EducationList>
            {educations.map((education) => (
              <EducationItem
                key={education.id}
                data={education}
                onDelete={() => {
                  this.handleDelete(education);
                }}
              />
            ))}
          </EducationList>
        )}
      </React.Fragment>
    );
  }

  render() {
    const { blockState, educations } = this.props;
    if (
      !blockState.onceFetched ||
      blockState.loading ||
      blockState.fetchError
    ) {
      return (
        <FtBlock
          title={
            <span className="padding_x_5">
              <TranslatableMessage message={intlMessages.sectionTitle} />
            </span>
          }
          noPadding
        >
          {blockState.fetchError ? (
            <div>{blockState.fetchError.message}</div>
          ) : (
            <div>Loading...</div>
          )}
        </FtBlock>
      );
    }

    if (this.state.createMode) {
      return (
        <EducationForm
          canCancel={educations.length > 0}
          onCancel={this.exitCreate}
          formRef={this.props.formRef}
          onSubmit={this.handleSave}
          cacheValues={this.cache.get('formValues')}
          updateCache={(values) => {
            this.cache.set('formValues', values);
          }}
        />
      );
    }

    return (
      <FtBlock
        title={
          <span className="padding_x_5">
            <TranslatableMessage message={intlMessages.sectionTitle} />
          </span>
        }
        subHeader={
          <Button
            type="link"
            onClick={this.initCreate}
            style={{ float: 'right' }}
            aria-label="edit-toggle"
          >
            <TranslatableMessage message={blockAction.add} />
          </Button>
        }
        noPadding
      >
        {educations && this.renderItems()}
      </FtBlock>
    );
  }
}

Education.propTypes = {
  blockState: PropTypes.object,
  currentUser: PropTypes.object,
  educations: PropTypes.array,
  formRef: PropTypes.func,
  fetchEducations: PropTypes.func, // promise
  createEducation: PropTypes.func, // promise
  deleteEducation: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  blockState: selectEducationBlockState,
  educations: selectEducations,
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = {
  fetchEducations: asyncFetchEducations,
  createEducation: asyncCreateEducation,
  deleteEducation: asyncDeleteEducation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Education);
