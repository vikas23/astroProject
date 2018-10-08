const Router = require('express');

const router = Router();

router.use('/', require('./robot/robot_api'));

module.exports = router;
