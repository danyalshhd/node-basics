const async = require("async");
const Utility = require("../lib/Utility.js");
const View = require("../views/View.js");

exports.getTitles = (request,response) => {
	const stack = [];
	const requestUrl = request.url;
	View.writeHeader(response);

	if (requestUrl.indexOf("address=") == -1) {
		View.writeAddressInUrl(response);
		return;
	}

	if (request.query && Array.isArray(request.query.address)) {
		arrayLength = request.query.address.length;
		for (let counter=0; counter < arrayLength; counter++) {
			const urlToShow = request.query.address[counter];
			Utility.getUrlWithTitle(urlToShow, (x2) => {
				const getCompleteTitle = (callback) => {
					Utility.requestTitle(x2, (title) => {
						callback(null, title);
					});
				}
				stack.push(getCompleteTitle);
			});			
		}
	}
	else {
		const address = request.query.address;
		const getCompleteTitle = (callback) => {
			Utility.requestTitle(address, (title) => {
				callback(null,title);
			});
		}
		stack.push(getCompleteTitle);
	}
	async.parallel(stack, (err, result) => {
		if (err) {
			console.log(`error ${err}`);
		}
		View.writeTitleHeader(response);
		for (let i=0; i<result.length; i++) {
			View.writeTitle(response,result[i]);
		}
		View.writeTitleFooter(response);
		View.writeFooter(response);
	});
};