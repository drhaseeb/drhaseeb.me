
document.addEventListener("DOMContentLoaded", () => {
	createCaptcha();

	const scrollSpy = new bootstrap.ScrollSpy(document.body, {
		target: '#navbar'
	})
});


var code;

//Generate Captcha
function createCaptcha() {
	//clear the contents of captcha div first 
	document.getElementById('captcha').innerHTML = "";
	var charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@?#%&";
	var lengthOtp = 6;
	var captcha = [];
	for (var i = 0; i < lengthOtp; i++) {
		//below code will not allow Repetition of Characters
		var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
		if (captcha.indexOf(charsArray[index]) == -1)
		captcha.push(charsArray[index]);
		else i--;
	}
	var canv = document.createElement("canvas");
	canv.id = "captcha";
	canv.width = 160;
	canv.height = 40;
	var ctx = canv.getContext("2d");
	ctx.font = "24px Georgia";
	ctx.beginPath();
	ctx.arc(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10) * Math.PI);
	ctx.arc(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10) * Math.PI);
	ctx.arc(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10) * Math.PI);
	ctx.stroke();
	ctx.strokeText(captcha.join(" "), 0, 30);
	//storing captcha so that can validate you can save it somewhere else according to your specific requirements
	code = captcha.join("");
	document.getElementById("captcha").appendChild(canv); // adds the canvas to the body element
}

(() => {
	'use strict'

	const form = document.getElementById('contactform')

	form.addEventListener('submit', event => {
		event.preventDefault()
		if (!form.checkValidity()) {
			event.stopPropagation()
		} else {
			formsubmit();
		}

		form.classList.add('was-validated')
		
	}, false)

})()

function formsubmit() {
	if (document.getElementById("captchaInput").value == code) {
		postToGoogle();
	} else {
		Toastify({
			text: "Invalid Captcha Response. Please try again",
			duration: 3000,
			newWindow: true,
			close: false,
			gravity: "bottom", // `top` or `bottom`
			position: "center", // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				background: "#ff0000",
			}
		}).showToast();
		createCaptcha();
	}
}
// Send to Google forms
	
function postToGoogle() {

	fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLScw9LIv5d7cVXqISOCB-_ijiFxYJbRQKiQRoeDV8cu2z1nntQ/formResponse", {
		method: "POST",
		mode: "no-cors",
		header: {
			'Content-Type': 'application/json'
		},
		body: getInputData()
	}).then(data => {
		console.log(data);
		Toastify({
			text: "Thank you for contacting me. I will respond to you via email as soon as I can.",
			duration: 4000,
			newWindow: true,
			close: false,
			gravity: "bottom", // `top` or `bottom`
			position: "center", // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				background: "#809fff",
			}
		}).showToast();
		document.getElementById("contactform").reset();
		document.getElementById("contactform").classList.remove('was-validated');
		createCaptcha();
	})
	.catch(err => {console.error(err);
		Toastify({
			text: "Something went wrong. Please try again.",
			duration: 3000,
			newWindow: true,
			close: false,
			gravity: "bottom", // `top` or `bottom`
			position: "center", // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				background: "#ff0000",
			}
		}).showToast();
	});
}

function getInputData() {
  let dataToPost = new FormData(); //formdata API

  //fill name attributes to corresponding values
  dataToPost.append("entry.519038618", document.getElementById("entry.519038618").value);
  dataToPost.append("entry.1512553889", document.getElementById("entry.1512553889").value);
  dataToPost.append("entry.353225167", document.getElementById("entry.353225167").value);
  dataToPost.append("entry.771775413", document.getElementById("entry.771775413").value);

  return dataToPost;
  
}
