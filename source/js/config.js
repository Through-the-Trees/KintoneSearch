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

  // get form information
  const searchFieldsFormData = document.getElementById('search-fields');

  // get configuration settings
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  // set initial value
  searchFieldsFormData.value = config.searchFields || '';

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