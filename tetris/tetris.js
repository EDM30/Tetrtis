//this function under this statement is to start tetris
function startTetris() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    resetGame();
    loop();
  }
  //reset game function which shows that the gameover is set to false aswell as paused even the score is set to 0
  function resetGame() {
    gameOver = false;
    paused = false;
    score = 0;
    updateScore();
    tetrominoSequence.length = 0;
    playfield.forEach(row => row.fill(0));
    tetromino = getNextTetromino();
    holdTetromino = null;
    canHold = true;
    updateNextBox();
    updateHoldBox();
  }
  //these 3 document.getElementById are for the buttons which has an even listener for each click
  document.getElementById('restartButton').addEventListener('click', startTetris);
  
  
  document.getElementById('startButton').addEventListener('click', startTetris);
  
  
  document.getElementById('pauseButton').addEventListener('click', togglePause);
  
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    while (sequence.length) {
      const rand = getRandomInt(0, sequence.length - 1);
      const name = sequence.splice(rand, 1)[0];
      tetrominoSequence.push(name);
    }
  }
  
  function getNextTetromino() {
    if (tetrominoSequence.length === 0) {
      generateSequence();
    }
    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    const row = name === 'I' ? -1 : -2;
    updateNextBox();
    return {
      name: name,
      matrix: matrix,
      row: row,
      col: col
    };
  }
  
  function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
      row.map((val, j) => matrix[N - j][i])
    );
    return result;
  }
  
  function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] && (
            // outside the game bounds
            cellCol + col < 0 ||
            cellCol + col >= playfield[0].length ||
            cellRow + row >= playfield.length ||
            // collides with another piece
            playfield[cellRow + row][cellCol + col])
          ) {
          return false;
        }
      }
    }
    return true;
  }
  
  // place the tetromino on the playfield
  function placeTetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
          // game over if piece has any part offscreen
          if (tetromino.row + row < 0) {
            return showGameOver();
          }
          playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
        }
      }
    }
    let linesCleared = 0;
    for (let row = playfield.length - 1; row >= 0;) {
      if (playfield[row].every(cell => !!cell)) {
        linesCleared++;
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < playfield[r].length; c++) {
            playfield[r][c] = playfield[r - 1][c];
          }
        }
      } else {
        row--;
      }
    }
    if (linesCleared > 0) {
      updateScore(linesCleared);
    }
    tetromino = getNextTetromino();
    canHold = true;
  }
  
  // show the game over screen
  function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;
  
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
  
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
  }
  
  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');
  const nextCanvas = document.getElementById('nextBox');
  const nextContext = nextCanvas.getContext('2d');
  const holdCanvas = document.getElementById('holdBox');
  const holdContext = holdCanvas.getContext('2d');
  const grid = 32;
  const tetrominoSequence = [];
  const playfield = [];
  
  // populate the empty state
  for (let row = -2; row < 20; row++) {
    playfield[row] = [];
    for (let col = 0; col < 10; col++) {
      playfield[row][col] = 0;
    }
  }
  
  const tetrominos = {
    'I': [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    'J': [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    'L': [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    'O': [
      [1, 1],
      [1, 1],
    ],
    'S': [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    'Z': [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    'T': [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ]
  };
  
  const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
  };
  
  let count = 0;
  let tetromino = getNextTetromino();
  let rAF = null;
  let gameOver = false;
  let holdTetromino = null;
  let canHold = true;
  let paused = false;
  let score = 0;
  
  // game loop
  function loop() {
    if (paused) return;
    rAF = requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 10; col++) {
        if (playfield[row][col]) {
          const name = playfield[row][col];
          context.fillStyle = colors[name];
          context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
        }
      }
    }
    if (tetromino) {
      if (++count > 35) {
        tetromino.row++;
        count = 0;
        if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
          tetromino.row--;
          placeTetromino();
        }
      }
      context.fillStyle = colors[tetromino.name];
      for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
          if (tetromino.matrix[row][col]) {
            context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid - 1, grid - 1);
          }
        }
      }
    }
  }
  
  // update the next tetromino box
  function updateNextBox() {
    nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (tetrominoSequence.length === 0) return;
    const nextTetromino = tetrominos[tetrominoSequence[tetrominoSequence.length - 1]];
    const size = nextCanvas.width / nextTetromino.length;
    nextContext.fillStyle = colors[tetrominoSequence[tetrominoSequence.length - 1]];
    for (let row = 0; row < nextTetromino.length; row++) {
      for (let col = 0; col < nextTetromino[row].length; col++) {
        if (nextTetromino[row][col]) {
          nextContext.fillRect(col * size, row * size, size - 1, size - 1);
        }
      }
    }
  }
  
  // draw the hold tetromino
  function updateHoldBox() {
    holdContext.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
    if (!holdTetromino) return;
    const matrix = tetrominos[holdTetromino];
    const size = holdCanvas.width / matrix.length;
    holdContext.fillStyle = colors[holdTetromino];
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col]) {
          holdContext.fillRect(col * size, row * size, size - 1, size - 1);
        }
      }
    }
  }
  
  // hold a tetromino
  function holdTetrominoFunc() {
    if (!canHold) return;
    if (!holdTetromino) {
      holdTetromino = tetromino.name;
      tetromino = getNextTetromino();
    } else {
      const temp = tetromino.name;
      tetromino = {
        name: holdTetromino,
        matrix: tetrominos[holdTetromino],
        row: -2,
        col: playfield[0].length / 2 - Math.ceil(tetrominos[holdTetromino][0].length / 2)
      };
      holdTetromino = temp;
    }
    canHold = false;
    updateHoldBox();
  }
  
  // hard drop the tetromino
  function hardDrop() {
    while (isValidMove(tetromino.matrix, tetromino.row + 1, tetromino.col)) {
      tetromino.row++;
    }
    placeTetromino();
  }
  
  // toggle pause
  function togglePause() {
    paused = !paused;
    if (!paused) loop();
  }
  
  // update score
  function updateScore(linesCleared = 0) {
    score += linesCleared * 100;
    document.getElementById('score').textContent = `Score: ${score}`;
  }
  
  // listen to keyboard events to move the active tetromino
  document.addEventListener('keydown', function (e) {
    if (gameOver) return;
  
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const col = e.key === 'ArrowLeft' ? tetromino.col - 1 : tetromino.col + 1;
      if (isValidMove(tetromino.matrix, tetromino.row, col)) {
        tetromino.col = col;
      }
    }
  
    if (e.key === 'ArrowUp') {
      const matrix = rotate(tetromino.matrix);
      if (isValidMove(matrix, tetromino.row, tetromino.col)) {
        tetromino.matrix = matrix;
      }
    }
  
    if (e.key === 'ArrowDown') {
      const row = tetromino.row + 1;
      if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
        tetromino.row = row - 1;
        placeTetromino();
        return;
      }
      tetromino.row = row;
    }
  
    if (e.key === 'Shift') {
      holdTetrominoFunc();
    }
  
    if (e.key === ' ') {
      hardDrop();
    }
  
    if (e.key === 'p' || e.key === 'P') {
      togglePause();
    }
  });
  