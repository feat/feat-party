import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import { fetchDirection as fetchDirectionRequest } from '@/client/geo';

import DirectionMap from '@/components/DirectionMap';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import Button from '@feat/feat-ui/lib/button';

import directionMessages from '@/components/DirectionMap/messages';

import './style.scss';

const modes = ['driving', 'transit', 'walking'];

class MiniDirectionMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      origin: this.props.origin || null,
      target: this.props.target || null,
      selectedDirections: [],
    };
  }

  componentDidMount() {
    this.customIsMounted = true;
    if (this.props.asyncOrigin) {
      this.props
        .asyncOrigin()
        .then((origin) => {
          this.customIsMounted &&
            this.setState(
              {
                origin,
              },
              () => {
                this.updateMap();
                this.fetchDirections();
              },
            );
        })
        .catch((err) => {
          this.customIsMounted &&
            this.setState({
              originError: err,
            });
        });
    }
    if (this.props.asyncTarget) {
      this.props
        .asyncTarget()
        .then((target) => {
          this.customIsMounted &&
            this.setState(
              {
                target,
              },
              () => {
                this.updateMap();
                this.fetchDirections();
              },
            );
        })
        .catch((err) => {
          this.customIsMounted &&
            this.setState({
              targetError: err,
            });
        });
    }
    if (this.props.target && this.props.origin) {
      this.fetchDirections();
    }
  }

  componentWillUnmount() {
    this.customIsMounted = false;
  }

  fetchDirections = () => {
    const { target, origin } = this.state;
    if (!target || !origin) {
      return;
    }
    this.fetchDirection('driving');
    this.fetchDirection('walking');
    this.fetchDirection('transit');
  };

  fetchDirection(mode) {
    const { origin, target } = this.state;
    this.setState({
      [`${mode}DirectionFetching`]: true,
    });
    fetchDirectionRequest({
      destination: `${target.lat},${target.lng}`,
      origin: `${origin.lat},${origin.lng}`,
      mode,
    })
      .then((res) => {
        if (this.customIsMounted) {
          this.setState(
            {
              [`${mode}Direction`]: res.routes[0],
            },
            this.updateMap,
          );
        }
      })
      .finally(() => {
        if (this.customIsMounted) {
          this.setState({
            [`${mode}DirectionFetching`]: false,
            [`${mode}DirectionFetched`]: true,
          });
        }
      });
  }

  updateMap = () => {
    const data = {
      origin: this.state.origin,
      target: this.state.target,
    };
    const selectedDirections = this.state.selectedDirections.length
      ? this.state.selectedDirections
      : modes;

    const directions = [];
    selectedDirections.forEach((mode) => {
      const direction = this.state[`${mode}Direction`];
      if (direction) {
        directions.push({
          mode,
          polyline: direction.overviewPolyline,
        });
      }
    });

    data.directions = directions;
    if (this.directionMap) {
      this.directionMap.setData(data);
    } else {
      logging.warn('MiniDirectionMap: directionMap is falsy');
    }
  };

  toggleSelected = (mode) => {
    const { selectedDirections } = this.state;
    if (selectedDirections[0] === mode) {
      this.setState(
        {
          selectedDirections: [],
        },
        this.updateMap,
      );
    } else {
      this.setState(
        {
          selectedDirections: [mode],
        },
        this.updateMap,
      );
    }
  };

  renderModeButton(mode) {
    const { selectedDirections } = this.state;
    const direction = this.state[`${mode}Direction`];
    const fetching = this.state[`${mode}DirectionFetching`];
    const fetched = this.state[`${mode}DirectionFetched`];
    const className = classNames(
      `MiniDirectionMap__item MiniDirectionMap__item_${mode}`,
      {
        'is-selected': selectedDirections.indexOf(mode) > -1,
      },
    );

    return (
      <div key={mode} className="MiniDirectionMap__footerCell">
        <Button
          type="merge"
          className={className}
          key={mode}
          disabled={fetching || (fetched && !direction)}
          onClick={() => this.toggleSelected(mode)}
        >
          <div className="MiniDirectionMap__itemLabel">
            <TranslatableMessage message={directionMessages[`${mode}Label`]} />
          </div>
          <div className="MiniDirectionMap__itemDuration">
            {(fetching || (fetched && !direction)) && '--'}
            {!fetching &&
              fetched &&
              direction &&
              moment.duration(direction.duration, 'seconds').humanize()}
          </div>
        </Button>
      </div>
    );
  }

  renderOption() {
    if (!this.state.target || !this.state.origin) {
      return <div className="MiniDirectionMap__footer">...</div>;
    }
    return (
      <div className="MiniDirectionMap__footer">
        {modes.map((mode) => this.renderModeButton(mode))}
      </div>
    );
  }

  render() {
    const { provider, className, hasDirection } = this.props;
    return (
      <div className={classNames('MiniDirectionMap', className)}>
        {this.state.target || this.state.origin ? (
          <DirectionMap
            ref={(n) => {
              this.directionMap = n;
            }}
            provider={provider}
            target={this.state.target}
            origin={this.state.origin}
          />
        ) : (
          <div className="MiniDirectionMap__placeholder" />
        )}
        {hasDirection && this.renderOption()}
      </div>
    );
  }
}

MiniDirectionMap.propTypes = {
  className: PropTypes.string,
  origin: PropTypes.object, // { lat, lng, radius }
  target: PropTypes.object, // { lat, lng, radius|brounds }
  asyncTarget: PropTypes.func, // resolve geo info.
  asyncOrigin: PropTypes.func,
  provider: PropTypes.oneOf(['gaode', 'google']),
  hasDirection: PropTypes.bool,
};

MiniDirectionMap.defaultProps = {
  hasDirection: true,
};

export default MiniDirectionMap;
