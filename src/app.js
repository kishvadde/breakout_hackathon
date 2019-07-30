let PADDLE_SPEED = 20;
let PADDLE_HEIGHT = 20;
let PADDLE_WIDTH = 100;

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

const btn = document.getElementById('button');

btn.addEventListener('click', toggleFullScreen);

function getRenderingContext() {
  var canvas = document.querySelector('canvas');

  canvas.width = window.innerWidth - 18;
  canvas.height = window.innerHeight - 40;
  var gl =
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    var paragraph = document.querySelector('p');
    paragraph.innerHTML =
      'Failed to get WebGL context.' +
      'Your browser or device may not support WebGL.';
    return null;
  }
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  return gl;
}

const renderPaddle = (gl, paddleXPosition, paddleVelocity) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.SCISSOR_TEST);
  gl.scissor(paddleXPosition, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
  gl.clearColor(1, 1, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.disable(gl.SCISSOR_TEST);

  if (paddleXPosition + paddleVelocity <= 0) {
    paddleVelocity = 0;
  } else if (paddleXPosition + paddleVelocity >= gl.drawingBufferWidth - 100) {
    paddleVelocity = 0;
  }
  paddleXPosition += paddleVelocity;

  return { paddleXPosition, paddleVelocity };
};

const renderBall = (
  gl,
  ballXPosition,
  ballYPosition,
  ballXVelocity,
  ballYVelocity,
  paddleXPosition
) => {
  let score = 0;
  gl.enable(gl.SCISSOR_TEST);
  gl.scissor(ballXPosition, ballYPosition, 10, 10);
  gl.clearColor(1, 1, 1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.disable(gl.SCISSOR_TEST);

  if (
    ballXPosition + ballXVelocity <= 0 ||
    ballXPosition + ballXVelocity >= gl.drawingBufferWidth - 10
  ) {
    ballXVelocity = -ballXVelocity;
  }

  if (
    (ballXPosition + ballXVelocity >= paddleXPosition ||
      ballXPosition + ballXVelocity >= paddleXPosition + PADDLE_WIDTH) &&
    (ballYPosition + ballYVelocity >= 0 &&
      ballYPosition + ballYVelocity <= PADDLE_HEIGHT)
  ) {
    ballYVelocity = -ballYVelocity;
    score = 1;
  } else if (ballYPosition + ballYVelocity >= gl.drawingBufferHeight - 10) {
    ballYVelocity = -ballYVelocity;
  } else if (ballYPosition + ballYVelocity <= 0) {
    ballYVelocity = -ballYVelocity;
    score = -5;
  }

  ballXPosition += ballXVelocity;
  ballYPosition += ballYVelocity;

  return { ballXPosition, ballYPosition, ballXVelocity, ballYVelocity, score };
};

function checkKey(e, paddleVelocity) {
  e = e || window.event;
  if (e.keyCode == '37') {
    return -PADDLE_SPEED;
  } else if (e.keyCode == '39') {
    return PADDLE_SPEED;
  }
  return paddleVelocity;
}

const App = () => {
  let paddleXPosition,
    paddleVelocity = 0,
    ballXPosition,
    ballYPosition,
    ballXVelocity,
    ballYVelocity,
    score = 0;

  const scoreSpan = document.getElementById('score');
  const gl = getRenderingContext();
  gl.enable(gl.SCISSOR_TEST);

  paddleXPosition = gl.drawingBufferWidth / 2 - 50;

  ballXPosition = gl.drawingBufferWidth / 2 - 50;
  ballYPosition = 31;
  ballXVelocity = 5 + Math.round(10 * Math.random());
  ballYVelocity = 5 + Math.round(10 * Math.random());

  document.onkeydown = e => {
    paddleVelocity = checkKey(e, paddleVelocity);
  };
  document.onkeyup = () => {
    paddleVelocity = 0;
  };

  setInterval(() => {
    const paddleData = renderPaddle(gl, paddleXPosition, paddleVelocity);
    paddleXPosition = paddleData.paddleXPosition;
    paddleVelocity = paddleData.paddleVelocity;
    const ballData = renderBall(
      gl,
      ballXPosition,
      ballYPosition,
      ballXVelocity,
      ballYVelocity,
      paddleXPosition
    );
    ballXPosition = ballData.ballXPosition;
    ballYPosition = ballData.ballYPosition;
    ballXVelocity = ballData.ballXVelocity;
    ballYVelocity = ballData.ballYVelocity;
    score += ballData.score;
    scoreSpan.innerHTML = score;
  }, 17);
};

App();
