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

import React from 'react';
import _ from 'lodash';

import { storiesOf } from '@storybook/react';


import * as profiles from '../../../data/patient/profiles';
import { data as dataStub } from '../../../data/patient/data';

import { MGDL_UNITS, MMOLL_UNITS } from '../../../src/utils/constants';

let data;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  data = require('../../../local/print-view.json');
} catch (e) {
  data = dataStub;
}

const bgBounds = {
  [MGDL_UNITS]: {
    veryHighThreshold: 300,
    targetUpperBound: 180,
    targetLowerBound: 70,
    veryLowThreshold: 54,
  },
  [MMOLL_UNITS]: {
    veryHighThreshold: 16.7,
    targetUpperBound: 10,
    targetLowerBound: 3.9,
    veryLowThreshold: 3.12345,
  },
};

const notes = '';

storiesOf('Stacked Daily Graph', module)
  .add(`standard account (${MGDL_UNITS})`, () => (
    <button onClick={() => {}}>
      Open PDF in new tab
    </button>
  ));
