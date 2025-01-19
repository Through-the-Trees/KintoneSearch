((PLUGIN_ID) => {
    'use strict';

    // get plugin config
    const config = kintone.plugin.app.getConfig(PLUGIN_ID) || {};

    // exit if no settings selected
    if (Object.keys(config).length === 0) {
      return;
    }

    // Search fields field code
    const searchFields = config.searchFields;
    
    // Get Kintone UI Component
    const Kuc = Kucs['1.19.0'];

    kintone.events.on('app.record.index.show', event => {
      // existing elements
      const header = kintone.app.getHeaderMenuSpaceElement();
      
      console.log(header)

      const searchInput = new Kuc.Text({
        value: '',
        placeholder: 'Search In Database',
        textAlign: 'left',
        className: 'kuc-input-text',
        id: 'search-param',
        visible: true,
        disabled: false
      });
      searchInput.style.setProperty('--kuc-text-input-height', '48px');
      searchInput.style.setProperty('margin-right', '8px');

      const sumbitSearch = new Kuc.Button({
        text: 'Submit',
        type: 'submit',
        content: `<div>
                    <span>Search</span>
                  </div>`,
        className: 'options-class',
        id: 'submit-search-button',
        visible: true,
        disabled: false
      });

      console.log(searchInput)

      header.appendChild(searchInput);
      header.appendChild(sumbitSearch);
    });

    
})(kintone.$PLUGIN_ID);