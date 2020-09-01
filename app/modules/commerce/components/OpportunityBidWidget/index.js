import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';
import Router from 'next/router';

import { formatMessage } from '@/services/intl';
import mapErrorMessages from '@/utils/mapErrorMessages';

import SelectField from '@/components/Formik/SelectField';
import TextField from '@/components/Formik/TextField';

import Button from '@feat/feat-ui/lib/button';
import FormHelp from '@feat/feat-ui/lib/form/FormHelp';
import FormItem from '@feat/feat-ui/lib/form/FormItem';

import intlMessages from './messages';

import './style.scss';

const TabName = 'opportunity';

class OpportunityBidWidget extends React.PureComponent {
  state = {};

  componentDidMount() {
    this.cIsMounted = true;
  }

  componentWillUnmount() {
    this.cIsMounted = false;
  }

  getExpertiseOptions() {
    if (!this.expertiseOptions) {
      this.expertiseOptions = this.props.expertises.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    }
    return this.expertiseOptions;
  }

  getInitialValues() {
    let defaultExpertiseId;
    if (this.props.lastBid) {
      return {
        price: '',
      };
    }
    // if (this.props.lastExpertise) {
    //   defaultExpertiseId = this.props.lastExpertise;
    // } else
    if (this.props.matchedExpertises && this.props.matchedExpertises.length) {
      defaultExpertiseId = this.props.matchedExpertises[0].id;
    } else if (this.props.expertises && this.props.expertises.length) {
      defaultExpertiseId = this.props.expertises[0].id;
    }
    const option = this.getExpertiseOptions().find(
      (item) => item.value === defaultExpertiseId,
    );
    return {
      expertise: option,
      price: '',
    };
  }

  validate = (values) => {
    const { price } = values;
    const errors = {};
    if (!price) {
      errors.price = formatMessage(intlMessages.priceRequired);
    } else if (!/^\d+(,\d{3})*(\.\d{1,2})?$/.test(price)) {
      errors.price = formatMessage(intlMessages.notValidPrice);
    } else if (this.props.lastBid) {
      // TODO: handle bid rules;
    }
    return errors;
  };

  // 提交成功后跳转页面到用户主页的opportunity
  routerUserPage = () => {
    const href = `/user-profile?dashTab=${TabName}&userId=${
      this.props.currentUser.uid
    }`;
    const as = `/profile/${this.props.currentUser.uid}?dashTab=${TabName}`;
    Router.push(href, as);
    window.scrollTo(0, 0);
    this.props.setListType();
  };

  handleSubmit = (values, { setSubmitting, setErrors }) => {
    this.props
      .onSubmit({
        price: values.price,
        expertise: values.expertise ? values.expertise.value : undefined,
        demandId: this.props.demandId,
      })
      .catch((err) => {
        if (err.code === 'VALIDATION_EXCEPTION') {
          setErrors(mapErrorMessages(err.data));
        } else {
          setErrors({ _error: err.message });
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  render() {
    return (
      <Formik
        initialValues={this.getInitialValues()}
        validate={this.validate}
        onSubmit={this.handleSubmit}
        enableReinitialize
      >
        {(props) => (
          <form
            className="cm-OpportunityBidWidget"
            onSubmit={props.handleSubmit}
          >
            {!this.props.lastBid && (
              <Field
                label={formatMessage(intlMessages.expertise)}
                name="expertise"
                options={this.getExpertiseOptions()}
                component={SelectField}
              />
            )}
            <Field
              name="price"
              label={formatMessage(intlMessages.price)}
              placeholder={formatMessage(intlMessages.priceInputPlaceholder)}
              component={TextField}
            />
            {props.errors._error && (
              <FormHelp error={props.errors._error} validateStatus="error" />
            )}
            <FormItem>
              <Button
                className="cm-OpportunityBidWidget__submitBtn"
                htmlType="submit"
                disabled={props.isSubmitting}
                block
              >
                {formatMessage(intlMessages.submitLabel)}
              </Button>
            </FormItem>
          </form>
        )}
      </Formik>
    );
  }
}

OpportunityBidWidget.propTypes = {
  onSubmit: PropTypes.func,
  demandId: PropTypes.number,
  expertises: PropTypes.array,
  matchedExpertises: PropTypes.array,
  // lastExpertise: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lastBid: PropTypes.any,
  setListType: PropTypes.func,
  currentUser: PropTypes.object,
};

export default OpportunityBidWidget;
