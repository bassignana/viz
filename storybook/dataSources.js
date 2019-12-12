/* eslint-disable global-require, import/no-unresolved, import/no-mutable-exports */
let dataSources;

try {
  dataSources = {
    clint: require('../local/blip-input.json'),
    luke: require('../local/blip-input.luke.json'),
  };
} catch (e) {
  dataSources = {
    clint: [],
    luke: [],
  };
}

export default dataSources;
