const User = require("../../models/user");
const bcrypt = require("bcryptjs");

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
    }
};
