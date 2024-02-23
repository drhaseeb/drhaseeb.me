var API_KEY = 'AIzaSyDdXpNR_fkUK2YYz4zpdcL0_thO1bGCFDU'; // Replace with your API key
var SPREADSHEET_ID = '1npHjzp9Y8RxJhsb-ehdRrE9fIWLguzoH6WYaAYcThwo'; // Replace with your spreadsheet ID
var RANGE = 'A1:O'; // Replace with your range of data

function initClient() {
	gapi.client.init({
		apiKey: API_KEY,
		discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
	}).then(function () {
		// Get the data from the spreadsheet
		gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: SPREADSHEET_ID,
			range: RANGE,
		}).then(function(response) {
			// Fill the bootstrap form with the data
			fillForm(response.result.values);
		}, function(error) {
			// Handle the error
			console.error(error);
		});
	});
}

// Load the API client on page load
gapi.load('client', initClient);

function fillForm(data) {
	// Get the form element
	var form = document.querySelector('form');
	// Get the serial selector element
	var select = document.getElementById('serial');
	// Clear the previous options
	select.innerHTML = '';
	// Create an option for each serial number
	for (var i = 1; i < data.length; i++) {
		var option = document.createElement('option');
		option.value = i;
		option.innerText = data[i][0];
		select.appendChild(option);
	}
	// Add a change event listener to the serial selector
	select.addEventListener('change', function() {
		// Fill the input fields with the selected row data
		fillRow(data, select.value);
	});
	// Fill the input fields with the first row data by default
	fillRow(data, 1);
	// Add a click event listener to the submit button
	var submit = document.getElementById('submit');
	submit.addEventListener('click', function(event) {
		// Prevent the default form submission
		//event.preventDefault();
		// Update the spreadsheet with the form data
		//updateSpreadsheet(data, select.value);
	});
}

// Fill the input fields with the row data
function fillRow(data, serial) {
	// Loop through each column of data
	for (var i = 0; i < data[0].length; i++) {
		// Get the input element with the matching name
		var input = document.getElementById(data[0][i]);
		// Set the input value to the row data
		input.value = data[serial][i];
	}
}

// Update the spreadsheet with the form data
function updateSpreadsheet(data, serial) {
	// Get the form element
	var form = document.querySelector('form');
	// Get the form data as an array
	var formData = [];
	for (var i = 0; i < data[0].length; i++) {
		formData.push(form.elements[data[0][i]].value);
	}
	// Update the spreadsheet with the form data
	fetch("https://script.google.com/macros/s/AKfycbykmUa5hrlE0Qmy52WB_bTQ-A5Qwsb5h9vTFB3fGGtV5ME-YYEJEg2ZVw83_Vm-DZBp/exec", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: JSON.stringify(formData)
	}).then(function(response) {
		('Spreadsheet updated successfully!');
	}, function(error) {
		// Display an error message
		alert('Spreadsheet update failed: ' + error.message);
	});
}
