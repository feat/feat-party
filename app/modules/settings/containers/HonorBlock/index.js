import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux';

import { selectCurrentUser } from '@/modules/auth/selectors';
import { initCache } from '@/services/cache';
import Button from '@feat/feat-ui/lib/button';
import FtBlock from '@feat/feat-ui/lib/block';
import notification from '@feat/feat-ui/lib/notification';
import message from '@feat/feat-ui/lib/message';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { formatMessage } from '@/services/intl';
import mapErrorMessages from '@/utils/mapErrorMessages';

import HonorList from './HonorList';
import HonorItem from './HonorItem';
import HonorForm from './HonorForm';
import { blockAction } from '../../messages';
import intlMessages from './messages';

import { 
  asyncFetchHonors,
  asyncCreateHonor, 
  asyncDeleteHonor,
} from '../../actions/honor';
import { 
  selectHonorBlockState,
  selectHonors,
} from '../../selectors';

class HonorBlock extends Component {
  constructor(props) {
    super(props);
    const { blockState, data } = props;
    this.cache = initCache({
      userId: props.currentUser.uid,
      cacheKey: 'settings.honor',
    })
    if (this.cache.hasData()) {
      this.state = {
        createMode: this.cache.get('createMode'),
      }
    } else if (!blockState.onceFetched || blockState.loading || !data || data.length) {
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
      this.props.fetchHonors().catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
  }

  componentDidUpdate() {
    const { blockState, data } = this.props;
    if (
      !this.state.createMode &&
      blockState.onceFetched &&
      !blockState.loading &&
      (data && data.length === 0)
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
    })
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
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('organization', values.organization);
    formData.append('issued_at', values.issued_at.format('YYYY-MM-DD'));
    formData.append('pic', values.pic);

    return this.props
      .createHonor(formData)
      .then(() => {
        this.exitCreate();
        message.success({
          content: formatMessage(intlMessages.honorCreated),
        });
      })
      .catch((err) => {
        logging.debug(err);
        setSubmitting(false);
        if (err.code === 'VALIDATION_EXCEPTION') {
          setErrors(mapErrorMessages(err.data));
        } else {
          notification.error({
            message: formatMessage(intlMessages.honorCreateFailed),
            description: err.message,
          }); 
        }
      });
  };

  handleDelete = (item) => {
    this.props.deleteHonor(item).then(
      () => {
        message.success({
          content: formatMessage(intlMessages.honorDeleted),
        });
      }
    ).catch((err) => {
      notification.error({
        message: formatMessage(intlMessages.honorDeleteFailed),
        description: err.message,
      });
    })
  }

  renderItems() {
    const { data } = this.props;
    return (
      <React.Fragment>
        <FtBlock.Help className="padding_5">
          <TranslatableMessage message={intlMessages.sectionHint} />
        </FtBlock.Help>
        {data &&
          !!data.length && (
          <HonorList>
            {data.map((honor) => (
              <HonorItem
                key={honor.id}
                data={honor}
                onDelete={() => {
                  this.handleDelete(honor);
                }}
              />
            ))}
          </HonorList>
        )}
      </React.Fragment>
    );
  }

  render() {
    const { blockState, data } = this.props;
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
        <HonorForm 
          canCancel={data.length > 0}
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
        {data && this.renderItems()}
      </FtBlock>
    )
  }
}

HonorBlock.propTypes = {
  blockState: PropTypes.object,
  currentUser: PropTypes.object,
  data: PropTypes.array,
  formRef: PropTypes.func,
  fetchHonors: PropTypes.func,
  createHonor: PropTypes.func,
  deleteHonor: PropTypes.func,
};


const mapStateToProps = createStructuredSelector({
  blockState: selectHonorBlockState,
  data: selectHonors,
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = {
  fetchHonors: asyncFetchHonors,
  createHonor: asyncCreateHonor,
  deleteHonor: asyncDeleteHonor,
}

export default connect(mapStateToProps, mapDispatchToProps)(HonorBlock);
