const Booking = require("../../models/booking");
const Event = require("../../models/event");

const { transformBooking, transformEvent } = require('./merge');



module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map( booking => {
                return transformBooking(booking);
            });
        } catch (e) {

        }
    },
    bookEvent: async (args) => {
        try {
            const event = await Event.findOne({ _id: args.eventId });

            const booking = new Booking({
                event,
                user: '64db978cdf3f66eada19f94b'
            });

            const result = await booking.save();

            return transformBooking(booking);
        } catch (e) {

        }
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event
        } catch (err) {

        }
    }
};

