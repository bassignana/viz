import React from "react";
// import { ThemeProvider } from "glamorous-native";
import { ThemeProvider } from "glamorous";

function withThemeProvider(WrappedComponent, Theme) {
  return props => (
    <ThemeProvider theme={Theme}>
      <WrappedComponent {...props} />
    </ThemeProvider>
  );
}

export default withThemeProvider;
