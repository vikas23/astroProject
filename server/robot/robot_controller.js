// const config = require('../../config');
// const RobotService = require('./robot_service');

// Assuming it is a 5 X 5 matrix by default.
const GRAPH = {
  X: 5,
  Y: 5,
};
const PLACE = {};
let maxX = 5;
let maxY = 5;
const commandStack = [];

function apiCallToMoveBot() {
  return true; // For now it is true
}

function moveBot() {
  // Read from the command stack and remove the first element
  if (commandStack.length) {
    const response = apiCallToMoveBot(commandStack[0]);
    if (response) {
      logger.info('Bot is moved to position');
      logger.info(commandStack[0]);
      commandStack.shift();
      return moveBot(commandStack);
    }
    return null;
  }
  return null;
}

function getCoordinateChange() {
  let xChange = 0;
  let yChange = 0;
  let newX;
  let newY;
  switch (PLACE.direction) {
  case 'NORTH':
    yChange = 1;
    break;
  case 'SOUTH':
    yChange = -1;
    break;
  case 'EAST':
    xChange = 1;
    break;
  case 'WEST':
    xChange = -1;
    break;
  default:
    break;
  }

  // Since it is not required to maintain the initial state of PLACE hence reusing the same for further computation.
  if ((PLACE.X + xChange > -1) && (PLACE.X + xChange <= maxX)) {
    newX = PLACE.X + xChange;
  } else {
    throw new Error('X movement not possible');
  }
  if ((PLACE.Y + yChange > -1) && (PLACE.Y + yChange <= maxY)) {
    newY = PLACE.Y + yChange;
  } else {
    throw new Error('Y movement not possible');
  }

  PLACE.X = newX;
  PLACE.Y = newY;
  commandStack.push(PLACE);

  // move bot is called asynchronously which picks last commands from the command stack;
  moveBot();
}

const orientationStack = {
  NORTH: {
    LEFT: 'WEST',
    RIGHT: 'EAST',
  },
  SOUTH: {
    LEFT: 'EAST',
    RIGHT: 'WEST',
  },
  EAST: {
    LEFT: 'NORTH',
    RIGHT: 'SOUTH',
  },
  WEST: {
    LEFT: 'SOUTH',
    RIGHT: 'NORTH',
  },
};

function changeOrientation(command) {
  PLACE.direction = orientationStack[PLACE.direction][command];
  commandStack.push(PLACE);
}

const RobotController = {

  async setXY(data) {
    logger.info(`Set X and Y is called ${data}`);
    if (data) {
      GRAPH.X = data.x;
      GRAPH.Y = data.y;

      /* Since the basic assumption is (0, 0) will always be one corner and movement is only allowed within positive quadrant,
         hence the max values will be the same as the Matrix max X and max Y coordinates
      */
      maxX = data.x;
      maxY = data.y;
    }
  },

  async setPlaceAndDirection(data) {
    logger.info(`Set place and direction is called ${data}`);

    const {
      x,
      y,
      direction,
    } = data;
    // Check X coordinate limit
    if (x < 0 || x > GRAPH.X) {
      logger.error('Invalid coordinates for x');
      throw new Error('Invalid coordinates for X');
    }

    // Check Y coordinate limit
    if (y < 0 || y > GRAPH.X) {
      logger.error('Invalid coordinates for y');
      throw new Error('Invalid coordinates for Y');
    }

    // Check Valid direction
    if (!(direction === 'NORTH' || direction === 'SOUTH' || direction === 'EAST' || direction === 'WEST')) {
      logger.error('Invalid direction');
      throw new Error('Invalid direction');
    }

    // Set place values
    PLACE.X = x;
    PLACE.Y = y;
    PLACE.direction = data.direction;
    return PLACE;
  },

  async moveRobot(data) {
    logger.info(`Set or Print new position is called with ${data}`);

    // Checking condition to set place first
    if (!PLACE.direction) throw new Error('Place not set. Please provide place values first');

    if (data) {
      switch (data.command) {
      case 'MOVE':
        getCoordinateChange();
        break;
      case 'LEFT':
      case 'RIGHT':
        changeOrientation(data.command);
        break;
      default:
        break;
      }
    }
    return {
      currentPos: PLACE,
    };
  },

  async getCurrentPos(data) {
    logger.info(`Get current position is called with ${data}`);
    if (data && data.command === 'REPORT') {
      return PLACE;
    }
    throw new Error('Invalid command issued');
  },
};

module.exports = RobotController;
