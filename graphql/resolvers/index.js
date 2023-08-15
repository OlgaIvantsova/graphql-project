const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const user = async (userId) => {
    try {
        const user = await User.findById(userId);
        return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) };
    } catch (e) {
        throw e;
    }
};

const events = async eventIds => {
    try {
        const events = await Event.find({_id: { $in: eventIds }});

        return events.map((event => {
            return {
                ...event._doc,
                id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        }));
    } catch (e) {
        throw e;
    }
};

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event._doc._id.toString(),
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        } catch (e) {
            throw e;
        }
    },
    createEvent: async (args) => {
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '64db978cdf3f66eada19f94b'
            });

            let createdEvent;
            const result = await event.save();

            if (result) {
                createdEvent = {
                    ...result._doc,
                    _id: event._doc._id.toString(),
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, result._doc.creator)
                };
            }
            const creator = await User.findById(result._doc.creator._id.toString());

            if (!creator) {
                throw new Error('User not found');
            }
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (e) {
            throw e;
        }
    },
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