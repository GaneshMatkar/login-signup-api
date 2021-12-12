const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALT_ROUNDS || 10);

module.exports = {
	encrypt: async(password) => {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (error) {
            return error
        }
	},
	verify: async(password, hashedPassword) => {
        try {
            const result = await bcrypt.compare(password, hashedPassword);
            return result
        } catch (error) {
            return error
        }
	},
};
