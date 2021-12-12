const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const expiresIn = "7d";

module.exports = {
	sign: (payload, $Options) => {
		const signOptions = {
			issuer: $Options.issuer,
			expiresIn,
			algorithm: "HS256"
		};
		return jwt.sign(payload, secret, signOptions);
	},
	verify: (token, $Option) => {
		const verifyOptions = {
			issuer: $Option.issuer,
			expiresIn,
			algorithm: ["HS256"]
		};
		try {
			return jwt.verify(token, secret, verifyOptions);
		} catch (e) {
			return false;
		}
	},
	decode: (token, $Options) => {
		const signOptions = {
			issuer: $Options.issuer,
			expiresIn,
			algorithm: "HS256"
		};
		try {
			return jwt.decode(token, secret, signOptions);
		} catch (e) {
			return false;
		}
	},
};
