import React from 'react';
import { Linking } from 'react-native';
import { storiesOf } from '@storybook/react';
import { withKnobs, selectV2 } from '@storybook/addon-knobs';
import _ from 'lodash';

import StoryContainerComponent from '../utils/StoryContainerComponent';
import Graph from '../../src/components/Graph/Graph';
import {
  makeYAxisLabelValues,
  makeYAxisBGBoundaryValues,
  DEFAULT_LOW_BG_BOUNDARY_VALUE,
  DEFAULT_HIGH_BG_BOUNDARY_VALUE,
  GRAPH_RENDERER_SVG,
  GRAPH_RENDERER_THREE_JS,
} from '../../src/components/Graph/helpers';
import Urls from '../../src/constants/Urls';
import GraphData from '../../src/models/GraphData';
import data1 from '../data/data-smbg-bolus-cbg-wizard-basal/start-2015-07-27T00-00-00.000Z-end-2015-07-28T16-00-00.000Z.json';
import data2 from '../data/data-smbg-bolus-cbg-wizard-basal/start-2015-08-11T20-00-00.000Z-end-2015-08-13T12-00-00.000Z.json';


import { data as dataStub } from '../../data/patient/data';
import { MMOLL_UNITS } from '../../src/utils/constants';

let data;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  data = require('../../local/print-view.json');
} catch (e) {
  data = dataStub;
}

const lowBGBoundary = 90;
const highBGBoundary = 150;

const eventTime1 = new Date('Mon Jul 27 2015 22:29:00 GMT-0500 (CDT)');
const eventTime1Seconds = eventTime1.getTime() / 1000;
const graphData1 = new GraphData();
graphData1.addResponseData(data1);
graphData1.process({
  eventTimeSeconds: eventTime1Seconds,
  timeIntervalSeconds: 60 * 60 * 12,
  lowBGBoundary,
  highBGBoundary,
});

const eventTime2 = new Date('Wed Aug 12 2015 17:40:00 GMT-0500 (CDT)');
const eventTime2Seconds = eventTime2.getTime() / 1000;
const graphData2 = new GraphData();
graphData2.addResponseData(data2);
graphData2.process({
  eventTimeSeconds: eventTime2Seconds,
  timeIntervalSeconds: 60 * 60 * 12,
  lowBGBoundary,
  highBGBoundary,
});

const dailyData = data[MMOLL_UNITS].daily.dataByDate;
const date = _.findLastKey(dailyData, 'date');
const data3 = _.map(_.flatten(_.valuesIn(_.pick(dailyData[date].data, [
  'basal',
  'bolus',
  'cbg',
  'smbg',
]))), (d) => {
  d.deliveryType = d.subType;
  d.time = d.normalTime;
  return d;
});

const eventTime3 = new Date(`${date}T16:00:00.000Z`);
const eventTime3Seconds = eventTime3.getTime() / 1000;
const graphData3 = new GraphData();
graphData3.addResponseData(data3);
graphData3.process({
  eventTimeSeconds: eventTime3Seconds,
  timeIntervalSeconds: 60 * 60 * 12,
  lowBGBoundary,
  highBGBoundary,
});

const isLoading = false;
const yAxisLabelValues = makeYAxisLabelValues({
  lowBGBoundary: DEFAULT_LOW_BG_BOUNDARY_VALUE,
  highBGBoundary: DEFAULT_HIGH_BG_BOUNDARY_VALUE,
});
const yAxisBGBoundaryValues = makeYAxisBGBoundaryValues({
  lowBGBoundary: DEFAULT_LOW_BG_BOUNDARY_VALUE,
  highBGBoundary: DEFAULT_HIGH_BG_BOUNDARY_VALUE,
});
const navigateHowToUpload = () => {
  Linking.openURL(Urls.howToUpload);
};
const onZoomStart = () => {};
const onZoomEnd = () => {};

const stories = storiesOf('Graph', module);
stories.addDecorator(withKnobs);
const rendererLabel = 'Renderer';
const rendererOptions = [GRAPH_RENDERER_THREE_JS, GRAPH_RENDERER_SVG];
// const defaultRenderer = GRAPH_RENDERER_THREE_JS;
const defaultRenderer = GRAPH_RENDERER_SVG;

