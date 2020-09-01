import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'next/router';

import { Col, Row } from '@feat/feat-ui/lib/grid';
import FtBlock from '@feat/feat-ui/lib/block';
import UserAppRender from '@/components/UserAppRender';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import IdentityBlock from '@/modules/settings/containers/IdentityBlock';
import EducationBlock from '@/modules/settings/containers/EducationBlock';
import CareerBlock from '@/modules/settings/containers/CareerBlock';
import HonorBlock from '@/modules/settings/containers/HonorBlock';
import AccountBasic from '@/modules/settings/containers/AccountBasic';

import ExpertiseBlock from '@/modules/settings/containers/ExpertiseBlock';
import SignBoardSection from '@/modules/settings/containers/SignBoardSection';
import OpenTimeSection from '@/modules/settings/containers/OpenTimeSection';
import WorkplaceSection from '@/modules/settings/containers/WorkplaceSection';
import SecurityInitSection from '@/modules/settings/containers/SecurityInitSection';
import SecurityUpdateSection from '@/modules/settings/containers/SecurityUpdateSection';
import LanguageBlock from '@/modules/settings/containers/LanguageBlock';

import PaymentConfigBlock from '@/modules/settings/containers/PaymentConfigBlock';
import WechatBindingBlock from '@/modules/settings/containers/WechatBindingBlock';

import { selectUserMeta } from '@/modules/auth/selectors';
import intlMessages from '@/modules/settings/messages';

import './style.scss';

class Settings extends React.PureComponent {
  forms = {};

  componentDidUpdate(preProps) {
    if (
      !preProps.userMeta.security_question_initialized &&
      this.props.userMeta.security_question_initialized
    ) {
      if (this.props.router.query.next) {
        window.location = this.props.router.query.next;
      } else {
        // Try To Focus Basic Info.
        const blockDom = document.getElementById('name-config');
        if (blockDom) {
          const box = blockDom.getBoundingClientRect();
          window.scrollTo(0, box.top);
        }
      }
    }
  }

  render() {
    const {
      userMeta: { security_question_initialized: hasInitialized },
    } = this.props;
    const mainContent = (
      <div className="p-Setting">
        <div className="p-Setting__column p-Setting__col1">
          <IdentityBlock
            formRef={(n) => {
              this.forms.identity = n;
            }}
          />
          <LanguageBlock
            formRef={(n) => {
              this.forms.language = n;
            }}
          />
          {/* <SelfContactBlock
                {...selfContactBlock}
                countryOptions={this.props.countryOptions}
                addEmail={this.props.addEmail}
                deleteEmail={this.props.deleteEmail}
                addMobile={this.props.addMobile}
                deleteMobile={this.props.deleteMobile}
                fetchCountryOptions={this.props.fetchCountryOptions}
                /> */}
          <EducationBlock
            formRef={(n) => {
              this.forms.education = n;
            }}
          />
          <CareerBlock />
          <HonorBlock />
        </div>
        <div className="p-Setting__column p-Setting__col2">
          <ExpertiseBlock />
          <div>
            <Row gutter={24}>
              <Col span={16}>
                <SignBoardSection
                  formRef={(n) => {
                    this.forms.signBoard = n;
                  }}
                />
                <WorkplaceSection />
              </Col>
              <Col span={8}>
                <OpenTimeSection />
                <PaymentConfigBlock
                  formRef={(n) => {
                    this.forms.payment = n;
                  }}
                />
                <WechatBindingBlock />
              </Col>
            </Row>
            <FtBlock
              id="account-section"
              title={
                <span className="padding_x_5">
                  <TranslatableMessage
                    message={intlMessages.accountSectionTitle}
                  />
                </span>
              }
            >
              <Row className="margin_t_5" flex gutter={24}>
                <Col span={8}>
                  <AccountBasic
                    formRef={(n) => {
                      this.forms.accountBasic = n;
                    }}
                  />
                </Col>
                <Col span={8}>
                  <SecurityUpdateSection
                    formRef={(n) => {
                      this.forms.securityUpdate = n;
                    }}
                  />
                </Col>
              </Row>
            </FtBlock>
          </div>
        </div>
      </div>
    );

    return (
      <>
        <UserAppRender
          className={classNames({
            blury: !hasInitialized,
          })}
          main={mainContent}
        />
        {!hasInitialized && (
          <div className="b-SecuritySettingOverlay">
            <SecurityInitSection />
          </div>
        )}
      </>
    );
  }
}

Settings.propTypes = {
  userMeta: PropTypes.object,
  router: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  userMeta: selectUserMeta,
});

const withConnect = connect(mapStateToProps);

export default compose(
  withRouter,
  withConnect,
)(Settings);
