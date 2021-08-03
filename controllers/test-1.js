const Utility = require("../lib/Utility.js");
const View = require("../views/View.js");

exports.getTitles = (request, response) => {
	let counterForWritingEnd = 0;
	const requestUrl = request.url;
	let arrayLength;

	if (requestUrl.indexOf("address=") == -1){
		View.writeAddressInUrl(response);
		return;
	}
	View.writeHeader(response);
	View.writeTitleHeader(response);

	if (request.query && Array.isArray(request.query.address)) {
		arrayLength = request.query.address.length;
		for(var counter = 0;counter < arrayLength; counter++) {
			const urlToShow = request.query.address[counter];
			Utility.requestTitle(urlToShow,(title) => {
				counterForWritingEnd++;
				View.writeTitle(response,title);
				if(arrayLength == counterForWritingEnd) {
					View.writeTitleFooter(response);
					View.writeFooter(response);
				}
			});
		}
	}
	else {
		const address = request.query.address;
		Utility.requestTitle(address, (title) => {
			View.writeTitle(response,title);
			View.writeTitleFooter(response);
			View.writeFooter(response);
		});
	}
};