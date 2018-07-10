/* eslint-disable
  react/forbid-prop-types,
  react/no-unused-prop-types,
  react/destructuring-assignment,
  class-methods-use-this,
  object-curly-newline,
  react/jsx-filename-extension,
 */
import PropTypes from 'prop-types';

import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import _ from 'lodash';

import Graph from './Graph';
import {
  makeYAxisLabelValues,
  makeYAxisBGBoundaryValues,
  DEFAULT_LOW_BG_BOUNDARY_VALUE,
  DEFAULT_HIGH_BG_BOUNDARY_VALUE,
} from './helpers';

import Urls from '../../constants/Urls';
import GraphData from '../../models/GraphData';

import { MGDL_UNITS, MMOLL_UNITS } from '../../utils/constants';

export class TrendsSVGContainer extends PureComponent {
  renderGraph = (date) => {
    const { dataByDate, theme, bgPrefs: { bgBounds }, graphRenderer } = this.props;
    const data = _.map(_.flatten(_.valuesIn(_.pick(dataByDate[date].data, [
      'basal',
      'bolus',
      'cbg',
      'smbg',
    ]))), (d) => {
      d.deliveryType = d.subType;
      d.time = d.normalTime;
      return d;
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

    const graphProps = {
      isLoading,
      yAxisLabelValues,
      yAxisBGBoundaryValues,
      navigateHowToUpload,
      onZoomStart,
      onZoomEnd,
      theme,
    };

    const highBGBoundary = bgBounds.targetUpperBound;
    const lowBGBoundary = bgBounds.targetLowerBound;

    const eventTime = new Date(`${date}T16:00:00.000Z`);
    const eventTimeSeconds = eventTime.getTime() / 1000;
    const graphData = new GraphData();
    graphData.addResponseData(data);
    graphData.process({
      eventTimeSeconds,
      timeIntervalSeconds: 60 * 60 * 12,
      lowBGBoundary,
      highBGBoundary,
    });

    return (
      <div key={date}>
        <h2>
          {date}
        </h2>

        <Graph
          {...graphProps}
          yAxisLabelValues={makeYAxisLabelValues({
            lowBGBoundary,
            highBGBoundary,
          })}
          yAxisBGBoundaryValues={makeYAxisBGBoundaryValues({
            lowBGBoundary,
            highBGBoundary,
          })}
          eventTime={eventTime}
          cbgData={graphData.cbgData}
          smbgData={graphData.smbgData}
          basalData={graphData.basalData}
          maxBasalValue={graphData.maxBasalValue}
          scale={1.0}
          graphRenderer={graphRenderer}
          renderNoteEvents={false}
        />
      </div>
    );
  };

  render() {
    const { dates } = this.props;
    return (
      <div>
        {_.map(dates, this.renderGraph)}
      </div>
    );
  }
}

TrendsSVGContainer.propTypes = {
  bgPrefs: PropTypes.shape({
    bgBounds: PropTypes.shape({
      veryHighThreshold: PropTypes.number.isRequired,
      targetUpperBound: PropTypes.number.isRequired,
      targetLowerBound: PropTypes.number.isRequired,
      veryLowThreshold: PropTypes.number.isRequired,
    }).isRequired,
    bgUnits: PropTypes.oneOf([MGDL_UNITS, MMOLL_UNITS]).isRequired,
  }).isRequired,
  dataByDate: PropTypes.object.isRequired,
  dates: PropTypes.arrayOf(PropTypes.string).isRequired,
  graphRenderer: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

export default TrendsSVGContainer;
