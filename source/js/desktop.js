(() => {
    'use strict';

    // get plugin config
    const config = kintone.plugin.app.getConfig(PLUGIN_ID) || {};

    // exit if no settings selected
    if (Object.keys(config).length === 0) {
      return;
    }

    // Search fields field code
    const searchFields = config.searchFields

    
})();