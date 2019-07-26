let PADDLE_SPEED = 20;

function getRenderingContext() {
  var canvas = document.querySelector('canvas');
  canvas.width = window.innerWidth - 18;
  canvas.height = window.innerHeight - 20;
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

const render = (gl, paddleXPosition, paddleVelocity) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.SCISSOR_TEST);
  gl.scissor(paddleXPosition, 30, 100, 20);
  gl.clearColor(1, 1, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.disable(gl.SCISSOR_TEST);

  if (
    paddleXPosition + paddleVelocity <= 0 ||
    paddleXPosition + paddleVelocity >= gl.drawingBufferWidth - 100
  ) {
    paddleVelocity = 0;
  }
  paddleXPosition += paddleVelocity;

  return { paddleXPosition, paddleVelocity };
};

function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '37') {
    return -PADDLE_SPEED;
  } else if (e.keyCode == '39') {
    return PADDLE_SPEED;
  }
}

const App = () => {
  let paddleXPosition,
    paddleVelocity = 0;
  const gl = getRenderingContext();
  gl.enable(gl.SCISSOR_TEST);

  paddleXPosition = gl.drawingBufferWidth / 2 - 50;

  document.onkeydown = e => {
    paddleVelocity = checkKey(e);
  };
  document.onkeyup = () => {
    paddleVelocity = 0;
  };

  setInterval(() => {
    const newData = render(gl, paddleXPosition, paddleVelocity);
    paddleXPosition = newData.paddleXPosition;
    paddleVelocity = newData.paddleVelocity;
  }, 17);
};

App();
