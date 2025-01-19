(async (PLUGIN_ID) => {
  'use strict';

  // escape values
  const escapeHtml = (htmlstr) => {
    return htmlstr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '&#xA;');
  };

  const createOptions = async () => {
    let options = [];
    // get fields that are single line text and number
    const fields =
      await KintoneConfigHelper.getFields();
    fields.forEach((field) => {
      if (field.label == '' || field.label == null) return;
      const option = document.createElement('option');
      option.value = field.code;
      option.textContent = field.label;
      options = options.concat(option);
    });
    return options;
  };

  // get form information
  const searchFieldsFormData = document.getElementById('search-fields');

  // modify form to display all fields
  // create the drop-down list
  const selectBoxOptions = await createOptions();
  selectBoxOptions.forEach((originalOption) => {
    const selectBoxOption = originalOption.cloneNode(true);
    searchFieldsFormData.appendChild(selectBoxOption);
  });

  // get configuration settings
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  // set initial/previously set value
  searchFieldsFormData.value = config.searchFields || '';

  // Leave settings form hidden until values are populated
  document.getElementById('plugin-settings-form').hidden = false;

  // get app id
  const appId = kintone.app.getId();

  // save button
  const saveButton = document.getElementById('submit');
  saveButton.addEventListener('click', () => {
    const searchFields = escapeHtml(searchFieldsFormData.value);
    // required values check
    if (searchFields === '') {
      alert('Required value is missing.');
      return;
    }
    // save plugin configuration settings
    const newConfig = {searchFields};
    kintone.plugin.app.setConfig(newConfig, () => {
      // redirect to the app settings page
      window.location.href = `/k/admin/app/flow?app=${appId}`;
    });
  });

  // cancel button
  const cancelButton = document.getElementById('cancel');
  cancelButton.addEventListener('click', () => {
    // redirect to the list of plug-ins screen after clicking the cancel button
    window.location.href = `/k/admin/app/${appId}/plugin/`;
  });
})(kintone.$PLUGIN_ID);