import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import Avatar from '@feat/feat-ui/lib/avatar';

import Contact from '../../components/Contact';

import { changeRoom } from '../../actions';
import { GLOBAL_ROOM } from '../../constants';

const FeatContact = (props) => {
  const { active, contact, archiveMode, roomId } = props;
  const dispatch = useDispatch();
  return (
    <Contact.Wrap isActive={active}>
      <Contact
        type="feat"
        isActive={active}
        onClick={(e) => {
          e.preventDefault();
          dispatch(
            changeRoom(
              active
                ? {
                  roomId: GLOBAL_ROOM,
                }
                : {
                  roomId,
                  contact,
                },
            ),
          );
        }}
      >
        <Contact.Container>
          <Contact.Avatar count={archiveMode ? 0 : contact.unread_count}>
            <Avatar avatar={contact.logo} username="Feat" round />
          </Contact.Avatar>
          <Contact.Info>
            <Contact.Name>{contact.name}</Contact.Name>
          </Contact.Info>
        </Contact.Container>
      </Contact>
    </Contact.Wrap>
  );
};

FeatContact.propTypes = {
  active: PropTypes.bool,
  roomId: PropTypes.string,
  contact: PropTypes.object,
  archiveMode: PropTypes.bool,
};

export default FeatContact;
