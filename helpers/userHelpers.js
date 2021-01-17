var emailCheck = require("email-check");

module.exports = {

	validate: (email) => {
		return new Promise(async (resolve, reject) => {
			let response = {};
			await emailCheck(email)
				.then((res) => {
					response.status = true;
					resolve(response);
				})
				.catch((err) => {
					response.status = true;
					response.err = err;
					resolve(response);
				});
		});
	}

};
