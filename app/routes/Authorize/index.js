import React from 'react';
import PropTypes from 'prop-types';

import { stringify, parseUrl } from 'query-string';
import { withRouter } from 'next/router';
import get from 'lodash/get'

import { formatMessage } from '@/services/intl';
import Button from '@feat/feat-ui/lib/button';

import { fetchAuthorizePage, postAuthorize } from './requests';
import intlMessages from './messages';
import './style.scss';

class Authorize extends React.PureComponent {
  state = {
    appInfo: null,
    fetchError: null,
    // appInfo: {
    //   n_scopes: [
    //     ['get_user_info', 'Get user info'],
    //     ['edit_user_info', 'Edit user info'],
    //   ],
    //   ad_scopes: [['advantage', 'adnvatage']],
    //   client_id: 'PmYwK92Rjqe25s1Wkd1XxzbudqQFCYtwbY3EYPY9',
    //   redirect_uri: 'https://10.0.10.104:3300',
    //   response_type: 'code',
    //   state: null,
    //   name: 'Demo',
    // },
  };

  componentDidMount() {
    fetchAuthorizePage(this.props.router.query)
      .then((data) => {
        this.setState({
          appInfo: data,
        });
      })
      .catch((err) => {
        this.setState({
          fetchError: err,
        });
      });
    // setTimeout(() => {
    //   this.forceUpdate();
    // }, 2000);
  }

  handleSubmitClick = (e) => {
    const target = e.target;
    const form = e.target.form;
    if (form) {
      form.setAttribute('submit-trigger', target.value);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('allow', e.target.getAttribute('submit-trigger'));
    formData.append('device_id', 'AUTHORIZE');
    this.setState({
      loading: true,
    });
    postAuthorize(formData)
      .then((res) => {
        if (res.redirect_uri) {
          global.location.replace(res.redirect_uri);
        } else if (res.access_token) {
          const parsedUrl = parseUrl(formData.get('redirect_uri'));
          global.location.replace(`${parsedUrl.url}?${stringify({
            ...parsedUrl.query,
            token_type: res.token_type,
            expires_in: res.expires_in,
          })}#${res.access_token}`);
        }
      }).catch((err) => {
        const parsedUrl = parseUrl(formData.get('redirect_uri'));
        global.location.replace(`${parsedUrl.url}?${stringify({
          ...parsedUrl.query,
          error: get(err, 'data.error', err.message),
        })}`)
      })
    // const form = document.querySelector('#authorizationForm');
  };

  render() {
    const { appInfo, fetchError } = this.state;
    if (fetchError) {
      return <div>Error: {fetchError.message}</div>;
    }
    if (!appInfo) {
      return <div>Loading...</div>;
    }
    return (
      <div className="p-AuthorizeLayout">
        <form className="oa-AuthorizeForm" onSubmit={this.handleSubmit}>
          <h1 className="oa-AuthorizeForm__title">
            {formatMessage(intlMessages.formTitle, { appName: appInfo.name })}
          </h1>
          <section className="oa-AuthorizeForm__section">
            <div className="oa-AuthorizeForm__label">
              {formatMessage(intlMessages.basicScope)}
            </div>
            <div>
              {appInfo.n_scopes.map(([scope, scopeName]) => (
                <label className="oa-AuthorizeForm__scopeItem">
                  <input
                    name="n_scopes"
                    type="hidden"
                    value={scope}
                    key={scope}
                    checked
                  />
                  {scopeName}
                </label>
              ))}
            </div>
          </section>
          {appInfo.ad_scopes &&
            !!appInfo.ad_scopes.length && (
            <section className="oa-AuthorizeForm__section">
              <div className="oa-AuthorizeForm__label">
                {formatMessage(intlMessages.advancedScope)}
              </div>
              <div>
                {appInfo.ad_scopes.map(([scope, scopeName]) => (
                  <label className="oa-AuthorizeForm__scopeItem">
                    <input
                      defaultChecked
                      type="checkbox"
                      name="ad_scopes"
                      value={scope}
                    />
                    {scopeName}
                  </label>
                ))}
              </div>
            </section>
          )}

          <input value={appInfo.client_id} name="client_id" type="hidden" />
          <input
            value={appInfo.redirect_uri}
            name="redirect_uri"
            type="hidden"
          />
          <input
            value={appInfo.response_type}
            name="response_type"
            type="hidden"
          />
          <input value={appInfo.state} name="state" type="hidden" />

          <div className="oa-AuthorizeForm__footer">
            <Button
              htmlType="submit"
              value="false"
              className="margin_r_12"
              type="merge"
              onClick={this.handleSubmitClick}
              disabled={this.state.loading}
            >
              {formatMessage(intlMessages.cancel)}
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              value="true"
              onClick={this.handleSubmitClick}
              disabled={this.state.loading}
            >
              {formatMessage(intlMessages.authorize)}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

Authorize.propTypes = {
  router: PropTypes.object,
};

export default withRouter(Authorize);
