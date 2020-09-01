import React, { useContext, useMemo, useEffect } from 'react'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import Button from '@feat/feat-ui/lib/button';
import notification from '@feat/feat-ui/lib/notification'
import Badge from '@feat/feat-ui/lib/badge'

import ActionMenu from '@/components/ActionMenu';
import { SubscriptionContext } from '@/modules/subscription/SubscriptionProvider';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { user as userMenu } from '@/messages/menu';
import { filterUserEventSubscription, filterUserDimzouSubscription } from '@/modules/subscription/utils';
import { selectDashState } from '@/modules/commerce/selectors';
import { asyncFetchDashBriefInfo } from '@/modules/commerce/actions/common';
import { selectCurrentUserId } from '@/modules/auth/selectors';
import { getUsername } from '@/utils/user';
import { getAsPath } from '@/utils/router';
import ScrollBox from '../ScrollBox';
import intlMessages from './messages';
import './style.scss';

function UserSidebar(props) {
  const { activeKey, activeSubkey } = props;
  const dispatch = useDispatch();
  const { data: { data }, unsubscribe } = useContext(SubscriptionContext);
  const currentUserId = useSelector(selectCurrentUserId);
  const router = useRouter();
  const dimzouSubscriptions = useMemo(() => filterUserDimzouSubscription(data), [data]);
  const eventSubscriptions =  useMemo(() => filterUserEventSubscription(data), [data]);
  const dashState = useSelector(selectDashState);
  useEffect(() => {
    dispatch(asyncFetchDashBriefInfo()).catch((err) => {
      logging.debug(err);
      notification.error({
        message: 'Error',
        description: err.message,
      });
    });
  }, []);
  const handleTabItemClick = (e) => {
    const dom = e.target.closest('[data-menu-key]');
    if (dom) {
      const href = {
        pathname: '/user-profile',
        query: {
          userId: currentUserId,
          dashTab: dom.dataset.menuKey,
        },
      }
      const asPath = getAsPath('/profile/:userId', href.query);
      router.push(href, asPath);
    }
  }
  return (
    <ScrollBox
      stopScrollPropagation
      scrollCacheKey='user_sidebar'
      style={{height: '100%'}}
    >
      <div className="c-UserSidebar">
        <div className="c-UserSidebar__header">
          <TranslatableMessage message={intlMessages.home} />
        </div>
        <div className="c-UserSidebarSection">
          <div className="c-UserSidebarSection__title">
            <span style={{ paddingLeft: '.5rem'}}>
              <TranslatableMessage message={userMenu.updateToDate} />
            </span>
          </div>
          <div className="c-UserSidebarSection__content">
            <div className="ds-Menu">
              <div className="ds-MenuItem">
                <Button 
                  className={classNames("ds-MenuLink", {
                    'is-current': activeKey === 'sales',
                  })}
                  data-menu-key='sales'
                  type="merge"
                  onClick={handleTabItemClick}
                >
                  
                  {dashState.data  && !!dashState.data.sales_update_num  ?
                    <Badge count={dashState.data.sales_update_num}>
                      <TranslatableMessage message={userMenu.sales} />
                    </Badge> : (
                      <TranslatableMessage message={userMenu.sales} />
                    )}
                </Button>
              </div>
              <div className="ds-MenuItem">
                <Button 
                  className={classNames("ds-MenuLink", {
                    'is-current': activeKey === 'purchase',
                  })}
                  data-menu-key='purchase'
                  type="merge"
                  onClick={handleTabItemClick}
                >
                  {dashState.data  && !!dashState.data.purchase_update_num  ?
                    <Badge count={dashState.data.purchase_update_num}>
                      <TranslatableMessage message={userMenu.purchase} />
                    </Badge> : (
                      <TranslatableMessage message={userMenu.purchase} />
                    )}
                </Button>
              </div>
              <div className="ds-MenuItem">
                <Button 
                  className={classNames("ds-MenuLink", {
                    'is-current': activeKey === 'demands',
                  })}
                  data-menu-key='demands'
                  type="merge"
                  onClick={handleTabItemClick}
                >
                  <Badge count={0}>
                    <TranslatableMessage message={userMenu.demand} />
                  </Badge>
                </Button>
              </div>
              <div className="ds-MenuItem">
                <Button 
                  className={classNames("ds-MenuLink", {
                    'is-current': activeKey === 'opportunity',
                  })}
                  data-menu-key='opportunity'
                  type="merge"
                  onClick={handleTabItemClick}
                >
                  <Badge count={0}>
                    <TranslatableMessage message={userMenu.opportunity} />
                  </Badge>
                </Button>
              </div>
              <div className="ds-MenuItem">
                <Button 
                  className={classNames("ds-MenuLink", {
                    'is-current': activeKey === 'file-x',
                  })}
                  type="merge"
                  onClick={() => {
                    const href = {
                      pathname: '/user-filex',
                      query: {
                        userId: currentUserId,
                      },
                    }
                    const asPath = `/profile/${currentUserId}/file-x`;
                    router.push(href, asPath);
                  }}
                >
                  <TranslatableMessage message={userMenu.filex} />
                </Button>
              </div>
              <div className="ds-MenuItem">
                <Button 
                  className={classNames("ds-MenuLink", {
                    'is-current': activeKey === 'dimzou',
                  })}
                  type="merge"
                  onClick={() => {
                    const href = {
                      pathname: '/dimzou-edit',
                      query: {
                        userId: currentUserId,
                      },
                    }
                    const asPath = `/profile/${currentUserId}/dimzou`;
                    router.push(href, asPath);
                  }}
                >
                  <TranslatableMessage message={userMenu.dimzou} />
                </Button>
              </div>
              <div className="ds-MenuItem">
                <Button 
                  className={classNames("ds-MenuLink", {
                    'is-current': activeKey === 'advertisement',
                  })}
                  data-menu-key='advertisement'
                  type="merge"
                  onClick={handleTabItemClick}
                >
                  <TranslatableMessage message={userMenu.advertisement} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        {dimzouSubscriptions.length || eventSubscriptions.length ? (
          <div className="c-UserSidebarSection">
            <div className="c-UserSidebarSection__title">
              <span style={{ paddingLeft: '.5rem'}}>
                <TranslatableMessage message={userMenu.chase} />
              </span>
            </div>
            <div className="c-UserSidebarSection__content">
              {!!dimzouSubscriptions.length && (

                <div className='c-UserSidebarSection__group'>
                  <div className="c-UserSidebarSection__groupTitle">
                    <Button 
                      type='merge'
                      block
                      style={{ fontWeight: 'bold', textAlign: 'left' }}
                      data-menu-key='dimzou-subscription'
                      onClick={handleTabItemClick}>
                      <TranslatableMessage message={userMenu.dimzouSubscription} />
                    </Button>
                  </div>
                  <div className="ds-Menu">
                    {dimzouSubscriptions.map((item) => (
                      <div key={item.id} className="ds-MenuItem">
                        <Button 
                          className={classNames("ds-MenuLink", {
                            'is-current': String(activeSubkey) === String(item.followed_user.uid),
                          })}
                          type="merge"
                          onClick={() => {
                            const href = {
                              pathname: '/dimzou-edit',
                              query: {
                                userId: item.followed_user.uid,
                              },
                            }
                            const asPath = getAsPath(`/profile/:userId/dimzou`, href.query);
                            router.push(href, asPath);
                          }}
                        >
                          {getUsername(item.followed_user)}
                        </Button>
                        <ActionMenu
                          actions={
                            [
                              { 
                                label: 'unfollow', 
                                key: 'unfollow',
                                onClick: () => {
                                  unsubscribe({
                                    type: 'user',
                                    targetId: item.followed_user.uid,
                                    entityType: item.entity_type,
                                  }).catch((err) => {
                                    notification.error({
                                      message: 'Error',
                                      description: err.message,
                                    });
                                  }) 
                                }},
                            ]
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!!eventSubscriptions.length && (
                <div className='c-UserSidebarSection__group'>
                  <div className="c-UserSidebarSection__groupTitle">
                    <Button
                      type="merge"
                      block
                      style={{ fontWeight: 'bold', textAlign: 'left' }}
                      data-menu-key='filex-subscription'
                      onClick={handleTabItemClick}
                    >
                      <TranslatableMessage message={userMenu.filexSubscription} />
                    </Button>
                  </div>
                  <div className="ds-Menu">
                    {eventSubscriptions.map((item) => (
                      <div key={item.id} className="ds-MenuItem">
                        <Button 
                          className={classNames("ds-MenuLink", {
                            'is-current': String(activeSubkey) === String(item.followed_user.uid),
                          })}
                          type="merge"
                          onClick={() => {
                            const href = {
                              pathname: '/user-filex',
                              query: {
                                userId: item.followed_user.uid,
                              },
                            }
                            const asPath = getAsPath(`/profile/:userId/file-x`, href.query);
                            router.push(href, asPath);
                          }}
                        >
                          {getUsername(item.followed_user)}
                        </Button>
                        <ActionMenu
                          actions={
                            [
                              { 
                                label: 'unfollow', 
                                key: 'unfollow',
                                onClick: () => {
                                  unsubscribe({
                                    type: 'user',
                                    targetId: item.followed_user.uid,
                                    entityType: item.entity_type,
                                  }).catch((err) => {
                                    notification.error({
                                      message: 'Error',
                                      description: err.message,
                                    });
                                  }) 
                                }},
                            ]
                          }
                        />
                      </div>
                    ))}
                  </div>
            
                </div>
              )}
            </div>
          </div>
        ) : null}
        <div className="c-UserSidebarSection">
          <div className="c-UserSidebarSection__title"></div>
          <div className="c-UserSidebarSection__content">
            <div className="ds-Menu">
              <div className="ds-MenuItem">
                <Button 
                  className={classNames("ds-MenuLink", 'ds-MenuLink_button', {
                    'is-current': activeKey === 'settings',
                  })}
                  type="merge"
                  onClick={() => {
                    router.push({
                      pathname: '/settings',
                    }, '/settings')
                  }}
                >
                  <TranslatableMessage message={userMenu.settings} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollBox>
  )
}

UserSidebar.propTypes = {
  activeKey: PropTypes.string,
  activeSubkey: PropTypes.string,
}

export default UserSidebar;