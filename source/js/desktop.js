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
    
    // From Kintone documentation
    function fetchRecords(opt_last_record_id, opt_records) {
      var records = opt_records || [];
      var query = opt_last_record_id ? '$id > ' + opt_last_record_id : '';
      query += ' order by $id asc limit 500';
      var params = {
        app: kintone.app.getId(),
        query: query
      };
      return kintone.api('/k/v1/records', 'GET', params).then(function(resp) {
        records = records.concat(resp.records);
        if (resp.records.length === 500) {
          return fetchRecords(resp.records[resp.records.length - 1].$id.value, records);
        }
        return records;
      });
    }

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

    // Add search box and button to header menu
    const header = kintone.app.getHeaderMenuSpaceElement();
    header.appendChild(searchInput);
    header.appendChild(sumbitSearch);

    fetchRecords().then(value => {
        console.log(value);
    }).catch(error => {
        console.error(error);
    });

    return event;
  });

  const filteredRecords = computed(() => {
    return records.value.filter(
      (record) => 
      (record.Record_Status && record.Record_Status.value) 
          ? record.Record_Status.value.toLowerCase().indexOf(searchText.value.toLowerCase()) !== -1 
          : false
    );
  });
    
})(kintone.$PLUGIN_ID);