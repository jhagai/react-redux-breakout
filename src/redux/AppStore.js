import {createStore} from 'redux'

let bricks = [];

const BRICK_NB_X = 9;
const BRICK_NB_Y = 4;
const BRICK_INTERVAL = 1;
const BRICK_WIDTH = (100 - (BRICK_INTERVAL * (BRICK_NB_X + 1))) / (BRICK_NB_X);
const BRICK_HEIGHT = 3;

const BAR_WIDTH = 15;
const BAR_HEIGHT = 2;
const BAR_INITIAL_LEFT = 50 - (BAR_WIDTH / 2);
const BAR_TOP = 95;

const BALL_WIDTH = 2;
const BALL_HEIGHT = 2;
const BALL_INITIAL_LEFT = BAR_INITIAL_LEFT + (BAR_WIDTH / 2) - (BALL_WIDTH / 2);
const BALL_INITIAL_TOP = BAR_TOP - BALL_HEIGHT;

const GAME_STATUS = {STARTING: 0, PLAYING: 1};

for (let i = 0; i < BRICK_NB_X; i++) {
    for (let j = 0; j < BRICK_NB_Y; j++) {

        let color = (i === 4 && j === 3) ? 'red' : 'white';
        let brickBounds = {
            top: (BRICK_HEIGHT * j) + (BRICK_INTERVAL * (j + 1)),
            left: (BRICK_WIDTH * i) + (BRICK_INTERVAL * (i + 1)),
            width: BRICK_WIDTH,
            height: BRICK_HEIGHT
        }
        let brick = {
            previousBounds: {...brickBounds},
            currentBounds: {...brickBounds},
            active: true,
            color: color

        }
        bricks.push(brick);
    }
}


let barBounds = {
    top: BAR_TOP,
    left: BAR_INITIAL_LEFT,
    width: BAR_WIDTH,
    height: BAR_HEIGHT
};

let ballBounds = {
    top: BALL_INITIAL_TOP,
    left: BALL_INITIAL_LEFT,
    width: BALL_WIDTH,
    height: BALL_HEIGHT
}

let initialState = {
    counter: 0,
    bar: {
        previousBounds: {...barBounds},
        currentBounds: {...barBounds},
        active: true
    },
    ball: {
        previousBounds: {...ballBounds},
        currentBounds: {...ballBounds},
        active: true,
        vx: 0,
        vy: 0
    },
    bricks: bricks,
    gameStatus: GAME_STATUS.STARTING
}

let interval = 1;

function getInterval(newBallParam) {
    let ballLeftInterval = newBallParam.previousBounds.left < newBallParam.currentBounds.left ? newBallParam.previousBounds.left : newBallParam.currentBounds.left;
    let ballRightInterval = newBallParam.previousBounds.left + newBallParam.previousBounds.width > newBallParam.currentBounds.left + newBallParam.currentBounds.width ? newBallParam.previousBounds.left + newBallParam.previousBounds.width : newBallParam.currentBounds.left + newBallParam.currentBounds.width;
    let ballTopInterval = newBallParam.previousBounds.top < newBallParam.currentBounds.top ? newBallParam.previousBounds.top : newBallParam.currentBounds.top;
    let ballDownInterval = newBallParam.previousBounds.top + newBallParam.previousBounds.height > newBallParam.currentBounds.top + newBallParam.currentBounds.height ? newBallParam.previousBounds.top + newBallParam.previousBounds.height : newBallParam.currentBounds.top + newBallParam.currentBounds.height;

    return {left: ballLeftInterval, right: ballRightInterval, top: ballTopInterval, bottom: ballDownInterval};
}

