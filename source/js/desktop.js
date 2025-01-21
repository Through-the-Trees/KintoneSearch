((PLUGIN_ID) => {
  'use strict';

  // get plugin config
  const config = kintone.plugin.app.getConfig(PLUGIN_ID) || {}

  // exit if no settings selected
  if (Object.keys(config).length === 0) {return}

  // Search fields field code
  const searchFields = config.searchFields
  
  // Get Kintone UI Component
  const Kuc = Kucs['1.19.0']
 
  // From Kintone documentation
  function fetchRecords(opt_last_record_id, opt_records) {
    var records = opt_records || []
    var query = opt_last_record_id ? '$id > ' + opt_last_record_id : ''
    query += ' order by $id asc limit 500'
    var params = {
      app: kintone.app.getId(),
      query: query
    }
    return kintone.api('/k/v1/records', 'GET', params).then(function(resp) {
      records = records.concat(resp.records)
      if (resp.records.length === 500) {
        return fetchRecords(resp.records[resp.records.length - 1].$id.value, records)
      }
      return records
    })
  }

  function populateRecords(records) {
    
    const recordList = document.getElementById("view-list-data-gaia")
    const recordTable = recordList.children[0]

    
    var rowCount = recordTable.rows.length
    var colCount = recordTable.rows[0].cells.length

    for (var r = 0; r < rowCount; r++) {
  
      for (var c = 0; c < colCount; c++) {
        const cell = recordTable.rows[r].cells[c]

        if (r == 1) {
          console.log(recordTable.rows[r].innerHTML)
          console.log("-----------------")
          console.log(cell.innerHTML)
        }
        cell.children[0].id = "broken"
        cell.children[0].innerHTML = ""

        // if (cell.children.length) {
        //   console.log(cell.children[0].children[0].value)
        //   cell.children[0].children[0].value = "Replaced Value"
        // } else {
        //   cell.innerHTML = ""
        // }
    
      }
    }

    // const newRow = recordTable.insertRow(1)
    // const cell1 = newRow.insertCell(0)
    // const cell2 = newRow.insertCell(1)
    // cell1.textContent = "New Value 1"
    // cell2.textContent = "New Value 2"
    // recordTable.deleteRow(recordTable.rows[1].rowIndex)

  }

  function searchInApp(searchText) {
    
    searchText = "Ordered"

    console.log("Searching in app...")

    fetchRecords().then(records => {
      const filteredRecords = records.filter(
        (record) => 
          (record.Record_Status && record.Record_Status.value) 
          ? record.Record_Status.value.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 
          : false
      )
      // populateRecords(filteredRecords)
      return filteredRecords
    }).catch(error => {
      console.error(error)
    })
  }

  // const searchInput = new Kuc.Text({
  //   value: '',
  //   placeholder: 'Search In Database',
  //   textAlign: 'left',
  //   className: 'kuc-input-text',
  //   id: 'search-param',
  //   visible: true,
  //   disabled: false
  // })
  // searchInput.style.setProperty('--kuc-text-input-height', '48px')
  // searchInput.style.setProperty('margin-right', '8px')

  // const sumbitSearch = new Kuc.Button({
  //   text: 'Submit',
  //   type: 'submit',
  //   content: `<div>
  //               <span>Search</span>
  //             </div>`,
  //   className: 'options-class',
  //   id: 'submit-search-button',
  //   visible: true,
  //   disabled: false
  // })

  // sumbitSearch.onclick = searchInApp

  // // Add search box and button to header menu
  // const header = kintone.app.getHeaderMenuSpaceElement()
  // header.appendChild(searchInput)
  // header.appendChild(sumbitSearch)

  kintone.events.on('app.record.index.show', async (event) => {

    const searchText = "Ordered"
    const records = await fetchRecords()

    console.log("All Records:")
    console.log(records)

    const filteredRecords = records.filter(
      (record) => 
        (record.Record_Status && record.Record_Status.value) 
        ? record.Record_Status.value.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 
        : false
    )
    console.log("Filtered records:")
    console.log(filteredRecords)

    console.log("Event records (records in page):")
    console.log(event.records)

    
    
    // for ( const field of Object.keys(event.records[0]) )
    // {
    //   var elements = kintone.app.getFieldElements(field)
    //   if (elements)
    //   {
    //     console.log('=============\nField Name:')
    //     console.log(field)
    //     console.log(elements)
    //     if (field == "Record_Number") {
    //       console.log(elements[0].parentElement)
    //     }
    //     for (var idx = 0; idx < elements.length; idx++) {
    //         if (idx < filteredRecords.length)
    //         {
    //           elements[idx].innerText = filteredRecords[idx][field].value
    //           elements[idx].style.verticalAlign = 'middle' // Align to center
    //         }
    //         else {
    //           elements[idx].innerText = ""
    //         }
    //     }
    //   }
    // }

    event.records

    return event
  })
})(kintone.$PLUGIN_ID);