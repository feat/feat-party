import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux';

import {
  // queryLocationElements,
  fetchGeocode as fetchGeocodeRequest,
} from '@/client/geo';

import { formatMessage } from '@/services/intl';

import Block from '@feat/feat-ui/lib/block';
import Button from '@feat/feat-ui/lib/button';
import notification from '@feat/feat-ui/lib/notification';
import message from '@feat/feat-ui/lib/message';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import { getCurrentLocation } from '@/utils/geo';

import { defaultInitialValues } from '@/components/AddressForm';
import WorkplaceMap from './WorkplaceMap';

import countryOptions from './assets/countries';
import intlMessages from './messages';

import './style.scss';
import { 
  asyncUpdateWorkplace, 
  asyncFetchWorkplace, 
} from '../../actions/commerce';
import {
  selectWorkplace,
  selectWorkplaceBlockState,
} from '../../selectors';
import WorkplaceForm from './WorkplaceForm';

const hasValidWorkplaceData = (data) => data && !!data.country_code;

class WorkplaceSection extends React.PureComponent {
  state = {
    isEditModeEnabled: false,
  }

  componentDidMount() {
    const { blockState } = this.props;
    if (!blockState.onceFetched && !blockState.loading) {
      this.props.fetchData().catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
    if (blockState.onceFetched) {
      this.setState({
        isEditModeEnabled: true,
        initialFormValues: this.getInitialFormValues(),
      })
    }
  }

  componentDidUpdate() {
    const { blockState } = this.props;
    if (!this.state.isEditModeEnabled && blockState.onceFetched && !blockState.loading) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isEditModeEnabled: true,
        initialFormValues: this.getInitialFormValues(),
      });
    }
  }

  getInitialFormValues() {
    if (hasValidWorkplaceData(this.props.data)) {
      return {
        id: this.props.data.id,
        country_code: this.props.data.country_code,
        level_1: this.props.data.level_1 || '',
        level_2: this.props.data.level_2 || '',
        level_3: this.props.data.level_3 || '',
        level_4: this.props.data.level_4 || '',
        level_5: this.props.data.level_5 || '',
        level_6: this.props.data.level_6 || '',
        address: this.props.data.address || '',
        geo: {
          lat: this.props.data.lat,
          lng: this.props.data.lng,
        },
      };
    }
    const data = { ...defaultInitialValues };
    delete data.contact_name;
    delete data.phone;

    return data;
  }

  initEdit = (e) => {
    e.preventDefault();
    this.setState({
      isEditModeEnabled: true,
      initialFormValues: this.getInitialFormValues(),
    });
  }

  processFormValues = (values) => {
    const { initialFormValues: initialValues } = this.state;
    const preData = { ...values };
    const mode = initialValues.id ? 'update' : 'create';
    const isAutoFill = !initialValues.id && initialValues.geo;

    if (isAutoFill) {
      preData.lat = preData.geo.lat;
      preData.lng = preData.geo.lng;
      delete preData.auto_geo;
      delete preData.geo;
    } else if (mode === 'create') {
      if (preData.geo) {
        preData.lat = preData.geo.lat;
        preData.lng = preData.geo.lng;
        delete preData.auto_geo;
        delete preData.geo;
      } else if (preData.auto_geo) {
        preData.lat = preData.auto_geo.lat;
        preData.lng = preData.auto_geo.lng;
        delete preData.auto_geo;
      }
    } else if (mode === 'update') {
      if (
        initialValues.geo &&
        preData.geo &&
        initialValues.geo.lng !== preData.geo.lng &&
        initialValues.geo.lat !== preData.geo.lag
      ) {
        preData.lat = preData.geo.lat;
        preData.lng = preData.geo.lng;
        delete preData.geo;
        delete preData.auto_geo;
      } else if (values.auto_geo) {
        preData.lat = preData.auto_geo.lat;
        preData.lng = preData.auto_geo.lng;
        delete preData.auto_geo;
        delete preData.geo;
      }
    }
    delete preData.contact_name;
    delete preData.phone;
    ['level_1', 'level_2', 'level_3', 'level_4', 'level_5', 'level_6', 'address'].forEach((key) => {
      if (!preData[key]) {
        preData[key] = null;
      }
    })
    // if (!preData.level_5) {
    //   delete preData.level_5;
    // }
    return preData;
  }

  handleSubmit = (values, { setSubmitting, setErrors }) => {
    const preData = this.processFormValues(values);
    // logging.debug(preData);
    return this.props
      .updateWorkplace(preData)
      .then(
        () => {
          // this.setState({
          //   isEditModeEnabled: false,
          // })
          this.setState({
            initialFormValues: this.getInitialFormValues(),
          })
          message.success({
            content: formatMessage(intlMessages.workplaceUpdated),
          });
        }
      )
      .catch((err) => {
        logging.debug(err);
        setSubmitting(false);
        if (err.code === 'VALIDATION_EXCEPTION') {
          setErrors(err.data);
        } else {
          notification.error({
            message: 'Error',
            description: err.message,
          });
        }
      });
  };

  // handleCancel = (e) => {
  //   e.preventDefault();
  //   this.setState({
  //     isEditModeEnabled: false,
  //   })
  // };

  handleAutoFill = () => 
    getCurrentLocation().then((data) => {
      this.setState({
        initialFormValues: {
          id: this.props.data ? this.props.data.id : undefined,
          country_code: data.country_code,
          level_1: data.level_1 || '',
          level_2: data.level_2 || '',
          level_3: data.level_3 || '',
          level_4: data.level_4 || '',
          level_5: data.level_5 || '',
          level_6: data.level_6 || '',
          address: data.address || '',
          geo: data.geo,
        },
      })
    })

  render() {
    const { blockState, data, formRef } = this.props;
    if (!blockState.onceFetched || blockState.loading || blockState.fetchError) {
      return (
        <Block
          title={<TranslatableMessage message={intlMessages.blockTitle} />}
        >
          {blockState.fetchError ? (
            <div>{blockState.fetchError.message}</div>
          ) : <div>Loading...</div>}
        </Block>
      );
    }

    if (this.state.isEditModeEnabled) {
      return (
        <WorkplaceForm
          formRef={formRef}
          initialValues={this.state.initialFormValues}
          onSubmit={this.handleSubmit}
          countryOptions={countryOptions}
          fetchGeocode={fetchGeocodeRequest}
          canAutoFill
          autoFill={this.handleAutoFill}
        />
      )
    } 
    return (
      <Block
        title={<TranslatableMessage message={intlMessages.blockTitle} />}
        subTitle={
          data && <Button type="merge" onClick={this.initEdit}>
            {data.formatted}
          </Button>
        }
      >
        {data && (
          <div className="Workplace__preview">
            <div className="Workplace__mapContainer">
              {data.lat &&
            data.lng && (
                <WorkplaceMap
                  provider={data.country_code === 'CHN' ? 'gaode' : 'google'}
                  lat={data.lat}
                  lng={data.lng}
                  zoom={15}
                />
              )}
            </div>
          </div>
        )}
      </Block>
    )

  }
}

WorkplaceSection.propTypes = {
  data: PropTypes.object,
  blockState: PropTypes.object,
  fetchData: PropTypes.func,
  updateWorkplace: PropTypes.func,
  formRef: PropTypes.func,
};



const mapStateToProps = createStructuredSelector({
  blockState: selectWorkplaceBlockState,
  data: selectWorkplace,
})

const mapDispatchToProps = {
  fetchData: asyncFetchWorkplace,
  updateWorkplace: asyncUpdateWorkplace,
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkplaceSection);
