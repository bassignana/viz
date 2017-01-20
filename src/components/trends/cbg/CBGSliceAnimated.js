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

import _ from 'lodash';
import React, { PropTypes, PureComponent } from 'react';
import { TransitionMotion, spring } from 'react-motion';

import { springConfig } from '../../../utils/constants';
import withDefaultYPosition from '../common/withDefaultYPosition';

import styles from './CBGSliceAnimated.css';

export class CBGSliceAnimated extends PureComponent {
  static defaultProps = {
    sliceWidth: 16,
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
    displayFlags: PropTypes.shape({
      cbg100Enabled: PropTypes.bool.isRequired,
      cbg80Enabled: PropTypes.bool.isRequired,
      cbg50Enabled: PropTypes.bool.isRequired,
      cbgMedianEnabled: PropTypes.bool.isRequired,
    }).isRequired,
    focusSlice: PropTypes.func.isRequired,
    sliceWidth: PropTypes.number.isRequired,
    tooltipLeftThreshold: PropTypes.number.isRequired,
    topMargin: PropTypes.number.isRequired,
    unfocusSlice: PropTypes.func.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.willEnter = this.willEnter.bind(this);
    this.willLeave = this.willLeave.bind(this);
  }

  willEnter(entered) {
    const { style } = entered;
    const { defaultY } = this.props;

    return {
      binLeftX: style.binLeftX,
      bottom10Height: 0,
      firstQuartile: defaultY,
      innerQuartilesHeight: 0,
      lower15Height: 0,
      max: defaultY,
      ninetiethQuantile: defaultY,
      opacity: 0,
      tenthQuantile: defaultY,
      thirdQuartile: defaultY,
      top10Height: 0,
      upper15Height: 0,
      width: style.width,
    };
  }

  willLeave(exited) {
    const { style } = exited;
    const { defaultY } = this.props;
    const defaultYSpring = spring(defaultY, springConfig);
    const shrinkOut = spring(0, springConfig);
    return {
      binLeftX: style.binLeftX,
      bottom10Height: shrinkOut,
      firstQuartile: defaultYSpring,
      innerQuartilesHeight: shrinkOut,
      lower15Height: shrinkOut,
      max: defaultYSpring,
      ninetiethQuantile: defaultYSpring,
      opacity: shrinkOut,
      tenthQuantile: defaultYSpring,
      thirdQuartile: defaultYSpring,
      top10Height: shrinkOut,
      upper15Height: shrinkOut,
      width: style.width,
    };
  }

  render() {
    const {
      datum,
      defaultY,
      displayFlags,
      focusSlice,
      sliceWidth,
      tooltipLeftThreshold,
      topMargin,
      unfocusSlice,
      xScale,
      yScale,
    } = this.props;

    const renderPieces = {
      top10: {
        className: styles.rangeSegment,
        displayFlag: 'cbg100Enabled',
        height: 'top10Height',
        heightKeys: ['ninetiethQuantile', 'max'],
        key: 'top10',
        y: 'max',
      },
      bottom10: {
        className: styles.rangeSegment,
        displayFlag: 'cbg100Enabled',
        height: 'bottom10Height',
        heightKeys: ['min', 'tenthQuantile'],
        key: 'bottom10',
        y: 'tenthQuantile',
      },
      upper15: {
        className: styles.outerSegment,
        displayFlag: 'cbg80Enabled',
        height: 'upper15Height',
        heightKeys: ['thirdQuartile', 'ninetiethQuantile'],
        key: 'upper15',
        y: 'ninetiethQuantile',
      },
      lower15: {
        className: styles.outerSegment,
        displayFlag: 'cbg80Enabled',
        height: 'lower15Height',
        heightKeys: ['tenthQuantile', 'firstQuartile'],
        key: 'lower15',
        y: 'firstQuartile',
      },
      innerQuartiles: {
        className: styles.innerQuartilesSegment,
        displayFlag: 'cbg50Enabled',
        height: 'innerQuartilesHeight',
        heightKeys: ['firstQuartile', 'thirdQuartile'],
        key: 'innerQuartiles',
        y: 'thirdQuartile',
      },
    };
    const toRender = _.filter(renderPieces, (piece) => (displayFlags[piece.displayFlag]));
    const yPositions = {
      firstQuartile: yScale(datum.firstQuartile),
      max: yScale(datum.max),
      median: yScale(datum.median),
      min: yScale(datum.min),
      ninetiethQuantile: yScale(datum.ninetiethQuantile),
      tenthQuantile: yScale(datum.tenthQuantile),
      thirdQuartile: yScale(datum.thirdQuartile),
      topMargin,
    };

    const binLeftX = xScale(datum.msX) - sliceWidth / 2 + styles.stroke / 2;
    const width = sliceWidth - styles.stroke;

    return (
      <TransitionMotion
        defaultStyles={_.get(datum, 'min') !== undefined ? _.map(toRender, (segment) => ({
          key: segment.key,
          style: {
            binLeftX,
            [segment.y]: defaultY,
            width,
            [segment.height]: 0,
            opacity: 0,
          },
        })) : []}
        styles={_.get(datum, 'min') !== undefined ? _.map(toRender, (segment) => ({
          key: segment.key,
          style: {
            binLeftX,
            [segment.y]: spring(yScale(datum[segment.y]), springConfig),
            width,
            [segment.height]: spring(
              yScale(datum[segment.heightKeys[0]]) - yScale(datum[segment.heightKeys[1]]),
              springConfig
            ),
            opacity: spring(1.0, springConfig),
          },
        })) : []}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {(interpolateds) => {
          if (interpolateds.length === 0) {
            return null;
          }
          const onlyNonZeros = _.reject(interpolateds, (interpolated) => (
            _.get(interpolated, ['style', 'opacity']) === 0
          ));
          return (
            <g id={`cbgSlice-${datum.id}`}>
              {_.map(onlyNonZeros, (piece) => {
                const { key, style } = piece;
                const segment = renderPieces[key];
                return (
                  <rect
                    className={segment.className}
                    key={key}
                    id={key}
                    width={style.width}
                    height={style[renderPieces[key].height]}
                    x={style.binLeftX}
                    y={style[renderPieces[key].y]}
                    opacity={style.opacity}
                    onMouseOver={() => {
                      focusSlice(datum, {
                        left: xScale(datum.msX),
                        tooltipLeft: datum.msX > tooltipLeftThreshold,
                        yPositions,
                      }, segment.heightKeys);
                    }}
                    onMouseOut={unfocusSlice}
                  />
                );
              })}
            </g>
          );
        }}
      </TransitionMotion>
    );
  }
}

export default withDefaultYPosition(CBGSliceAnimated);
