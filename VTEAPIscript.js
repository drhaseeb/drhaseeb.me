// Load Google Client Script
import("https://accounts.google.com/gsi/client")

// Your client ID and API key from the Google Cloud console
var CLIENT_ID = '678218067433-lt9r3i0pfdrbdh165c2d7isoial08422.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDdXpNR_fkUK2YYz4zpdcL0_thO1bGCFDU';

// The scopes you need to access the Google Sheets API
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// The ID of the spreadsheet you want to access
var SPREADSHEET_ID = '1npHjzp9Y8RxJhsb-ehdRrE9fIWLguzoH6WYaAYcThwo';

// The range of cells inside spreadsheet
var RANGE = 'A1:O';

// Initialize the Google Identity Services client
var client = google.accounts.oauth2.initTokenClient({
	client_id: CLIENT_ID,
	scope: SCOPES,
	callback: (tokenResponse) => {
		// The user is signed in
		var token = tokenResponse.access_token;
		console.log('Token: ' + token);
		// Change Get Token button
		var btnSuccess = document.getElementsByClassName(".btn-success");
		btnSuccess.innerHTML = "Signed In";

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
	},
});

// Request an access token from the user
function getToken() {
	client.requestAccessToken();
}

// Revoke the access token from the user
function revokeToken() {
	google.accounts.oauth2.revoke(token, () => {
		console.log('Token revoked');
		var btnSuccess = document.getElementsByClassName(".btn-success");
		btnSuccess.innerHTML = "Get Token";
	});
}

// Fill form
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
		event.preventDefault();
		// Update the spreadsheet with the form data
		updateSpreadsheet(data, select.value);
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
	gapi.client.setToken({access_token: token});
	gapi.client.sheets.spreadsheets.values.update({
		spreadsheetId: SPREADSHEET_ID,
		range: 'A' + (parseInt(serial) + 1) + ':N' + (parseInt(serial) + 1),
		valueInputOption: 'USER_ENTERED',
		values: [formData]
	}).then(function(response) {
		// Display a success message
		alert('Spreadsheet updated successfully!');
	}, function(error) {
		// Display an error message
		alert('Spreadsheet update failed: ' + error.message);
	});
}
