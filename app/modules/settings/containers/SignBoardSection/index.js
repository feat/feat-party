import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Field } from 'formik';
import PropTypes from 'prop-types';

import { formatMessage } from '@/services/intl';

import Button from '@feat/feat-ui/lib/button';
import Loader from '@feat/feat-ui/lib/loader';
import notification from '@feat/feat-ui/lib/notification';
import message from '@feat/feat-ui/lib/message';
import FtBlock from '@feat/feat-ui/lib/block';
// import { Row, Col } from '@feat/feat-ui/lib/grid';

import TextField from '@/components/Formik/TextField';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages from './messages';

import { 
  asyncUpdateSignBoard,
} from '../../actions/commerce';
import {
  asyncFetchProfile,
} from '../../actions/profile'
import { 
  selectSignBoardBlockState,
  selectSignBoardData,
} from '../../selectors';

import './style.scss';


const SignBoardSection = (props) => {
  const { formRef } = props;
  const blockState = useSelector(selectSignBoardBlockState);
  const data = useSelector(selectSignBoardData) || { commercial_sign: '', promote_words: ''};
  const dispatch = useDispatch();

  useEffect(() => {
    if (!blockState.onceFetched && !blockState.loading) {
      dispatch(asyncFetchProfile()).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      })
    }
  }, []);
  
  if (!blockState.onceFetched || blockState.loading) {
    return (
      <FtBlock 
        className="SignBoard"
        title={
          <TranslatableMessage message={intlMessages.sectionTitle} />
        }
      >
        <div>Loading...</div>
      </FtBlock>
    )
  }
  return (
    <Formik
      initialValues={data}
      innerRef={formRef}
      onSubmit={(values, { setSubmitting, setErrors  }) => {
        dispatch(asyncUpdateSignBoard(values))
          .then(() => {
            message.success({
              content: formatMessage(intlMessages.signBoardUpdated),
            });
          })
          .catch((err) => {
            if (err.code === 'VALIDATION_EXCEPTION') {
              setErrors(err.data);
            } else {
              notification.error({
                message: formatMessage(intlMessages.signBoardUpdateFailed),
                description: err.message,
              });
            }
          }).finally(() => {
            setSubmitting(false);
          });
      }}
      enableReinitialize
    >
      {(formProps) => {
        const { handleSubmit } = formProps;
        let subHeader = null;
        if (formProps.isSubmitting) {
          subHeader =  (
            <Button
              type="link"
              className="ft-Block__toggleBtn"
              style={{ float: 'right' }}
              disabled={formProps.isSubmitting}
            >
              <Loader size='xs' />
            </Button>
          )
        }
        return (
          <FtBlock
            className="SignBoard"
            title={
              <TranslatableMessage message={intlMessages.sectionTitle} />
            }
            subHeader={subHeader}
          >
            <form className="ft-Form relative" onSubmit={handleSubmit}>
              <Field
                name="commercial_sign"
                label={
                  <TranslatableMessage
                    message={intlMessages.commercialSignLabel}
                  />
                }
                component={TextField}
                modifier="dashed"
                onBlur={() => {
                  if (formProps.dirty) {
                    formProps.submitForm();
                  }
                }}
                className="ft-FormItem_inline"
              />
              {/* <Row flex gutter={24}>
                <Col span={12}>
                  <Field
                    name="commercial_sign"
                    label={
                      <TranslatableMessage
                        message={intlMessages.commercialSignLabel}
                      />
                    }
                    component={TextField}
                    modifier="dashed"
                    onBlur={() => {
                      formProps.submitForm();
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Field
                    name="promote_words"
                    label={
                      <TranslatableMessage
                        message={intlMessages.promoteWordsLabel}
                      />
                    }
                    component={TextField}
                    modifier="dashed"
                    onBlur={() => {
                      formProps.submitForm();
                    }}
                  />
                  <button type='submit' style={{display: 'none'}}></button>
                </Col>
              </Row> */}
              {/* {formProps.isSubmitting && <MaskLoader loaderSize="sm" />} */}
            </form>
          </FtBlock>
        )
      }}
    </Formik>
  )
}

SignBoardSection.propTypes = {
  formRef: PropTypes.func,
  // submitTimeout: PropTypes.number,
}

// SignBoardSection.defaultProps = {
//   submitTimeout: 1000,
// }

export default SignBoardSection;