function collisionTest(newBrickParam, newBallParam) {

    let collision = false;
    if (newBrickParam.active) {

        let ballVx = newBallParam.vx;
        let ballVy = newBallParam.vy;

        let brick = newBrickParam.previousBounds;
        let newBrick = newBrickParam.currentBounds;

        let ball = newBallParam.previousBounds;
        let newBall = newBallParam.currentBounds;

        let {left: ballLeft, right:ballRight, top: ballTop, bottom: ballBottom} = getInterval(newBallParam);
        let {left: brickLeft, right:brickRight, top: brickTop, bottom: brickBottom} = getInterval(newBrickParam);

        if (ballTop < brickBottom && ballBottom > brickTop) {
            if ((ball.left + ball.width) <= brick.left && (newBall.left + newBall.width) > newBrick.left) {
                newBall.left = newBrick.left - newBall.width;
                newBallParam.vx = -1 * ballVx;
                collision = true;
            } else if (ball.left >= (brick.left + brick.width) && newBall.left < (newBrick.left + newBrick.width)) {
                newBall.left = brick.left + brick.width;
                newBallParam.vx = -1 * ballVx;
                collision = true;
            }
        }

        if (ballLeft < brickRight && ballRight > brickLeft) {
            if ((ball.top + ball.height) <= brick.top && (newBall.top + newBall.height) > newBrick.top) {
                newBall.top = newBrick.top - newBall.height;
                newBallParam.vy = -1 * ballVy;
                collision = true;
            } else if (ball.top >= (brick.top + brick.height) && newBall.top < (newBrick.top + newBrick.height)) {
                newBall.top = newBrick.top + newBrick.height;
                newBallParam.vy = -1 * ballVy;
                collision = true;
            }
        }
    }
    return collision;
}
let myStore = createStore(
    (state = initialState, action) => {
        switch (action.type) {
            case 'INCREMENT':
                return {...state, counter: state.counter + 1};
            case 'COMMAND':
                return handleCommand(action.payload, state);
            case 'ITERATION':
                let newState = state;

                let keys = action.payload.keys;

                let bar = state.bar;
                let newBar = bar;
                newBar.previousBounds = {...newBar.currentBounds}

                let ball = state.ball;
                let newBall = ball;

                if (keys.left) {
                    let newLeft = state.bar.currentBounds.left - interval;
                    if (newLeft < 0) {
                        newLeft = 0;
                    }
                    newBar = {
                        ...state.bar,
                        currentBounds: {
                            ...state.bar.currentBounds,
                            top: state.bar.currentBounds.top,
                            left: newLeft
                        }
                    };
                } else if (keys.right) {
                    let newLeft = state.bar.currentBounds.left + interval;
                    if ((newLeft + BAR_WIDTH) > 100) {
                        newLeft = 100 - BAR_WIDTH;
                    }
                    newBar = {
                        ...state.bar,
                        currentBounds: {
                            ...state.bar.currentBounds,
                            top: state.bar.currentBounds.top,
                            left: newLeft
                        }
                    };
                }

                if (state.gameStatus === GAME_STATUS.STARTING) {
                    newBall = {
                        ...state.ball,
                        currentBounds: {
                            ...state.ball.currentBounds,
                            top: BALL_INITIAL_TOP,
                            left: newBar.currentBounds.left + (state.bar.currentBounds.width / 2) - (state.ball.currentBounds.width / 2)
                        }
                    };
                    newState = {...state, bar: newBar, ball: newBall};
                } else if (state.gameStatus === GAME_STATUS.PLAYING) {

                    let bricks = state.bricks;

                    ball.previousBounds = {...ball.currentBounds}

                    let ballY = ball.currentBounds.top + ball.vy;
                    let ballVy = ball.vy;


                    if (ballY < 0) {
                        ballY = 0;
                        ballVy = -1 * ballVy;
                    } else if (ballY + ball.currentBounds.height > 100) {
                        ballY = 100 - ball.currentBounds.height;
                        ballVy = -1 * ballVy;
                    }

                    let ballX = ball.currentBounds.left + ball.vx;
                    let ballVx = ball.vx;

                    if (ballX < 0) {
                        ballX = 0;
                        ballVx = -1 * ballVx;
                    } else if (ballX + ball.currentBounds.width > 100) {
                        ballX = 100 - ball.currentBounds.width;
                        ballVx = -1 * ballVx;
                    }

                    newBall = {
                        ...state.ball,
                        currentBounds: {
                            ...state.ball.currentBounds,
                            top: ballY,
                            left: ballX
                        }, vy: ballVy, vx: ballVx
                    };


                    let newBricks = [];
                    bricks.forEach(
                        (brick) => {
                            let collision = collisionTest(brick, newBall);
                            newBricks.push(collision ? {...brick, active: false} : brick);
                        }
                    );

                    let collisionBar = collisionTest(newBar, newBall);

                    if (collisionBar) {
                        let dx = (newBall.currentBounds.left + (newBall.currentBounds.width / 2)) - (newBar.currentBounds.left + (newBar.currentBounds.width / 2));
                        let ballVx = dx / 10;

                        if (ballVx > 2) {
                            ballVx = 2;
                        } else if (ballVx < -2) {
                            ballVx = -2;
                        }

                        newBall.vx = ballVx;
                    }

                    newState = {...state, bar: newBar, ball: newBall, bricks: newBricks};
                }
                return newState;
            default:
                return state;
        }
    }
    , initialState
    , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

function handleCommand(command, state) {
    let ball = state.ball;
    switch (command) {
        case 'SPACE':
            let gameStatus = state.gameStatus;
            if (gameStatus === GAME_STATUS.STARTING) {
                gameStatus = GAME_STATUS.PLAYING;
                ball = {...ball, vy: -1}
            }
            return {...state, ball: ball, gameStatus: gameStatus};
        default:
            return state;
    }
}

export default myStore;