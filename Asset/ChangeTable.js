
var monthSelect = document.getElementById("month-select");
var yearSelect = document.getElementById("year-select");
var table = document.getElementById("task-timetable");
var sumCell = document.getElementById("sum-hours");
var info = document.getElementsByClassName("revealed-info")[0];
var csvButton = document.getElementById("csv-download");

monthSelect.addEventListener("change", selectedDate);
yearSelect.addEventListener("change", selectedDate);
csvButton.addEventListener("click", () => download_table_as_csv('task-timetable'))

function selectedDate() {
  var months = monthSelect.options;
  var year = yearSelect.value;
  var sum = 0;
  
  table.style.display = "";
  info.classList.add("hidden")

    let monthsSelected = [];
    for(let option of months) {
      if(option.selected) {
        monthsSelected.push(option.value);
      }
    }

  let isTableEmpty = true;
  var trs = table.getElementsByTagName("tr");
  for (var i = 0; i < trs.length; i++) {
    var td = trs[i].getElementsByTagName("td")[4];
    var hoursTd = trs[i].getElementsByTagName("td")[3];

    if (td) {
      txtValue =  td.innerText.trim() || td.textContent.trim();
      monthTxtValue = txtValue.substring(3, 5);
      txtValue2 =  td.innerText.trim() || td.textContent.trim();
      yearTxtValue = txtValue2.substring(6, 10);

      if( (monthsSelected.indexOf(monthTxtValue) > -1 && yearTxtValue == year) || (monthsSelected.indexOf(monthTxtValue) > -1 && year == "0000") || (monthsSelected.indexOf("00") > -1 && yearTxtValue == year) || (monthsSelected.indexOf("00") > -1 && year == "0000") ) {
        isTableEmpty = false;
        trs[i].style.display = "";
        hoursInRow = hoursTd.innerText.trim().replace(/[^0-9]/g ,'');
        sum += parseInt(hoursInRow);
        sumCell.innerHTML = sum;
      } else {
        trs[i].style.display = "none";
      }
    }       
  }

  if(isTableEmpty) {
    table.style.display = "none"
    info.classList.remove("hidden")
  }

}

// Quick and simple export target #table_id into a csv
function download_table_as_csv(table_id, separator = ';') {
  if(table.style.display != "none") {
     // Select rows from table_id
    var rows = document.querySelectorAll('table#' + table_id + ' tr');
    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
            data = data.replace(/"/g, '""');
            // Push escaped string
            row.push('"' + data + '"');
        }
        csv.push(row.join(separator));
    }
    var csv_string = csv.join('\n');
    // Download it
    var filename = 'table.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
   
}