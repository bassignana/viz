import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { GLView } from 'expo';
// import { Surface } from 'gl-react-expo';
import { Surface } from 'gl-react-dom';
import { THREE } from 'expo-three';

class GraphGlView extends PureComponent {
  componentDidMount() {
    THREE.suppressExpoWarnings(true);
  }

  render() {
    const { width, height, onContextCreate, children } = this.props;
    console.log(Surface);

    return (
      <Surface
        width={width}
        height={height}
        onContextCreate={onContextCreate}
        onContextRestored={onContextCreate}
        onLoad={onContextCreate}
        children={children}
      >
      </Surface>
    );
  }
}

GraphGlView.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onContextCreate: PropTypes.func.isRequired,
  children: PropTypes.node,
};

GraphGlView.defaultProps = {
  children: [],
};

export default GraphGlView;
