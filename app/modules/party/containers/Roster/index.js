import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Button from '@feat/feat-ui/lib/button';
// import FeatTab from '@feat/feat-ui/lib/tabs/FeatTab';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import GroupContact from '../GroupContact';
import FeatContact from '../FeatContact';
import UserContact from '../UserContact';
import Loading from '../../components/Loading';

import {
  getInboxContacts,
  getArchiveContacts,
  contactTab,
} from '../../actions';

import { getContactType } from '../../utils/contact';
import { getRoomId } from '../../utils/room';

import {
  IM_TAB_INBOX,
  IM_TAB_ARCHIVE,
  CONTACT_TYPE_FEAT,
  CONTACT_TYPE_GROUP,
  CONTACT_TYPE_USER,
} from '../../constants';

import './style.scss';
import {
  selectCurrentTab,
  selectCurrentRoomId,
  selectCurrentContactsState,
  selectUiState,
} from '../../selectors';

import intlMessages from '../../messages';

class RosterContainer extends Component {
  contactCompoMap = {
    [CONTACT_TYPE_FEAT]: FeatContact,
    [CONTACT_TYPE_GROUP]: GroupContact,
    [CONTACT_TYPE_USER]: UserContact,
  };

  state = {
    isDrag: false,
  };

  componentDidMount() {
    if (this.roster) {
      this.roster.addEventListener('mousewheel', this.onMouseWheel);
    }
    this.setContactTabZIndex();
  }

  setContactTabZIndex = () => {
    const {
      ui: { contactType },
    } = this.props;
    const cBtn = document.querySelectorAll('.IM-Roster__contactTab_btn');
    const cLength = cBtn.length;
    cBtn.forEach((btn, i) => {
      if (i < contactType) {
        // eslint-disable-next-line no-param-reassign
        btn.style.zIndex = cLength - (cLength - i);
      } else if (i > contactType) {
        // eslint-disable-next-line no-param-reassign
        btn.style.zIndex = cLength - i;
      } else if (i === contactType) {
        // eslint-disable-next-line no-param-reassign
        btn.style.zIndex = cLength + 1;
      }
    });
  };

  componentDidUpdate() {
    if (this.shouldFetchContacts()) {
      this.tryToFetchContacts();
    }
  }

  componentWillUnmount() {
    if (this.roster) {
      this.roster.removeEventListener('mousewheel', this.onMouseWheel);
    }
  }

  onMouseWheel = (e) => {
    if (!this.roster.scrollTop) {
      return;
    }
    if (this.roster.scrollTop === 0 && e.deltaY < 0) {
      e.preventDefault();
    }
    if (
      this.roster.scrollHeight - this.roster.clientHeight ===
        this.roster.scrollTop &&
      e.deltaY > 0
    ) {
      e.preventDefault();
    }
  };

  shouldFetchContacts() {
    const { contactsState } = this.props;
    return contactsState.shouldRefresh;
  }

  tryToFetchContacts() {
    const {
      currentTab,
      contactsState: { fetching, shouldRefresh },
    } = this.props;
    if (fetching) {
      return;
    }
    const actionCreateor =
      currentTab === IM_TAB_INBOX
        ? this.props.getInboxContacts
        : this.props.getArchiveContacts;
    actionCreateor(shouldRefresh);
  }

  renderContact(contact) {
    const type = getContactType(contact);
    const Compo = this.contactCompoMap[type];
    const { currentTab, currentRoomId } = this.props;
    const roomId = getRoomId(contact);
    const isActive = roomId === currentRoomId;
    return (
      Compo && (
        <Compo
          key={contact.id}
          archiveMode={currentTab === IM_TAB_ARCHIVE}
          active={isActive}
          contact={contact}
          roomId={roomId}
          returnBeginDrag={() => {
            this.setState({ isDrag: true });
          }}
          returnEndDrag={() => {
            this.setState({ isDrag: false });
          }}
        />
      )
    );
  }

  handleTabClick = (type, index) => {
    this.props.contactTab({ type });

    // this.setContactTabZIndex(index);
    const cBtn = document.querySelectorAll('.IM-Roster__contactTab_btn');
    const cLength = cBtn.length;
    cBtn.forEach((btn, i) => {
      if (i < index) {
        // eslint-disable-next-line no-param-reassign
        btn.style.zIndex = cLength - (cLength - i);
      } else if (i > index) {
        // eslint-disable-next-line no-param-reassign
        btn.style.zIndex = cLength - i;
      } else if (i === index) {
        // eslint-disable-next-line no-param-reassign
        btn.style.zIndex = cLength + 1;
      }
    });
  };

  render() {
    const {
      contactsState: { fetching, initFetched, list: contacts },
      ui: { contactType },
    } = this.props;
    if (fetching && !initFetched) {
      return <Loading size="xs" />;
    }
    return (
      <div
        className="IM-Roster"
        ref={(m) => {
          this.roster = m;
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onScroll={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="IM-Roster__contactTab">
          <Button
            type="default"
            size="xs"
            className={classNames(
              'IM-Roster__contactTab_btn IM-Roster__contactTab_firstBtn',
              {
                'is-active': contactType === 0,
              },
            )}
            onClick={() => this.handleTabClick(0, 0)}
          >
            <TranslatableMessage message={intlMessages.contact} />
          </Button>
          <Button
            type="default"
            size="xs"
            className={classNames(
              'IM-Roster__contactTab_btn IM-Roster__contactTab_nextBtn',
              {
                'is-active': contactType === 1,
              },
            )}
            onClick={() => this.handleTabClick(1, 1)}
          >
            <TranslatableMessage message={intlMessages.group} />
          </Button>
        </div>
        {fetching && <Loading size="xs" />}
        {/* {contacts && contacts.map((contact) => this.renderContact(contact))} */}
        {contacts && (
          <div>
            {contactType === 0 &&
              contacts
                .filter((item) => !item.group)
                .map((contact) => this.renderContact(contact))}
            {contactType === 1 &&
              contacts
                .filter((item) => item.group)
                .map((contact) => this.renderContact(contact))}
          </div>
        )}
        {this.state.isDrag && (
          <div className="IM-Roster__contactGroup">
            <div className="IM-Roster__contactGroup_label">
              <TranslatableMessage message={intlMessages.group} />
            </div>
            <div className="IM-Roster__contactGroup_main">
              {contacts
                .filter((item) => item.group)
                .map((contact) => this.renderContact(contact))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

RosterContainer.propTypes = {
  currentTab: PropTypes.string,
  currentRoomId: PropTypes.string,
  contactsState: PropTypes.shape({
    initFetched: PropTypes.bool,
    fetching: PropTypes.bool,
    shouldRefresh: PropTypes.bool,
    list: PropTypes.array,
  }),
  getInboxContacts: PropTypes.func,
  getArchiveContacts: PropTypes.func,
  ui: PropTypes.object,
  contactTab: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  currentTab: selectCurrentTab,
  currentRoomId: selectCurrentRoomId,
  contactsState: selectCurrentContactsState,
  ui: selectUiState,
});

const mapDispatchToProps = {
  getInboxContacts,
  getArchiveContacts,
  contactTab,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RosterContainer);