const props = {
  isLoading,
  yAxisLabelValues,
  yAxisBGBoundaryValues,
  navigateHowToUpload,
  onZoomStart,
  onZoomEnd,
};

const selectGraphRenderer = () => {
  const graphRenderer = selectV2(
    rendererLabel,
    rendererOptions,
    defaultRenderer,
  );

  return graphRenderer;
};

stories.add('real data, mg/dL, four y-axis labels, 1.0 scale, no event', () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      {...props}
      yAxisLabelValues={makeYAxisLabelValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      eventTime={eventTime3}
      cbgData={graphData3.cbgData}
      smbgData={graphData3.smbgData}
      basalData={graphData3.basalData}
      maxBasalValue={graphData3.maxBasalValue}
      scale={1.0}
      graphRenderer={selectGraphRenderer()}
      renderNoteEvents={false}
    />
  </StoryContainerComponent>
));

stories.add('isLoading, default scale', () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph {...props} isLoading graphRenderer={selectGraphRenderer()} />
  </StoryContainerComponent>
));

stories.add('no data, three y-axis labels, default scale', () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph {...props} graphRenderer={selectGraphRenderer()} />
  </StoryContainerComponent>
));

stories.add('no data, four y-axis labels, default scale', () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      {...props}
      yAxisLabelValues={makeYAxisLabelValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      graphRenderer={selectGraphRenderer()}
    />
  </StoryContainerComponent>
));

stories.add('no data, four y-axis labels, 1.0 scale', () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      {...props}
      yAxisLabelValues={makeYAxisLabelValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      scale={1.0}
      graphRenderer={selectGraphRenderer()}
    />
  </StoryContainerComponent>
));

stories.add('no data, four y-axis labels, max scale', () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      {...props}
      yAxisLabelValues={makeYAxisLabelValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      scale={100.0}
      graphRenderer={selectGraphRenderer()}
    />
  </StoryContainerComponent>
));

stories.add('data 1, three y-axis labels, default scale', () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      {...props}
      eventTime={eventTime1}
      cbgData={graphData1.cbgData}
      smbgData={graphData1.smbgData}
      basalData={graphData1.basalData}
      maxBasalValue={graphData1.maxBasalValue}
      graphRenderer={selectGraphRenderer()}
    />
  </StoryContainerComponent>
));

stories.add('data 1, four y-axis labels, default scale', () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      {...props}
      yAxisLabelValues={makeYAxisLabelValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      eventTime={eventTime1}
      cbgData={graphData1.cbgData}
      smbgData={graphData1.smbgData}
      basalData={graphData1.basalData}
      maxBasalValue={graphData1.maxBasalValue}
      graphRenderer={selectGraphRenderer()}
    />
  </StoryContainerComponent>
));

stories.add('data 1, four y-axis labels, 1.0 scale', () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      {...props}
      yAxisLabelValues={makeYAxisLabelValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      eventTime={eventTime1}
      cbgData={graphData1.cbgData}
      smbgData={graphData1.smbgData}
      basalData={graphData1.basalData}
      maxBasalValue={graphData1.maxBasalValue}
      scale={1.0}
      graphRenderer={selectGraphRenderer()}
    />
  </StoryContainerComponent>
));

stories.add('data 1, four y-axis labels, max scale', () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      {...props}
      yAxisLabelValues={makeYAxisLabelValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      eventTime={eventTime1}
      cbgData={graphData1.cbgData}
      smbgData={graphData1.smbgData}
      basalData={graphData1.basalData}
      maxBasalValue={graphData1.maxBasalValue}
      scale={100.0}
      graphRenderer={selectGraphRenderer()}
    />
  </StoryContainerComponent>
));

stories.add('data 2, four y-axis labels, default scale', () => (
  <StoryContainerComponent behaviors={[]}>
    <Graph
      {...props}
      yAxisLabelValues={makeYAxisLabelValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
        lowBGBoundary,
        highBGBoundary,
      })}
      eventTime={eventTime2}
      cbgData={graphData2.cbgData}
      smbgData={graphData2.smbgData}
      basalData={graphData2.basalData}
      maxBasalValue={graphData2.maxBasalValue}
      graphRenderer={selectGraphRenderer()}
    />
  </StoryContainerComponent>
));

export default { makeYAxisLabelValues };
