// Your client ID and API key from the Google Cloud console
var CLIENT_ID = '678218067433-lt9r3i0pfdrbdh165c2d7isoial08422.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDdXpNR_fkUK2YYz4zpdcL0_thO1bGCFDU';

// The scopes you need to access the Google Sheets API
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// The ID of the spreadsheet you want to access
var SPREADSHEET_ID = '1npHjzp9Y8RxJhsb-ehdRrE9fIWLguzoH6WYaAYcThwo';

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

		// API calls
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
