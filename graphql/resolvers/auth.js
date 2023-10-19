const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async (args) => {
        try {
            const user = await User.findOne({ email: args.userInput.email });
            if (user) {
                throw new Error('User exists');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const userData = new User({
                email: args.userInput.email,
                password: hashedPassword,
            });

            const result = await userData.save();
            return {...result._doc, password: null, id: result.id};
        } catch (e) {
            throw e;
        }
    },
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                throw new Error('User does not exists');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Invalid credentials');
            }
            const token = jwt.sign({userId: user.id, email: user.email}, 'somesecretkey', {
                expiresIn: '1h'
            });
            return {
                userId: user.id,
                token,
                tokenExpiration: 1
            }

        } catch (err) {
            throw err;
        }
    }
};
