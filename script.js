const CELL_SIZE = 80;
const GRID_HEIGHT = 4;
const GRID_WIDTH = 4;

let gridSize = 3;

let gridState = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 0, 8]
];

let winState = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0]
];

isMoveAllowed = (cellPosition, emptyPosition) => {
  const [cellX, cellY] = cellPosition;
  const [emptyX, emptyY] = emptyPosition;

  return (
    (Math.abs(cellX - emptyX) === 1 && Math.abs(cellY - emptyY) === 0) ||
    (Math.abs(cellX - emptyX) === 0 && Math.abs(cellY - emptyY) === 1)
  );
};

checkForWin = _ => {
  const win = JSON.stringify(winState) === JSON.stringify(gridState);

  if (win) {
    showGameOverScreen();
  }
};

showGameOverScreen = _ => {
  const gameOverContainer = document.getElementById('gameOverContainer');
  gameOverContainer.classList.remove('hidden');
};

showNewGameScreen = _ => {
  const gameOverContainer = document.getElementById('gameOverContainer');
  gameOverContainer.classList.add('hidden');

  const newGameContainer = document.getElementById('newGameContainer');
  newGameContainer.classList.remove('hidden');
};

moveTile = event => {
  const emptyTile = document.querySelector('.empty-cell');
  const [emptyX, emptyY] = emptyTile.getAttribute('data-pos').split(',');

  const cellTile = event.target;
  const [cellX, cellY] = cellTile.getAttribute('data-pos').split(',');

  // Check if move is allowed
  if (isMoveAllowed([cellX, cellY], [emptyX, emptyY])) {
    cellTile.style.top = emptyX * CELL_SIZE + 'px';
    cellTile.style.left = emptyY * CELL_SIZE + 'px';
    cellTile.setAttribute('data-pos', `${emptyX},${emptyY}`);
    gridState[cellX][cellY] = 0;

    emptyTile.style.top = `${cellX * CELL_SIZE}px`;
    emptyTile.style.left = `${cellY * CELL_SIZE}px`;
    emptyTile.setAttribute('data-pos', `${cellX},${cellY}`);
    gridState[emptyX][emptyY] = parseInt(cellTile.textContent);

    checkForWin();
  }
};

createGameState = gridSize => {
  // Fill win state array
  winState = [];
  let k = 1;
  for (let i = 0; i < gridSize; i++) {
    winState[i] = [];
    for (let j = 0; j < gridSize; j++) {
      winState[i][j] = k;
      k++;
    }
  }
  winState[gridSize - 1][gridSize - 1] = 0;
  console.log('wins state', winState);

  // create an array
  const valueArray = [];
  for (let i = 1; i < gridSize * gridSize; i++) {
    valueArray.push(i);
  }
  valueArray.push(0);

  // create gridState array
  let tempState = [];
  for (let i = 0; i < gridSize; i++) {
    tempState[i] = [];
    for (j = 0; j < gridSize; j++) {
      const randIndex = Math.floor(Math.random() * valueArray.length);
      tempState[i][j] = valueArray[randIndex] ? valueArray[randIndex] : 0;
      valueArray.splice(randIndex, 1);
    }
  }
  gridState = [...tempState];
  console.log('game state', gridState);
};

createGrid = gridSize => {
  const gridStart = document.getElementById('gridStart');
  gridStart.style.height = gridSize * CELL_SIZE + 8 + 'px';
  gridStart.style.width = gridSize * CELL_SIZE + 8 + 'px';
  gridStart.innerHTML = '';

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement('div');

      cell.className = gridState[i][j] ? 'cell' : 'cell empty-cell';
      cell.textContent = gridState[i][j] ? gridState[i][j] : '';

      cell.style.height = CELL_SIZE - 8 + 'px';
      cell.style.width = CELL_SIZE - 8 + 'px';
      cell.style.top = `${i * CELL_SIZE}px`;
      cell.style.left = `${j * CELL_SIZE}px`;
      cell.style.position = 'absolute';

      cell.setAttribute('data-pos', `${i},${j}`);

      cell.addEventListener('click', moveTile);
      gridStart.appendChild(cell);
    }
  }
};

startNewGame = _ => {
  createGameState(gridSize);
  createGrid(gridSize);

  const newGameContainer = document.getElementById('newGameContainer');
  newGameContainer.classList.add('hidden');
};

(_ => {
  const startGameBtn = document.getElementById('startGameBtn');
  startGameBtn.addEventListener('click', startNewGame);

  const playAgainBtn = document.getElementById('playAgainBtn');
  playAgainBtn.addEventListener('click', showNewGameScreen);

  const moves = document.querySelectorAll('.move');
  moves.forEach(move => {
    move.addEventListener('click', () => {
      gridSize = move.value;

      document
        .querySelector('.move-selected')
        .classList.remove('move-selected');

      move.classList.add('move-selected');
    });
  });

  // startNewGame();
  createGrid(gridSize);
})();
