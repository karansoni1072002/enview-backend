# Enview Backend Assignment

I have used the MVC system of files but as there were no models required so you will not find any folder with that name.
---

### You can find the two API routes in the **routes file** inside **routes folder**.
..* The **GET** route will give you the details of the alert according to the alert id.
..* The **POST** route will add the body data to the **Driving Events Database**

### For database I have used Mock Database:
..* **DrivingEvents**: It stores the events and scans them to generate alerts.
..* **Alerts**: It is an object which contains arrays for each `location_type` keys.
..* **ThresholdTypeValues**: It stores the threshold values that are used in Rule Engine.

### Rule Engine:
..* **Evaluate Rule**: This function evaluates the Driving Events based on the rules specified.
..* **CheckUniqueAlertTimeStamp**: This function keeps track of the unique keys generated to save the alert for 5 minutes and them remove it.
..* **Cron**: I have used this library to keep track of time and make calls in the real time. It will make call every 5 seconds to rune the rule engine.

### Controller:
..* You can find both the functions in the mainController file in the controller folder.

##### I have used the MVC file structure to keep the code as clean as possible and to keep it easy to track errors.
