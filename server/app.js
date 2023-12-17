const express = require("express");
const cron = require("node-cron");
const uniqueAlerts = new Map();
const drivingEvents = require('./Database/DrivingEvents')
const alerts = require('./Database/Alerts')
const locationTypeThresholds = require('./Database/LocationThresholds')
const { v4: uuidv4 } = require("uuid");
const routes = require("./routes/routes")
const app = express();

//---------------------------------------RULE ENGINE---------------------------------------
function evaluateRule() {
    for (const locationType in locationTypeThresholds) {
        // Processing location type
        const threshold = locationTypeThresholds[locationType];
        const eventsInLast5Minutes = drivingEvents.filter(
            (event) => {
                const date = new Date(event.timestamp)
                const timestamp = date.getTime();
                return event.location_type === locationType && timestamp >= (Date.now() - 5 * 60 * 1000)
            }
        );
        //Events in last 5 minutes for all location types
        const unsafeDrivingCount = eventsInLast5Minutes.filter((event) => !event.is_driving_safe).length;
        // checking unsafe driving count for location types
        if (unsafeDrivingCount >= threshold) {
            const lastAlertTime = alerts.length > 0 ? alerts[alerts.length - 1].timestamp : null;
            //Last alert time for location types
            if (!lastAlertTime || Date.now() - new Date(lastAlertTime).getTime() >= 5 * 60 * 1000) {
                // Generate alert according to uniqueness
                eventsInLast5Minutes.forEach((event) => {
                    const alertKey = `${event.location_type}_${event.vehicle_id}_${event.is_overspeeding}`;
                    // Checking alert key
                    if (uniqueAlerts.has(alertKey)) {
                        console.log(`Alert already generated for key: ${alertKey}`);
                    } else {
                        // alert generating
                        const alert = {
                            "id": uuidv4(),
                            "alert_type": "Repeated speed violations detected",
                            "vehicle_id": event.vehicle_id,
                            "location_type": event.location_type,
                            "timestamp": new Date().toISOString(),
                        }

                        alerts[event.location_type].push(alert);
                        uniqueAlerts.set(alertKey, Date.now());
                        console.log("Alert generated:", alert);
                    }
                });
            } else {
                console.log(`Not generating alert due to time constraint for ${locationType}`);
            }
        } else {
            console.log(`Unsafe driving count below threshold for ${locationType}`);
        }
    }
    console.log('Alerts: ', alerts);
}

function checkUniqueAlertTimeStamp() {
    const currentTime = Date.now();
    for (const [key, timestamp] of uniqueAlerts.entries()) {
        if (currentTime - timestamp >= 5 * 60 * 1000) {
            console.log(`Removing alert key: ${key}`);
            console.log('deleted ', key)
            uniqueAlerts.delete(key);
        }
    }
}



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes that will be called when required
app.use('/', routes);

//Cron to make call every 5 seconds
cron.schedule("*/5 * * * * *", () => {
    console.log('Evaluating Rule')
    evaluateRule();
    console.log('Unique Map: ', uniqueAlerts)
    checkUniqueAlertTimeStamp();
});

app.listen(8080, () => {
    console.log("Server is running ");
});
