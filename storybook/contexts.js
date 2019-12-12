import React from 'react';

export class DataProvider extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    patient: React.PropTypes.object.isRequired,
  }

  static childContextTypes = {
    data: React.PropTypes.object,
    patient: React.PropTypes.object.isRequired,
  };

  getChildContext() {
    const { data, patient } = this.props;
    return { data, patient };
  }

  render() {
    const { children, ...rest } = this.props;
    return React.cloneElement(children, rest);
  }
}

export const contexts = [
  {
    icon: 'database', // a icon displayed in the Storybook toolbar to control contextual props
    title: 'Data Sources', // an unique name of a contextual environment
    components: [
      DataProvider,
      // an array of components that is going to be injected to wrap stories
      /* Styled-components ThemeProvider, */
      /* Material-ui ThemeProvider, */
    ],
    params: [
      // an array of params contains a set of predefined `props` for `components`
      { name: 'Luke', props: { data: 'luke', patient: { id: 'luke', name: 'Luke' } } },
      { name: 'James Jellyfish', props: { data: 'clint', patient: { id: 'clint', name: 'Clint' } }, default: true },
    ],
    options: {
      deep: true, // pass the `props` deeply into all wrapping components
      disable: false, // disable this contextual environment completely
      cancelable: false, // allow this contextual environment to be opt-out optionally in toolbar
    },
  },
  /* ... */ // multiple contexts setups are supported
];
