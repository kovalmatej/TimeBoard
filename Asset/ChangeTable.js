const monthSelect = document.getElementById("month-select");
const yearSelect = document.getElementById("year-select");
const table = document.getElementById("task-timetable");
const sumCell = document.getElementById("sum-hours");
const info = document.getElementsByClassName("revealed-info")[0];
const csvButton = document.getElementById("csv-download");

monthSelect.addEventListener("change", selectedDate);
yearSelect.addEventListener("change", selectedDate);
csvButton.addEventListener("click", () =>
	download_table_as_csv("task-timetable")
);

function selectedDate() {
	const months = monthSelect.options;
	const year = yearSelect.value;
	let sum = 0.0; // Summary of hours in column

	table.style.display = ""; // Display table
	info.classList.add("hidden"); // Hide info message

	let monthsSelected = []; // Push selected months into array
	for (const option of months) {
		option.selected ? monthsSelected.push(option.value) : "";
	}

	let isTableEmpty = true; // Variable to determine whether hide/show table
	const trs = table.getElementsByTagName("tr"); // All rows in table

	for (let tr of trs) {
		const dateCell = tr.getElementsByTagName("td")[4];
		const hoursCell = tr.getElementsByTagName("td")[3];

		if (dateCell) {
			dateCellTxt = dateCell.innerText.trim() || td.textContent.trim(); // Get text in date cell
			monthTxtValue = dateCellTxt.substring(3, 5); // Get only the month value in date
			yearTxtValue = dateCellTxt.substring(6, 10); // Get only the year in date

			// Hides row where month/year of task isn't in selected
			// If no month/year is selected it acts as all ale selected
			if (
				(monthsSelected.includes(monthTxtValue) && yearTxtValue == year) ||
				(monthsSelected.includes(monthTxtValue) && year == "0000") ||
				(monthsSelected.includes("00") && yearTxtValue == year) ||
				(monthsSelected.includes("00") && year == "0000")
			) {
				isTableEmpty = false;
				tr.style.display = ""; // Display the row
				hoursInRow = hoursCell.innerText.split(" ")[0].trim(); // Get the number of hours from the cell
				sum += parseFloat(hoursInRow);
				sumCell.innerHTML = sum; // Display the sum of hours
			} else {
				tr.style.display = "none"; // Hide the row
			}
		}
	}

	if (isTableEmpty) {
		table.style.display = "none"; // Hide table
		info.classList.remove("hidden"); // Display message
	}
}

// Quick and simple export target #table_id into a csv
function download_table_as_csv(table_id, separator = ";") {
	if (table.style.display != "none") {
		const rows = document.querySelectorAll("table#" + table_id + " tr"); // Select rows from table_id

		let csv = []; // Construct csv
		rows.forEach((currentRow) => {
			const row = [];
			const cols = currentRow.querySelectorAll("td, th");

			cols.forEach((col) => {
				// Clean innertext to remove multiple spaces and jumpline (break csv)
				let data = col.innerText
					.replace(/(\r\n|\n|\r)/gm, "")
					.replace(/(\s\s)/gm, " ");
				// Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
				data = data.replace(/"/g, '""');
				// Push escaped string
				row.push('"' + data + '"');
			});

			csv.push(row.join(separator));
		});

		const csv_string = csv.join("\n");
		// Download it
		const filename = "table.csv";
		let link = document.createElement("a");
		link.style.display = "none";
		link.setAttribute("target", "_blank");
		link.setAttribute(
			"href",
			"data:text/csv;charset=utf-8," + encodeURIComponent(csv_string)
		);
		link.setAttribute("download", filename);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}
