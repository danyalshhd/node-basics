const RSVP = require('rsvp');
const Rx = require('rxjs');
const Utility = require("../lib/Utility.js");
const View = require("../views/View.js");

exports.getTitles = (request, response) => {
	let counterForWritingEnd = 0;
	const requestUrl = request.url;
	View.writeHeader(response);
	if (requestUrl.indexOf("address=") == -1) {
		View.writeAddressInUrl(response);
		return;
	}
	View.writeTitleHeader(response);
	if(request.query && Array.isArray(request.query.address)) {
		const promises = request.query.address.map(urlToShow => {
			return new RSVP.Promise((resolve, reject) => {
				Utility.requestTitle(urlToShow, title => {
					resolve(title);
				});
			});
    	});
    	promises.map((promise) => {
			const source$ = Rx.Observable.fromPromise(promise);
			source$.subscribe(titleName => {
				View.writeTitle(response,titleName);
				counterForWritingEnd++;
				if(counterForWritingEnd == promises.length) {
					View.writeTitleFooter(response);
					View.writeFooter(response);	
				}
			});		
    	});
	}
	else {
		const address = request.query.address;
		const promise = new RSVP.Promise((resolve,reject) => {
			Utility.requestTitle(address,(title) => {
				resolve(title);
			});
		});
		const source$ = Rx.Observable.fromPromise(promise);
		source$.subscribe(titleName => {
			View.writeTitle(response,titleName);
			View.writeTitleFooter(response);
			View.writeFooter(response);
		});
	}	
};