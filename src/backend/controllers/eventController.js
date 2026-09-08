const event = require("../models/eventSchema");
const createEvent = async (req, res)=> {
    try{
        const Event = await event.create(req.body);
        res.status(201).json({
            message:"event created successfully",
            Event
        });
    }catch(err) {
        res.status(500).json({
            message:"event creation falied",
            err
        })
    }

}
module.exports = createEvent;