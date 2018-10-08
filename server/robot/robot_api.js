const Router = require('express');

const router = Router();
const RobotController = require('./robot_controller');

router.post('/setplaceanddirection', async (req, resp) => {
  try {
    const currentPos = await RobotController.setPlaceAndDirection(req.body);
    if (!currentPos) {
      return resp.status(404).send({
        errorMsg: 'Unable to set the place due to invalid input',
      });
    }
    return resp.status(200).send({
      success: true,
      currentPos,
    });
  } catch (err) {
    logger.error(`Unable to set the initial position and direction ${err.stack}`);
    return resp.status(403).send({
      error: err.message,
    });
  }
});

router.post('/moverobot', async (req, resp) => {
  try {
    const isMoved = await RobotController.moveRobot(req.body);
    if (isMoved) {
      return resp.status(200).send({
        success: true,
        msg: 'Robot moved successfully',
        currentPostion: isMoved.currentPos,
      });
    }
    return resp.status(400).send({
      errorMsg: 'Wrong commands issued. Robot not moved',
    });
  } catch (err) {
    logger.error(`Unable to move the robot ${err.stack}`);
    return resp.status(403).send({
      error: err.message,
    });
  }
});

router.post('/report', async (req, resp) => {
  try {
    const currentPos = await RobotController.getCurrentPos(req.body);
    return resp.status(200).send({
      success: true,
      currentPostion: currentPos,
    });
  } catch (err) {
    logger.error(`Unable to report the current position of bot ${err.stack}`);
    return resp.status(403).send({
      error: err.message,
    });
  }
});

router.post('/setxygraph', async (req, resp) => {
  try {
    await RobotController.setXY(req.body);
    return resp.status(200).send({
      success: true,
    });
  } catch (err) {
    logger.error(`Unable to set the X Y of the graph ${err.stack}`);
    return resp.status(403).send({
      error: err.message,
    });
  }
});

module.exports = router;
