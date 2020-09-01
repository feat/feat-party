import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux';

import { selectCurrentUser } from '@/modules/auth/selectors';

import Button from '@feat/feat-ui/lib/button';
import FtBlock from '@feat/feat-ui/lib/block';

import message from '@feat/feat-ui/lib/message';
import notification from '@feat/feat-ui/lib/notification';

import { formatMessage } from '@/services/intl';
import { initCache } from '@/services/cache';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import mapErrorMessages from '@/utils/mapErrorMessages';

import CareerForm from './CareerForm';
import CareerList from './CareerList';
import CareerItem from './CareerItem';
import { blockAction } from '../../messages';
import intlMessages, { form as formMessages } from './messages';

import {
  asyncFetchCareers,
  asyncCreateCareer,
  asyncDeleteCareer,
} from '../../actions/career';
import {
  selectCareerBlockState,
  selectCareers,
} from '../../selectors';


class CareerBlock extends Component {
  constructor(props) {
    super(props);
    const { blockState, careers } = props;
    this.cache = initCache({
      userId: props.currentUser.uid,
      cacheKey: 'settings.career',
    })
    if (this.cache.hasData()) {
      this.state = {
        createMode: this.cache.get('createMode'),
      }
    } else if (!blockState.onceFetched || blockState.loading || !careers || careers.length) {
      this.state = {
        createMode: false,
      }
    } else {
      this.state = {
        createMode: true,
      }
    }
  }

  componentDidMount() {
    const { blockState } = this.props;
    if (!blockState.onceFetched && !blockState.loading) {
      this.props.fetchCareers().catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        })
      });
    }
  }

  componentDidUpdate() {
    const { blockState, careers } = this.props;
    if (
      !this.state.createMode &&
      blockState.onceFetched &&
      !blockState.loading &&
      (careers && careers.length === 0)
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        createMode: true,
      })
    }
  }

  initCreate = () => {
    this.setState({
      createMode: true,
    });
    this.cache.set('createMode', true);
  }

  exitCreate = () => {
    this.setState({
      createMode: false,
    });
    this.cache.set('createMode', false);
    this.cache.set('formValues', null);
  }

  handleSave = (values, { setSubmitting, setErrors }) => {
    const { ...data } = values;
    if (data.working_on) {
      data.since = data.since.format('YYYY-MM-DD');
      delete data.period;
    } else {
      data.since = data.period.since.format('YYYY-MM-DD');
      data.until = data.period.until.format('YYYY-MM-DD');
    }
    return this.props
      .createCareer(data)
      .then(() => {
        this.exitCreate();
        message.success({
          content: formatMessage(formMessages.careerCreated),
        });
      })
      .catch((err) => {
        logging.debug(err);
        if (err.code === 'VALIDATION_EXCEPTION') {
          setErrors(mapErrorMessages(err.data));
        } else {
          setErrors({ _error: err.message });
        }
        setSubmitting(false);
      });
  };

  handleDelete = (item) => {
    this.props.deleteCareer(item)
      .then(() => {
        message.success({
          content: formatMessage(formMessages.careerDeleted),
        });
      }).catch((err) => {
        notification.error({
          message: formatMessage(formMessages.careerDeleteFailed),
          description: err.message,
        });
      })
    ;
  }

  renderItems() {
    const { careers } = this.props;
    return (
      <React.Fragment>
        <FtBlock.Help className="padding_5">
          <TranslatableMessage message={intlMessages.sectionHint} />
        </FtBlock.Help>
        {careers &&
          !!careers.length && (
          <CareerList>
            {careers.map((career) => (
              <CareerItem
                key={career.id}
                data={career}
                onDelete={() => {
                  this.handleDelete(career);
                }}
              />
            ))}
          </CareerList>
        )}
      </React.Fragment>
    );
  }

  render() {
    const { blockState, careers } = this.props;
    if (!blockState.onceFetched || blockState.loading || blockState.fetchError) {
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
          ) : <div>Loading...</div>}
        </FtBlock>
      )
    }

    if (this.state.createMode) {
      return (
        <CareerForm 
          canCancel={careers.length > 0}
          onCancel={this.exitCreate}
          formRef={this.props.formRef}
          onSubmit={this.handleSave}
          cacheValues={this.cache.get('formValues')}
          updateCache={(values) => {
            this.cache.set('formValues', values);
          }}
        />
      )
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
            <TranslatableMessage
              message={blockAction.add}
            />
          </Button>
        }
        noPadding
      >
        {careers && this.renderItems()}
      </FtBlock>
    )
  }
}

CareerBlock.propTypes = {
  blockState: PropTypes.object,
  currentUser: PropTypes.object,
  careers: PropTypes.array,
  formRef: PropTypes.func,
  fetchCareers: PropTypes.func,
  createCareer: PropTypes.func,
  deleteCareer: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  blockState: selectCareerBlockState,
  careers: selectCareers,
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = {
  fetchCareers: asyncFetchCareers,
  createCareer: asyncCreateCareer,
  deleteCareer: asyncDeleteCareer,
}

export default connect(mapStateToProps, mapDispatchToProps)(CareerBlock);
