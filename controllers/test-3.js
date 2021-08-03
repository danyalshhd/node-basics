const RSVP = require('rsvp');
const Utility = require("../lib/Utility.js");
const View = require("../views/View.js");

exports.getTitles = (request,response) => {
	const requestUrl = request.url;
	View.writeHeader(response);

	if (requestUrl.indexOf("address=") == -1) {
		View.writeAddressInUrl(response);
		return;
	}

	if (request.query.address instanceof Array) {
		const promise = request.query.address.map(urlToShow => {
			return new RSVP.Promise((resolve, reject) => {
				Utility.requestTitle(urlToShow,(title) => {
					resolve(title);
				});
			});
    	});
		RSVP.all(promise)
			.then((responseText) => {
				View.writeTitleHeader(response);
				responseText.map(item => {
					View.writeTitle(response,item);
				});
				View.writeTitleFooter(response);
				View.writeFooter(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}
	else {
		const address = request.query.address;
		const promise = new RSVP.Promise((resolve,reject) => {
				Utility.requestTitle(address, title => {
					resolve(title);
				});
			});
		promise.then((responseText) => {
			View.writeTitleHeader(response);
			View.writeTitle(response,responseText);
			View.writeTitleFooter(response);
			View.writeFooter(response);
		}).catch((error) => {
			console.log(error);
		});
	}
};