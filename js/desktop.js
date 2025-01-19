(() => {
    'use strict';
  
    // field codes
    const telFieldCode = 'telephone_number';
    const mailFieldCode = 'email';
  
    // check the Telephone value
    const validateTel = (event) => {
      // set the telephone pattern, number must be 10 or 11 digits
      const telPattern = /^\d{10,11}$/;
      const record = event.record;
      record[telFieldCode].error = null;
  
      // check the input value
      const telFieldValue = record[telFieldCode].value;
      if (telFieldValue) {
        if (!(telFieldValue.match(telPattern))) {
          // error if the input value does not match the pattern
          record[telFieldCode].error = 'Telephone number must be 10 or 11 digits.';
        }
      }
    };
  
    // check the Email value
    const validateMail = (event) => {
      // set the email pattern
      const mailPattern = /^([a-zA-Z0-9])+([a-zA-Z0-9._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9._-]+)+$/;
      const record = event.record;
      record[mailFieldCode].error = null;
      // check the input value
      const mailFieldValue = record[mailFieldCode].value;
      if (mailFieldValue) {
        if (!(mailFieldValue.match(mailPattern))) {
          // error if the input value does not match the pattern
          record[mailFieldCode].error = 'Invalid email address.';
        }
      }
    };
  
    // Telephone field change event
    kintone.events.on([
      'app.record.create.change.' + telFieldCode,
      'app.record.edit.change.' + telFieldCode,
      'app.record.index.edit.change.' + telFieldCode
    ], (event) => {
      validateTel(event);
      return event;
    });
  
    // Email field change event
    kintone.events.on([
      'app.record.create.change.' + mailFieldCode,
      'app.record.edit.change.' + mailFieldCode,
      'app.record.index.edit.change.' + mailFieldCode
    ], (event) => {
      validateMail(event);
      return event;
    });
  
    // record save events
    kintone.events.on([
      'app.record.create.submit',
      'app.record.edit.submit',
      'app.record.index.edit.submit'
    ], (event) => {
      validateTel(event);
      validateMail(event);
      return event;
    });
  })();