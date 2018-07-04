import _ from 'lodash';
import cx from 'classnames';

/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2017, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

import PropTypes from 'prop-types';

import React, { PureComponent } from 'react';
import { TransitionMotion, spring } from 'react-motion';

import { classifyBgValue } from '../../../utils/bloodglucose';
import { springConfig } from '../../../utils/constants';
import withDefaultYPosition from '../common/withDefaultYPosition';

import styles from './CBGMedianAnimated.css';

export class CBGMedianAnimated extends PureComponent {
  static defaultProps = {
    medianHeight: 10,
    medianWidth: 14,
  };

  static propTypes = {
    bgBounds: PropTypes.shape({
      veryHighThreshold: PropTypes.number.isRequired,
      targetUpperBound: PropTypes.number.isRequired,
      targetLowerBound: PropTypes.number.isRequired,
      veryLowThreshold: PropTypes.number.isRequired,
    }).isRequired,
    datum: PropTypes.shape({
      firstQuartile: PropTypes.number,
      id: PropTypes.string.isRequired,
      max: PropTypes.number,
      median: PropTypes.number,
      min: PropTypes.number,
      msFrom: PropTypes.number.isRequired,
      msTo: PropTypes.number.isRequired,
      msX: PropTypes.number.isRequired,
      ninetiethQuantile: PropTypes.number,
      tenthQuantile: PropTypes.number,
      thirdQuartile: PropTypes.number,
    }).isRequired,
    defaultY: PropTypes.number.isRequired,
    displayingMedian: PropTypes.bool.isRequired,
    medianHeight: PropTypes.number.isRequired,
    medianWidth: PropTypes.number.isRequired,
    showingCbgDateTraces: PropTypes.bool.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.willEnter = this.willEnter.bind(this);
    this.willLeave = this.willLeave.bind(this);
  }

  willEnter() {
    const { defaultY } = this.props;

    return {
      height: 0,
      median: defaultY,
      opacity: 0,
    };
  }

  willLeave() {
    const { defaultY } = this.props;
    const shrinkOut = spring(0, springConfig);
    return {
      height: shrinkOut,
      median: spring(defaultY, springConfig),
      opacity: shrinkOut,
    };
  }

  render() {
    const {
      bgBounds,
      datum,
      defaultY,
      displayingMedian,
      medianHeight,
      medianWidth,
      showingCbgDateTraces,
      xScale,
      yScale,
    } = this.props;

    const medianClasses = datum.median ?
      cx({
        [styles.median]: true,
        [styles[`${classifyBgValue(bgBounds, datum.median)}FadeIn`]]: !showingCbgDateTraces,
        [styles[`${classifyBgValue(bgBounds, datum.median)}FadeOut`]]: showingCbgDateTraces,
      }) :
      cx({
        [styles.median]: true,
        [styles.transparent]: true,
      });

    const binLeftX = xScale(datum.msX) - medianWidth / 2 + styles.stroke / 2;
    const width = medianWidth - styles.stroke;

    const shouldRender = displayingMedian && (_.get(datum, 'median') !== undefined);

    return (
      <TransitionMotion
        defaultStyles={shouldRender ? [{
          key: 'median',
          style: {
            height: 0,
            median: defaultY,
            opacity: 0,
          },
        }] : []}
        styles={shouldRender ? [{
          key: 'median',
          style: {
            height: spring(medianHeight, springConfig),
            median: spring(yScale(datum.median) - medianHeight / 2, springConfig),
            opacity: spring(1.0, springConfig),
          },
        }] : []}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {(interpolateds) => {
          if (interpolateds.length === 0) {
            return null;
          }
          const { key, style } = interpolateds[0];
          return (
            <rect
              className={medianClasses}
              id={`cbgMedian-${key}`}
              width={width}
              height={style.height}
              x={binLeftX}
              y={style.median}
              opacity={style.opacity}
            />
          );
        }}
      </TransitionMotion>
    );
  }
}

export default withDefaultYPosition(CBGMedianAnimated);
