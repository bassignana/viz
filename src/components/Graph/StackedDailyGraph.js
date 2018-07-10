/* eslint-disable
  react/forbid-prop-types,
  react/no-unused-prop-types,
  react/destructuring-assignment,
  class-methods-use-this,
  object-curly-newline,
  react/jsx-filename-extension,
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import bows from 'bows';
import { utcDay } from 'd3-time';

import StackedDailyGraphSVGContainer from './StackedDailyGraphSVGContainer';

import {
  getAllDatesInRange,
  getLocalizedOffset,
} from '../trends/common/TrendsContainer';

import {
  MGDL_UNITS,
  MMOLL_UNITS,
  trends,
} from '../../utils/constants';

import * as datetime from '../../utils/datetime';

const { extentSizes: { ONE_WEEK, TWO_WEEKS, FOUR_WEEKS } } = trends; // TODO: rename this

export class StackedDailyGraph extends PureComponent {
  static propTypes = {
    activeDays: PropTypes.shape({
      monday: PropTypes.bool.isRequired,
      tuesday: PropTypes.bool.isRequired,
      wednesday: PropTypes.bool.isRequired,
      thursday: PropTypes.bool.isRequired,
      friday: PropTypes.bool.isRequired,
      saturday: PropTypes.bool.isRequired,
      sunday: PropTypes.bool.isRequired,
    }).isRequired,
    bgPrefs: PropTypes.shape({
      bgBounds: PropTypes.shape({
        veryHighThreshold: PropTypes.number.isRequired,
        targetUpperBound: PropTypes.number.isRequired,
        targetLowerBound: PropTypes.number.isRequired,
        veryLowThreshold: PropTypes.number.isRequired,
      }).isRequired,
      bgUnits: PropTypes.oneOf([MGDL_UNITS, MMOLL_UNITS]).isRequired,
    }).isRequired,
    // currentPatientInViewId: PropTypes.string.isRequired,
    extentSize: PropTypes.oneOf([ONE_WEEK, TWO_WEEKS, FOUR_WEEKS]).isRequired,
    initialDatetimeLocation: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    timePrefs: PropTypes.shape({
      timezoneAware: PropTypes.bool.isRequired,
      timezoneName: PropTypes.oneOfType([PropTypes.string, null]),
    }).isRequired,
    // data (crossfilter dimensions)
    smbgData: PropTypes.object.isRequired,
    cbgData: PropTypes.object.isRequired,
    bolusData: PropTypes.object.isRequired,
    basalData: PropTypes.object.isRequired,
    // handlers
    onDatetimeLocationChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.log = bows('StackedDailyGraph');
    this.state = {
      dateDomain: null,
      mostRecent: null,
      previousDateDomain: null,
    };
  }

  componentWillMount() {
    this.mountData();
  }

  /*
   * NB: we don't do as much here as one might expect
   * because we're using the "expose component functions"
   * strategy of communicating between components
   * (https://facebook.github.io/react/tips/expose-component-functions.html)
   * this is the legacy of blip's interface with the d3.chart-architected
   * smbg version of trends view and thus only remains
   * as a temporary compatibility interface
   */
  componentWillReceiveProps(nextProps) {
    const { loading } = this.props;
    const newDataLoaded = loading && !nextProps.loading;

    if (newDataLoaded) {
      this.mountData(nextProps);
    }
  }

  setExtent(newDomain, oldDomain) {
    const { mostRecent } = this.state;
    this.setState({
      dateDomain: { start: newDomain[0], end: newDomain[1] },
      previousDateDomain: oldDomain
        ? { start: oldDomain[0], end: oldDomain[1] }
        : null,
    });
    this.props.onDatetimeLocationChange(newDomain, newDomain[1] >= mostRecent);
  }

  mountData(props = this.props) {
    // find initial date domain (based on initialDatetimeLocation or current time)
    const { extentSize, initialDatetimeLocation, timePrefs } = props;
    const timezone = datetime.getTimezoneFromTimePrefs(timePrefs);
    const mostRecent = datetime.getLocalizedCeiling(new Date().valueOf(), timezone);
    const end = initialDatetimeLocation
      ? datetime.getLocalizedCeiling(initialDatetimeLocation, timezone)
      : mostRecent;
    const start = utcDay.offset(end, -extentSize);
    const dateDomain = [start.toISOString(), end.toISOString()];

    const state = {
      dateDomain: { start: dateDomain[0], end: dateDomain[1] },
      mostRecent: mostRecent.toISOString(),
    };

    this.setState(state, this.determineDataToShow);
    props.onDatetimeLocationChange(dateDomain, end === mostRecent);
  }

  goBack() {
    const oldDomain = _.clone(this.state.dateDomain);
    const { dateDomain: { start: newEnd } } = this.state;
    const start = getLocalizedOffset(newEnd, {
      // negative because we are moving backward in time
      amount: -this.props.extentSize,
      units: 'days',
    }, this.props.timePrefs).toISOString();
    const newDomain = [start, newEnd];
    this.setExtent(newDomain, [oldDomain.start, oldDomain.end]);
  }

  goForward() {
    const oldDomain = _.clone(this.state.dateDomain);
    const { dateDomain: { end: newStart } } = this.state;
    const end = utcDay.offset(new Date(newStart), this.props.extentSize).toISOString();
    const newDomain = [newStart, end];
    this.setExtent(newDomain, [oldDomain.start, oldDomain.end]);
  }

  goToMostRecent() {
    const { mostRecent: end } = this.state;
    const start = utcDay.offset(new Date(end), -this.props.extentSize).toISOString();
    const newDomain = [start, end];
    this.setExtent(newDomain);
  }

  refilterByDate(dataByDate, dateDomain) {
    // eslint-disable-next-line lodash/prefer-lodash-method
    dataByDate.filter(dateDomain);
  }

  refilterByDayOfWeek(dataByDayOfWeek, activeDays) {
    dataByDayOfWeek.filterFunction(this.filterActiveDaysFn(activeDays));
  }

  initialFiltering(dataByDate, dataByDayOfWeek, dateDomain) {
    const { activeDays } = this.props;
    // clear old filters
    dataByDayOfWeek.filterAll();

    // filter by day of week (Monday, Tuesday, etc.)
    dataByDayOfWeek.filterFunction(this.filterActiveDaysFn(activeDays));

    // filter within date domain
    // eslint-disable-next-line lodash/prefer-lodash-method
    dataByDate.filter(dateDomain);
  }

  filterActiveDaysFn(activeDays) {
    return d => (activeDays[d]);
  }

  render() {
    const { start: currentStart, end: currentEnd } = this.state.dateDomain;
    const prevStart = _.get(this.state, ['previousDateDomain', 'start']);
    const prevEnd = _.get(this.state, ['previousDateDomain', 'end']);
    let start = currentStart;
    let end = currentEnd;
    if (prevStart && prevEnd) {
      if (currentStart < prevStart) {
        end = prevEnd;
      } else if (prevStart < currentStart) {
        start = prevStart;
      }
    }
    return (
      <StackedDailyGraphSVGContainer
        activeDays={this.props.activeDays}
        bgPrefs={this.props.bgPrefs}
        dataByDate={this.props.dataByDate}
        dates={getAllDatesInRange(start, end, this.props.timePrefs)}
      />
    );
  }
}

export default StackedDailyGraph;
