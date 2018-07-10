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
import { withKnobs, selectV2 } from '@storybook/addon-knobs';

import StackedDailyGraphSVGContainer from '../../../src/components/Graph/StackedDailyGraphSVGContainer';
import { data as dataStub } from '../../../data/patient/data';

import StoryContainerComponent from '../../utils/StoryContainerComponent';
import { MGDL_UNITS, MMOLL_UNITS } from '../../../src/utils/constants';
import {
  GRAPH_RENDERER_SVG,
  GRAPH_RENDERER_THREE_JS,
} from '../../../src/components/Graph/helpers';

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

const bgPrefs = {
  [MGDL_UNITS]: {
    bgBounds: bgBounds[MGDL_UNITS],
    bgUnits: MGDL_UNITS,
  },
};

const timePrefs = {
  timezoneAware: true,
  timezoneName: 'US/Eastern',
};

const dailyData = data[MMOLL_UNITS].daily.dataByDate;
const dates = _.keys(dailyData).sort();

const stories = storiesOf('Stacked Daily Graph', module);
stories.addDecorator(withKnobs);
const rendererLabel = 'Renderer';
const rendererOptions = [GRAPH_RENDERER_THREE_JS, GRAPH_RENDERER_SVG];
// const defaultRenderer = GRAPH_RENDERER_THREE_JS;
const defaultRenderer = GRAPH_RENDERER_SVG;

const selectGraphRenderer = () => {
  const graphRenderer = selectV2(
    rendererLabel,
    rendererOptions,
    defaultRenderer,
  );

  return graphRenderer;
};

/* eslint-disable react/jsx-filename-extension */
stories.add(`standard account (${MGDL_UNITS})`, () => (
  <StoryContainerComponent behaviors={[]}>
    <StackedDailyGraphSVGContainer
      bgPrefs={bgPrefs[MGDL_UNITS]}
      timePrefs={timePrefs}
      dataByDate={dailyData}
      dates={dates}
      graphRenderer={selectGraphRenderer()}
    />
  </StoryContainerComponent>
));

/* eslint-enable react/jsx-filename-extension */
