import _ from 'lodash';
import i18next from 'i18next';
const t = i18next.t.bind(i18next);

import { DPI } from './constants';

if (_.get(i18next, 'options.returnEmptyString') === undefined) {
  // Return key if no translation is present
  i18next.init({ returnEmptyString: false, nsSeparator: '|' });
}

export const AGP_BG_CLAMP_MGDL = 350;
export const AGP_BG_CLAMP_MMOLL = 19.4;
export const AGP_FOOTER_Y_PADDING = DPI * 0.25;
export const AGP_TIR_MIN_HEIGHT = 5;
export const AGP_SECTION_BORDER_RADIUS = 8;
export const AGP_SECTION_HEADER_HEIGHT = DPI * 0.25;
export const AGP_LOWER_QUANTILE = 0.05;
export const AGP_UPPER_QUANTILE = 0.95;

// Preferring Helvetica instead of Arial since we don't have license and PDFkit doesn't include it
export const AGP_FONT_FAMILY = 'Helvetica, Arial, Sans-Serif';

export const text = {
  reportHeader: t('AGP Report:'),
  reportSubHeader: t('Continuous glucose monitoring'),
  reportFooter: t('Patent pending \u2013 HealthPartners Institute dba International Diabetes Center \u2013 All Rights Reserved. \u00A92022'),
  timeInRanges: {
    title: t('Time in Ranges'),
    subtitle: t('Goals for Type 1 and Type 2 Diabetes'),
  },
  reportInfo: {
    dob: t('DOB:'),
  },
  glucoseMetrics: {
    title: t('Glucose metrics'),
    averageGlucose: {
      label: t('Average Glucose'),
      goal: {
        mgdl: t('Goal: <154 mg/dL'),
        mmoll: t('Goal: <8.6 mmol/L'),
      },
    },
    glucoseManagementIndicator: {
      label: t('Glucose Management Indicator (GMI)'),
      goal: t('Goal: <7%'),
    },
    coefficientOfVariation: {
      label: t('Glucose Variability'),
      subLabel: t('Defined as percent coefficient of variation'),
      goal: t('Goal: <=36%'), // \u2264 unicode symbol not available in Helvetica, and we don't own license for Arial
    },
  },
  ambulatoryGlucoseProfile: {
    title: t('Ambulatory Glucose Profile (AGP)'),
    description: t('AGP is a summary of glucose values from the report period, with median (50%) and other percentiles shown as if they occurred in a single day.'),
    targetRange: t('Target<br>Range'),
  },
  dailyGlucoseProfiles: {
    title: t('Daily Glucose Profiles'),
    description: t('Each daily profile represents a midnight-to-midnight period.'),
  },
  bgRanges: {
    veryHigh: t('Very High'),
    high: t('High'),
    target: t('Target'),
    low: t('Low'),
    veryLow: t('Very Low'),
  },
  goals: {
    veryHigh: t('Goal: <5%'),
    highCombined: t('Goal: <25%'),
    target: t('Goal: >70%'),
    lowCombined: t('Goal: <4%'),
    veryLow: t('Goal: <1%'),
  },
  subLabels: {
    TIRtarget: t('Each 5% increase is clinically beneficial'),
    TIRminutes: t('Each 1% time in range = about 15 minutes'),
  },
};

export const fontSizes = {
  reportHeader: 14,
  reportSubHeader: 14,
  reportFooter: 7,
  reportInfo: {
    default: 10,
    label: 8,
  },
  section: {
    title: 9,
    subtitle: 8,
    description: 7,
  },
  timeInRanges: {
    values: 9,
    ticks: 7,
    summaries: 12,
    goals: 7,
    subLabels: 7,
  },
  glucoseMetrics: {
    values: 12,
    bgUnits: 8,
    labels: 9,
    subLabels: 8,
    goals: 8,
  },
  ambulatoryGlucoseProfile: {
    hourlyTicks: 7,
    bgTicks: 9,
    percentileTicks: 8,
    bgUnits: 7,
    targetRange: 9,
  },
};

const black = '#000000';
const white = '#FFFFFF';
const lightGrey = '#D9D9D9';
const mediumGrey = '#7A7A7A';
const darkGrey = '#626267';

export const colors = {
  text: {
    reportHeader: '#522398',
    label: darkGrey,
    reportFooter: black,
    section: {
      title: black,
      subtitle: darkGrey,
      description: black,
    },
    reportInfo: black,
    goals: {
      veryHigh: darkGrey,
      highCombined: mediumGrey,
      target: mediumGrey,
      lowCombined: mediumGrey,
      veryLow: darkGrey,
      glucoseMetrics: darkGrey,
    },
    subLabels: {
      TIRtarget: darkGrey,
      TIRminutes: black,
      glucoseMetrics: darkGrey,
    },
    ticks: {
      bg: darkGrey,
      hour: darkGrey,
      percentile: darkGrey,
    },
  },
  line: {
    default: darkGrey,
    ticks: lightGrey,
    range: {
      target: '#00AA51',
      default: lightGrey,
      divider: white,
    },
  },
  white,
  black,
  lightGrey,
  mediumGrey,
  darkGrey,
  background: {
    shaded: lightGrey,
  },
  bgRange: {
    veryLow: '#CC0019',
    low: '#FF0000',
    lowShaded: '#FF8080',
    target: '#0BAD5A',
    high: '#FFBF00',
    highShaded: '#FFD180',
    veryHigh: '#FF6900',
    empty: darkGrey,
  },
  ambulatoryGlucoseProfile: {
    median: {
      veryLow: '#A30014',
      low: '#FF0000',
      target: '#00AA51',
      high: '#FFA600',
      veryHigh: '#FF7538',
    },
    interQuartile: {
      veryLow: '#A30014',
      low: '#FF0000',
      target: '#8BCD9E',
      high: '#FFC966',
      veryHigh: '#FFB380',
    },
    outerQuantile: {
      veryLow: '#A30014',
      low: '#FF8080',
      target: '#BEE1C6',
      high: '#FFE6B3',
      veryHigh: '#FFD9BF',
    },
  },
};
