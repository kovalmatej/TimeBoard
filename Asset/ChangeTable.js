const monthSelect = document.getElementById("month-select");
const yearSelect = document.getElementById("year-select");
const table = document.getElementById("task-timetable");
let sumCell = document.getElementById("sum-hours");
let estimatedSumCell = document.getElementById("estiamted-sum-hours");
const info = document.getElementsByClassName("revealed-info")[0];
const csvButton = document.getElementById("csv-download");
const statusCell = document.getElementById("status-cell");

monthSelect.addEventListener("change", selectedDate);
yearSelect.addEventListener("change", selectedDate);
csvButton.addEventListener("click", () =>
	download_table_as_csv("task-timetable")
);

document
	.querySelector("#task-timetable")
	.addEventListener("click", sortTable, false);

function selectedDate() {
	const months = monthSelect.options;
	const year = yearSelect.value;
	let sum = 0.0; // Summary of hours in column
	let estimatedSum = 0.0;

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
		const estimatedHoursCell = tr.getElementsByTagName("td")[2];

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
				estimatedHoursInRow = estimatedHoursCell.innerText.split(" ")[0].trim();
				sum += parseFloat(hoursInRow);
				estimatedSum += parseFloat(estimatedHoursInRow);
			} else {
				tr.style.display = "none"; // Hide the row
			}
		}
	}

	if (isTableEmpty) {
		table.style.display = "none"; // Hide table
		info.classList.remove("hidden"); // Display message
	}

	sumCell = document.getElementById("sum-hours"); // Must select again, otherwise the sum won't update
	estimatedSumCell = document.getElementById("estimated-sum-hours");
	sumCell.innerHTML = sum; // Display the sum of hours
	estimatedSumCell.innerHTML = estimatedSum;
}

// Quick and simple export target #table_id into a csv
function download_table_as_csv(table_id, separator = ";") {
	if (table.style.display != "none") {
		const rows = document.querySelectorAll("table#" + table_id + " tr"); // Select rows from table_id
		let csv = []; // Construct csv
		rows.forEach((currentRow) => {
			if (currentRow.style.display != "none") {
				const row = [];
				const cols = currentRow.querySelectorAll("td, th");

				cols.forEach((col) => {
					// Clean innertext to remove multiple spaces and jumpline (break csv)
					let data = col.innerText;
					data = data.replace("▲", "").trim();
					// Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
					data = data.replace(/"/g, '""');
					// Push escaped string
					row.push('"' + data + '"');
				});

				csv.push(row.join(separator));
			}
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

function getValue(tr, n) {
	// Give some weight depending on type of data
	const s = tr.cells[n].innerText; // get the data to display weight
	if (s.includes("hours")) {
		// For columns with hours
		return parseFloat(s.split(" ")[0]);
	}
	if (n == 5) {
		// For status column
		if (s == "Done") {
			return 9;
		}
		if (s == "Work in progress") {
			return 8;
		}
		if (s == "Ready") {
			return 7;
		} else {
			return 6;
		}
	}

	const month = s.substring(3, 6); // We need mm-dd-YYYY format to use Date.parse
	let changedDate = month + s.substring(0, 2) + s.substring(5);

	const time = Date.parse(changedDate); // get the epoch time
	return isNaN(time) ? s.toLowerCase() : time; // return epoch time or string
}

function sortTable(e) {
	let th = e.target;

	if (e.target.classList[0] == "arrow") {
		// Handle click on arrow
		th = e.target.parentNode;
	}

	if (th.nodeName.toLowerCase() !== "th") return true;

	let n = 0;
	while (th.parentNode.cells[n] != th) ++n; // Which column was selected?

	let order = th.order || -1; // Determine orded in which to display data
	th.order = -order;

	let arrow = th.getElementsByClassName("arrow")[0];
	if (th.order == 1) {
		arrow.classList.add("arrow-down");
	} else {
		arrow.classList.remove("arrow-down");
	}

	let t = table.querySelector("tbody");

	let lastRow = t.rows[t.rows.length - 1]; // Get the summary row
	t.innerHTML = Object.keys(t.rows)
		.filter((k) => !isNaN(k))
		.filter((k) => k != t.rows.length - 1) // remove summary row
		.map((k) => t.rows[k])
		.sort((a, b) => order * (getValue(a, n) > getValue(b, n) ? 1 : -1)) // sort based on which column we clicked
		.map((r) => {
			return r.outerHTML;
		})
		.join("");
	t.innerHTML += lastRow.outerHTML; //add summary row after sorting
}
