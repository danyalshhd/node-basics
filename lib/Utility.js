const http = require("http");

module.exports = {
	getUrlWithTitle : (i, callback) => {
		return callback(i);
	},
	requestTitle : (address, getTitle) => {
		const regex = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;
		let queryStringUrl = address;
		let splitUrl = queryStringUrl.split("/");
		const validateQueryString = splitUrl[0].indexOf(".com") !== -1;
		if(validateQueryString){
			var urlOpts = {host: splitUrl[0], path: splitUrl[1] == undefined ? '/': `/${splitUrl[1]}/`, port: '80'};
			http.get(urlOpts, function (res) {
				res.on('data', function (chunk){
					try{
						const str = chunk.toString();
						const match = regex.exec(str);
						if (match && match[2]) {
							getTitle(((res.statusCode == 200) ? match[2] : 'Not found') + ' - ' + queryStringUrl);
						}
					}
					catch(e) {
						getTitle(e);
					}
				});
			}).on('error', (e) => {
				getTitle(`Got error:  ${e.message}`);
			});
		}
		else {
			getTitle('Invalid Query');
		}
	}
}