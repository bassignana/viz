/* eslint-disable */
import { configure, addDecorator, addParameters } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs';
import { withContexts } from '@storybook/addon-contexts/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import React from 'react';

import { contexts, DataProvider } from './contexts';
import DataUtil from '../src/utils/DataUtil.js';

import dataSources from './dataSources';

addParameters({
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
    },
  },
});

addDecorator(withNotes);
addDecorator(withKnobs);

let data;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  data = require('../local/blip-input.json');
} catch (e) {
  data = [];
}

const patientId = 'abc123';
const dataUtil = new DataUtil();

const props = {
  dataUtil,
  patientId,
  dataSources,
};

addDecorator(withContexts(contexts));

addDecorator(storyFn => (
  <DataProvider>{storyFn(props)}</DataProvider>
));


function loadStories() {
  const context = require.context('../stories', true, /.js$/); // Load .js files in /storybook
  context.keys().forEach(context);
}

configure(loadStories, module);
