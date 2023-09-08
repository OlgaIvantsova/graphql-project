const Event = require("../../models/event");
const User = require("../../models/user");

const { user, transformEvent } = require('./merge');



module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => transformEvent(event));
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
                    date: dateToString(event._doc.date),
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
    }
};
