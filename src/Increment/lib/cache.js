const cache = (function() {
  let _internalCache = {};

  return {
    get: key => _internalCache[key],
    set: (key, value) => {
      _internalCache[key] = value;
    },
    clear: () => {
      _internalCache = {};
    }
  };
})();

export default cache;
