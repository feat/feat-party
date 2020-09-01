import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bindPromiseCreators } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import classNames from 'classnames';

import {
  createEmptyContent,
  getText,
  clearContent,
  getHTML,
} from '@/utils/editor';

import { getFormattedAddress } from '@/utils/address';

import { formatMessage } from '@/services/intl';
import formMessages from '@/messages/form';

import { selectCurrentUser } from '@/modules/auth/selectors';

import FeatModal from '@feat/feat-ui/lib/feat-modal';

import Editor from '@feat/feat-editor/lib/components/Editor';
import SvgIcon from '@feat/feat-ui/lib/svg-icon';
import Button from '@feat/feat-ui/lib/button';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import RoundButton from '@feat/feat-ui/lib/button/RoundButton';
import message from '@feat/feat-ui/lib/message';

import NoticeWell from '@/components/NoticeWell';
import ImagesDropzone from '@/components/ImagesDropzone';
import CrossButton from '@/components/CrossButton';
import CategorySelectModal from '@/modules/category/containers/CategorySelectModal';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import AddressSelectPanel from '../../components/AddressSelectPanel';
import Datepicker from './Datepicker';

import { fetchGeocodePromiseCreator } from '../../actions/user';

import {
  exitDemandCreation,
  confirmDemandCreationPromiseCreator,
} from '../../actions/demand-creation';

import { selectUserCommerceInfo } from '../../selectors';

import {
  serviceType as serviceTypeMessages,
  // servicePriceUnit as servicePriceUnitMessages
} from '../../messages';

import {
  SERVICE_TYPE_ONLINE,
  SERVICE_TYPE_ON_SITE,
  SERVICE_TYPE_WORKPLACE,
  PRICE_UNIT_CASE,
  // PRICE_UNIT_HOUR
} from '../../constants';

import intlMessages from './messages';
import './style.scss';

const DATE_FORMAT = 'YYYY/MM/DD - HH:mm';

class DemandCreation extends React.Component {
  state = this.getInitState();

  componentDidMount() {
    if (!this.state.title.getCurrentContent().hasText()) {
      this.titleInput && this.titleInput.focus();
    }
  }

  getInitState() {
    return {
      title: createEmptyContent(),
      description: createEmptyContent(),
      tag: createEmptyContent(),
      priceUnit: undefined,
      serviceType: undefined,
      files: [],
      address: null,
      tags: [],
      dateRequired: undefined,
      autoCloseDate: false,
      isAddressSelectPanelOpened: false,
      isCategorySelectPanelOpened: false,
      isSubmitting: false,
      errors: {},
    };
  }

  exit = () => {
    this.props.exitDemandCreation();
  }

  submit = () => {
    // auto submit tag handle
    if (this.state.tag.getCurrentContent().hasText()) {
      this.state.tags.push(getText(this.state.tag));
      this.setState({
        tag: clearContent(this.state.tag),
      });
    }

    const errors = this.validate();
    if (Object.keys(errors).length) {
      this.setState({
        errors,
      });
      return;
    }

    this.setState({
      isCategorySelectPanelOpened: true,
    });
  };

  finalSubmit = () => {
    if (this.state.isSubmitting) {
      return;
    }
    // TODO
    const preData = {
      title: getText(this.state.title),
      description: getHTML(this.state.description),
      priceUnit: this.state.priceUnit || PRICE_UNIT_CASE,
      serviceType: this.state.serviceType,
      address: this.state.address,
      files: this.state.files,
      category: this.state.category,
      dateRequired: this.state.dateRequired,
      closeDate: this.state.closeDate,
      tags: this.state.tags,
    };
    this.setState({
      isSubmitting: true,
    });
    this.props
      .onConfirm(preData)
      .then(() => {
        this.props.exitDemandCreation();
      })
      .catch(() => {
        this.setState({
          isSubmitting: false,
        });
      });
  };

