const drivingEvents = require('../Database/DrivingEvents')

module.exports.addEvent = (req, res) => {
    try {
        const drivingEvent = req.body;
        drivingEvents.push(drivingEvent);
        res.status(200).json({ message: "Driving event received successfully" });
    } catch (error) {
        res.status(402).json(error);
    }
}

module.exports.getAlert = (req, res) => {
    const alertId = parseInt(req.params.alertId);
    console.log(alertId)
    for (const locationType in alerts) {
        const alert = alerts[locationType].find(alert => alert.id === alertIdToFind);

        if (alert) {
            res.status(200).json(alert);
        } else {
            res.status(404).json({ message: "Alert not found" });
        }
    }
}