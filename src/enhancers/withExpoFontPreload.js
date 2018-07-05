import React, { PureComponent } from "react";
import { Font } from "expo";

import { Platform } from 'react-native';

function withExpoFontPreload(WrappedComponent, fonts) {
  return class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        isLoaded: false,
      };
    }

    async componentDidMount() {
      if (process.env.NODE_ENV !== "test" && Platform.OS !== 'web') {
        await Font.loadAsync(fonts);
      }

      this.setState({
        isLoaded: true,
      });
    }

    render() {
      const { isLoaded } = this.state;

      let result = null;
      if (isLoaded) {
        result = <WrappedComponent {...this.props} />;
      }
      return result;
    }
  };
}

export default withExpoFontPreload;