  validate() {
    const errors = {};
    const title = getText(this.state.title);
    const desc = getText(this.state.description);
    if (!title.trim()) {
      errors.title = formatMessage(formMessages.required, {
        field: formatMessage(intlMessages.titleLabel),
      });
    }
    if (!desc.trim()) {
      errors.description = formatMessage(formMessages.required, {
        field: formatMessage(intlMessages.descriptionLabel),
      });
    }
    if (!this.state.tags.length) {
      errors.tags = formatMessage(intlMessages.tagRequired);
    }
    if (!this.state.serviceType) {
      errors.serviceType = true;
    }
    // if (!this.state.priceUnit) {
    //   errors.priceUnit = true;
    // }
    if (
      this.state.serviceType === SERVICE_TYPE_ON_SITE &&
      !this.state.address
    ) {
      errors.address = formatMessage(formMessages.required, {
        field: formatMessage(intlMessages.addressLabel),
      });
    }
    if (!this.state.dateRequired) {
      errors.dateRequired = true;
    }
    return errors;
  }

  changeServiceType = (type) => {
    this.setState({
      serviceType: type,
    });
    if (this.state.errors.serviceType) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          serviceType: undefined,
        },
      }));
    }
    if (type === SERVICE_TYPE_ON_SITE) {
      this.openAddressSelectPanel();
    }
  };

  // changePriceUnit = (value) => {
  //   this.setState({
  //     priceUnit: value,
  //   })
  //   if (this.state.errors.priceUnit) {
  //     this.setState((prevState) => ({
  //       errors: {
  //         ...prevState.errors,
  //         priceUnit: undefined,
  //       },
  //     }));
  //   }
  // }

  handleTitleEditor = (title) => {
    this.setState({
      title,
    });
    if (title.getCurrentContent().hasText() && this.state.errors.title) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          title: undefined,
        },
      }));
    }
  };

  handleDesEditor = (description) => {
    this.setState({
      description,
    });
    if (
      description.getCurrentContent().hasText() &&
      this.state.errors.description
    ) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          description: undefined,
        },
      }));
    }
  };

  handleTagEditor = (tag) => {
    this.setState({
      tag,
    });

    if (tag.getCurrentContent().hasText() && this.state.errors.tags) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          tags: undefined,
        },
      }));
    }
  };

  updateDateRequired = (m) => {
    this.setState({
      dateRequired: m,
    });
    if (this.state.errors.dateRequired) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          dateRequired: undefined,
        },
      }));
    }
  };

  openCategorySelectPanel = () => {
    this.setState({
      isCategorySelectPanelOpened: true,
    });
  };

  closeCategorySelectPanel = () => {
    this.setState({
      isCategorySelectPanelOpened: false,
    });
  };

  openAddressSelectPanel = () => {
    this.setState({
      isAddressSelectPanelOpened: true,
    });
  };

  closeAddressSelectPanel = () => {
    this.setState({
      isAddressSelectPanelOpened: false,
    });
  };

  setAddress = (data) => {
    this.setState({
      address: data,
    });
    if (this.state.errors.address) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          address: undefined,
        },
      }));
    }
    this.closeAddressSelectPanel();
  };

  setCategory = (data) => {
    if (!data.category) {
      message.error(formatMessage(intlMessages.selectCategoryHint));
      return;
    }
    this.state.category = data.category;
    this.finalSubmit();
  };

  handleReturn = (editorState, handleChange, e, label) => {
    if (label === 'title') {
      if (e.keyCode === 13) {
        e.keyCode = 0;
        this.description.focus();
      }
    }
  };

  handleImagesDropzone = (files) => {
    this.setState({
      files,
    });
  };

  handleTagReturn = (editorState, handleChange, e) => {
    if (e.keyCode === 13) {
      if (getText(editorState)) {
        const tagsList = this.state.tags;
        tagsList.push(getText(editorState));
        this.setState({
          tags: tagsList,
          tag: clearContent(editorState),
        });
      }
      return 'handled';
    }
    return 'not-hanlded';
  };

  handleTagInputKeyCommand = (editorState, onChange, command) => {
    if (
      command === 'backspace' &&
      !editorState.getCurrentContent().hasText() &&
      this.state.tags.length
    ) {
      this.setState({
        tags: this.state.tags.slice(0, -1),
      });
    }
  };

  removeTag = (index) => {
    const tagsArray = this.state.tags;
    tagsArray.splice(index, 1);
    this.setState({
      tags: tagsArray,
    });
  };

  setAutoCloseDate = (e) => {
    e.preventDefault();
    if (!this.state.dateRequired) {
      message.error(formatMessage(intlMessages.setDateRequiredFirst));
      return;
    }
    this.setState({
      autoCloseDate: true,
    });
  };

  getCloseDateForRender() {
    if (this.state.closeDate) {
      return this.state.closeDate;
    }
    if (this.state.dateRequired) {
      return this.state.dateRequired.clone().add(-7, 'day');
    }
    return null;
  }

  renderCloseDate() {
    const date = this.getCloseDateForRender();
    return date && date.format(DATE_FORMAT);
  }

  renderContent() {
    const { errors } = this.state;
    return (
      <div className="cm-DemandCreation__content">
        <div className="cm-DemandCreation__col">
          <div className="cm-DemandCreation__main">
            <div
              className={classNames(
                'cm-DemandCreation__field cm-DemandCreation__field_title',
                {
                  'has-error': errors.title,
                },
              )}
            >
              <Editor
                className={classNames('cm-DemandCreation__titleInput', {
                  'is-empty': !this.state.title.getCurrentContent().hasText(),
                })}
                editorState={this.state.title}
                onChange={this.handleTitleEditor}
                placeholder={
                  <div className="cm-DemandCreation__titleInputPlaceholder">
                    {errors.title ||
                      formatMessage(intlMessages.titlePlaceholder)}
                  </div>
                }
                ref={(n) => {
                  this.titleInput = n;
                }}
                handleReturn={(...args) => this.handleReturn(...args, 'title')}
              />
            </div>
            <div
              className={classNames(
                'cm-DemandCreation__field cm-DemandCreation__field_desc',
                {
                  'has-error': errors.description,
                },
              )}
            >
              <Editor
                className="cm-DemandCreation__descInput"
                editorState={this.state.description}
                onChange={this.handleDesEditor}
                placeholder={
                  <div className="cm-DemandCreation__desPlaceholder">
                    {errors.description ||
                      formatMessage(intlMessages.descriptionPlaceholder)}
                  </div>
                }
                ref={(n) => {
                  this.description = n;
                }}
              />
            </div>
            <div
              className={classNames(
                'cm-DemandCreation__field cm-DemandCreation__field_tags',
                {
                  'has-error': errors.tags && !this.state.tags.length,
                },
              )}
            >
              {this.state.tags.length !== 0 &&
                this.state.tags.map((item, index) => (
                  <CrossButton
                    className="cm-DemandCreation__tag"
                    key={index}
                    onClick={() => this.removeTag(index)}
                  >
                    {item}
                  </CrossButton>
                ))}
              <Editor
                className="cm-DemandCreation__tagInput"
                editorState={this.state.tag}
                onChange={this.handleTagEditor}
                placeholder={
                  <div className="cm-DemandCreation__des_placeholder">
                    {this.state.tags.length
                      ? formatMessage(intlMessages.tagPlaceholder)
                      : errors.tags ||
                        formatMessage(intlMessages.tagPlaceholder)}
                  </div>
                }
                ref={(n) => {
                  this.tag = n;
                }}
                handleKeyCommand={this.handleTagInputKeyCommand}
                handleReturn={this.handleTagReturn}
                // onBlur={this.handleBlur}
              />
            </div>
            <div className="cm-DemandCreation__field cm-DemandCreation__field_images">
              <div className="cm-DemandCreation__fieldHeader">
                <span className="cm-DemandCreation__label">
                  {formatMessage(intlMessages.imageLabel)}
                </span>
                <em className="cm-DemandCreation__tips">
                  {formatMessage(intlMessages.dndHint)}
                </em>
              </div>
              <div className="cm-DemandCreation__fieldContent">
                <ImagesDropzone
                  maxCount={5}
                  value={this.state.files}
                  onChange={this.handleImagesDropzone}
                />
              </div>
            </div>

            <div
              className={classNames(
                'cm-DemandCreation__field cm-DemandCreation__field_serviceType',
                {
                  'has-error': errors.serviceType,
                },
              )}
            >
              <span className="cm-DemandCreation__label">
                {formatMessage(intlMessages.serviceLabel)}
              </span>
              <div className="cm-DemandCreation__fieldContent">
                <Button
                  type="merge"
                  className={classNames('cm-DemandCreation__option', {
                    'is-selected':
                      this.state.serviceType === SERVICE_TYPE_ONLINE,
                  })}
                  onClick={() => this.changeServiceType(SERVICE_TYPE_ONLINE)}
                >
                  <TranslatableMessage
                    message={serviceTypeMessages[SERVICE_TYPE_ONLINE]}
                  />
                </Button>
                <Button
                  type="merge"
                  className={classNames('cm-DemandCreation__option', {
                    'is-selected':
                      this.state.serviceType === SERVICE_TYPE_ON_SITE,
                  })}
                  onClick={() => this.changeServiceType(SERVICE_TYPE_ON_SITE)}
                >
                  <TranslatableMessage
                    message={serviceTypeMessages[SERVICE_TYPE_ON_SITE]}
                  />
                </Button>
                <Button
                  type="merge"
                  className={classNames('cm-DemandCreation__option', {
                    'is-selected':
                      this.state.serviceType === SERVICE_TYPE_WORKPLACE,
                  })}
                  onClick={() => this.changeServiceType(SERVICE_TYPE_WORKPLACE)}
                >
                  <TranslatableMessage
                    message={serviceTypeMessages[SERVICE_TYPE_WORKPLACE]}
                  />
                </Button>
              </div>
            </div>
            <div
              className={classNames(
                'cm-DemandCreation__field cm-DemandCreation__field_address',
                {
                  'is-hidden': this.state.serviceType !== SERVICE_TYPE_ON_SITE,
                  'has-error': errors.address,
                },
              )}
            >
              <span className="cm-DemandCreation__label">
                {formatMessage(intlMessages.addressLabel)}
              </span>
              <div className="cm-DemandCreation__fieldContent">
                <Button
                  className="cm-DemandCreation__tips"
                  onClick={this.openAddressSelectPanel}
                >
                  {this.state.address
                    ? getFormattedAddress(this.state.address)
                    : formatMessage(intlMessages.selectAnAddress)}
                </Button>
              </div>
            </div>
            {/* <div
              className={classNames("cm-DemandCreation__field cm-DemandCreation__field_priceUnit", {
                'has-error': errors.priceUnit,
              })}>
              <span className="cm-DemandCreation__label">{formatMessage(intlMessages.paymentLabel)}</span>
              <div className="cm-DemandCreation__fieldContent">
                <Button
                  type="merge"
                  className={classNames("cm-DemandCreation__option", {
                    'is-selected': this.state.priceUnit === PRICE_UNIT_CASE,
                  })}
                  onClick={() => this.changePriceUnit(PRICE_UNIT_CASE)}
                >
                  <TranslatableMessage message={servicePriceUnitMessages[PRICE_UNIT_CASE]} />
                </Button>
                <Button
                  type="merge"
                  className={classNames("cm-DemandCreation__option", {
                    'is-selected': this.state.priceUnit === PRICE_UNIT_HOUR,
                  })}
                  onClick={() => this.changePriceUnit(PRICE_UNIT_HOUR)}
                >
                  <TranslatableMessage message={servicePriceUnitMessages[PRICE_UNIT_HOUR]} />
                </Button>
              </div>
            </div> */}
          </div>
        </div>
        <div className="cm-DemandCreation__col">
          <div
            className={classNames(
              'cm-DemandCreation__field cm-DemandCreation__field_dateRequired',
              {
                'has-error': errors.dateRequired,
              },
            )}
          >
            <div className="cm-DemandCreation__fieldHeader">
              <div className="cm-DemandCreation__label">
                <TranslatableMessage
                  message={intlMessages.dateRequiredLabel}
                />
              </div>
              {this.state.dateRequired && (
                <span className="cm-DemandCreation__dateRequired">
                  {this.state.dateRequired.format(DATE_FORMAT)}
                </span>
              )}
            </div>
            <div className="cm-DemandCreation__fieldContent">
              <Datepicker
                value={this.state.dateRequired}
                onChange={this.updateDateRequired}
              />
            </div>
          </div>
          <div className="cm-DemandCreation__field cm-DemandCreation__field_closeDate">
            {!this.state.autoCloseDate && !this.state.closeDate ? (
              <NoticeWell className="cm-DemandCreation__autoCloseDateMessage">
                <SvgIcon
                  className={message && 'cm-DemandCreation__messageIcon'}
                  icon="audio"
                />
                <TranslatableMessage message={intlMessages.autoCloseMessage} />
                <RoundButton
                  className="cm-DemandCreation__closeMsgBtn"
                  onClick={this.setAutoCloseDate}
                  size="sm"
                >
                  GO
                </RoundButton>
              </NoticeWell>
            ) : (
              <div className="cm-DemandCreation__fieldHeader">
                <div className="cm-DemandCreation__label">
                  <TranslatableMessage message={intlMessages.closeDateLabel} />
                </div>
                <div className="cm-DemandCreation__fieldContent">
                  {this.renderCloseDate()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  renderAddressSelectPanel() {
    const {
      userInfo: {
        addresses,
        currentLocation,
        getCurrentLocationError,
        isFetchingUserAddresses,
        isGettingCurrentLocation,
        // userAddressesFetched,
        geoLocation,
      },
    } = this.props;
    const { isSettingAddress } = this.state;
    return (
      <AddressSelectPanel
        addresses={addresses}
        selected={this.state.address}
        currentLocation={currentLocation}
        geoLocation={geoLocation}
        getCurrentLocationError={getCurrentLocationError}
        isGettingCurrentLocation={isGettingCurrentLocation}
        isFetchingAddresses={isFetchingUserAddresses}
        isSubmitting={isSettingAddress}
        onCancel={this.closeAddressSelectPanel}
        onConfirm={this.setAddress}
        fetchGeocode={this.props.fetchGeocode}
      />
    );
  }

  renderCategorySelectPanel() {
    return (
      <CategorySelectModal
        category={this.state.category}
        onCancel={this.closeCategorySelectPanel}
        onConfirm={this.setCategory}
        isConfirming={this.state.isSubmitting}
      />
    );
  }

  renderDemandPanel() {
    return (
      <FeatModal>
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              <TranslatableMessage message={intlMessages.blockTitle} />
            </FeatModal.Title>
          </FeatModal.Header>
          <FeatModal.Content>{this.renderContent()}</FeatModal.Content>
          <FeatModal.Footer>
            <IconButton
              className="margin_r_24"
              size="md"
              svgIcon="no-btn"
              onClick={this.exit}
            />
            <IconButton
              size="md"
              svgIcon="ok-btn"
              disabled={this.state.isSubmitting}
              onClick={this.submit}
            />
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }

  render() {
    return (
      <div className="cm-DemandCreation">
        {this.state.isAddressSelectPanelOpened &&
          this.renderAddressSelectPanel()}
        {this.state.isCategorySelectPanelOpened &&
          this.renderCategorySelectPanel()}
        {!this.state.isAddressSelectPanelOpened &&
          !this.state.isCategorySelectPanelOpened &&
          this.renderDemandPanel()}
        {this.state.isSubmitting && (
          <div className="cm-DemandCreation__submitting">
            <TranslatableMessage message={intlMessages.creatingDemand} />
          </div>
        )}
      </div>
    );
  }
}

DemandCreation.propTypes = {
  // currentUser: PropTypes.object,
  onConfirm: PropTypes.func,
  exitDemandCreation: PropTypes.func,
  userInfo: PropTypes.object,
  fetchGeocode: PropTypes.func,
};

const mapStateToProps = () =>
  createStructuredSelector({
    currentUser: selectCurrentUser,
    userInfo: selectUserCommerceInfo,
  });

const mapDispatchToProps = (dispatch) => ({
  ...bindPromiseCreators(
    {
      fetchGeocode: fetchGeocodePromiseCreator,
      onConfirm: confirmDemandCreationPromiseCreator,
    },
    dispatch,
  ),
  ...bindActionCreators(
    {
      exitDemandCreation,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DemandCreation);
