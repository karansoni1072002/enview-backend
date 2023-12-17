const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController')

router.route('/event')
    .post(mainController.addEvent)

router.route('/alert/:alertId')
    .get(mainController.getAlert)

module.exports = router;