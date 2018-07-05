import React from 'react';
import { ThemeProvider as NativeThemeProvider } from 'glamorous-native';
import { ThemeProvider } from 'glamorous';
import { Platform } from 'react-native'

function withThemeProvider(WrappedComponent, Theme) {
  console.log(Platform.OS)
  const Provider = Platform.OS === 'web' ? ThemeProvider : NativeThemeProvider;
  return props => (
    <Provider theme={Theme}>
      <WrappedComponent {...props} />
    </Provider>
  );
}

export default withThemeProvider;
