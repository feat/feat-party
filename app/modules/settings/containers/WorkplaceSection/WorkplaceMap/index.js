import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import L from 'leaflet';

import getRandomId from '@/utils/getRandomId';
import tileProviderMap from '@feat/feat-ui/lib/map/leafletProviderConfig';

import './style.scss';

class WorkplaceMap extends Component {
  constructor(props) {
    super(props);
    this.domId = getRandomId('WorkplaceMap');
  }

  componentDidMount() {
    this.renderMap();
  }

  renderMap() {
    const {
      provider,
      lat,
      lng,
      radius,
      address,
      zoom,
      zoomControl,
      scrollWheelZoom,
      draggable,
    } = this.props;
    const position = [lat, lng];
    const domId = this.domId;

    const mapLayer = L.tileLayer(
      tileProviderMap[provider].url,
      Object.assign(
        {
          minZoom: 0,
          maxZoom: 23,
        },
        tileProviderMap[provider].options,
      ),
    );

    const map = L.map(domId, {
      center: position,
      layers: [mapLayer],
      zoom,
      zoomControl,
      scrollWheelZoom,
    });

    const marker = L.marker(position, {
      icon: L.divIcon({
        className: 'WorkplaceMap__marker',
        iconSize: [28, 32],
        iconAnchor: [11, 16],
        // iconSize: [20, 33],
      }),
      draggable,
    }).addTo(map);

    if (draggable) {
      map.on('click', (e) => {
        const clickLatlng = e.latlng;
        this.marker.setLatLng(clickLatlng);
      });

      marker.on('dragend', () => {
        const latlng = this.marker.getLatLng();
        this.props.onMarkerDragged(latlng);
      });
    }

    if (address) {
      marker.bindPopup(address);
    }
    let circle;
    let featureGroup;

    if (radius) {
      circle = L.circle(position, radius, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
      }).addTo(map);
      featureGroup = L.featureGroup([marker, circle]);
      map.flyToBounds(featureGroup.getBounds());
    }

    this.map = map;
    this.marker = marker;
    this.circle = circle;
    this.featureGroup = featureGroup;
  }

  render() {
    const { className, style, footerAddress, address } = this.props;
    return (
      <div className="WorkplaceMap">
        <div
          id={this.domId}
          className={classNames('WorkplaceMap__canvas', className)}
          style={style}
        />
        {footerAddress && (
          <div className="WorkplaceMap__address">{address}</div>
        )}
      </div>
    );
  }
}

WorkplaceMap.propTypes = {
  provider: PropTypes.oneOf(['gaode', 'google']).isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  radius: PropTypes.number,
  address: PropTypes.string,
  style: PropTypes.object,
  zoom: PropTypes.number,
  zoomControl: PropTypes.bool,
  scrollWheelZoom: PropTypes.bool,
  className: PropTypes.string,
  footerAddress: PropTypes.bool,
  draggable: PropTypes.bool,
  onMarkerDragged: PropTypes.func,
};

WorkplaceMap.defaultProps = {
  zoom: 12,
  zoomControl: false,
  scrollWheelZoom: true,
  footerAddress: false,
};

export default WorkplaceMap;
