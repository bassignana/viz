/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2016, Tidepool Project
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
import { format } from 'd3-format';
import { convertToMmolL } from './bloodglucose';
import { BG_HIGH, BG_LOW, MMOLL_UNITS } from './constants';

/**
 * displayDecimal
 * @param  {Number} val    numeric value to format
 * @param  {Number} places number of decimal places to displayDecimal
 * @return {String}        val formatted to places decimal places
 */
export function displayDecimal(val, places) {
  if (places === null || places === undefined) {
    return format('d')(val);
  }
  return format(`.${places}f`)(val);
}

/**
 * displayBgValue
 * @param {Number} val - integer or float blood glucose value in either mg/dL or mmol/L
 * @param {String} units - 'mg/dL' or 'mmol/L'
 * @param {Object} outOfRangeThresholds - specifies thresholds for `low` and `high` values
 *
 * @return {String} stringBgValue
 */
export function displayBgValue(val, units, outOfRangeThresholds) {
  if (!_.isEmpty(outOfRangeThresholds)) {
    let lowThreshold = outOfRangeThresholds.low;
    let highThreshold = outOfRangeThresholds.high;
    if (units === MMOLL_UNITS) {
      if (lowThreshold) {
        lowThreshold = convertToMmolL(lowThreshold);
      }
      if (highThreshold) {
        highThreshold = convertToMmolL(highThreshold);
      }
    }
    if (lowThreshold && val < lowThreshold) {
      return BG_LOW;
    }
    if (highThreshold && val > highThreshold) {
      return BG_HIGH;
    }
  }
  if (units === MMOLL_UNITS) {
    return format('.1f')(val);
  }
  return format('d')(val);
}

/**
 * displayPercentage
 * @param {Number} val - raw decimal proportion, range of 0.0 to 1.0
 *
 * @return {String} percentage
 */
export function displayPercentage(val) {
  return format('.0%')(val);
}
