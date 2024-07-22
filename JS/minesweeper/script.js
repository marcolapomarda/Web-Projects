let board = [];
let rows = 16;
let cols = 16;
let minesCount = 40;
const initMinesCount = minesCount;
let minesLocation = [];
let tilesClicked = 0;
let gameOver = false;
let timerStarted = false;
let time = 0;
let timerID = 0;

const gameBtn = document.querySelector('#game-main-button');
const gameBoard = document.querySelector('#board');
const minesCountElement = document.querySelector('#mines-count');
const gameTimer = document.querySelector('#game-time');

window.onload = () => {
    startGame();
}

// visual depth effect on game button
gameBtn.addEventListener('mousedown', e => {
    if(e.target.tagName.toLowerCase() === 'img') {
        e.target.classList.add('pressed');
        e.target.parentNode.classList.add('pressed');
    } else {
        e.target.classList.add('pressed');
        e.target.children[0].classList.add('pressed');
    }
});
gameBtn.addEventListener('mouseup', e => {
    if(e.target.tagName.toLowerCase() === 'img') {
        e.target.classList.remove('pressed');
        e.target.parentNode.classList.remove('pressed');
    } else {
        e.target.classList.remove('pressed');
        e.target.children[0].classList.remove('pressed');
    }
});
// game reset
gameBtn.addEventListener('click', resetGame);

function resetGame() {
    if(timerStarted) {
        clearInterval(timerID);
        timerStarted = false;
    }
    if(gameOver) {
        gameOver = false;
    }
    gameBtn.children[0].src = 'imgs/smile.png';
    gameBtn.children[0].alt = 'smile';
    board = [];
    minesLocation = [];
    time = 0;
    timerID = 0;
    tilesClicked = 0;
    gameTimer.children[0].innerText = '000';
    minesCount = initMinesCount;
    startGame();
}

function startGame() {
    // initial update of mines counter
    updateMinesCount();
    // setting mines in the board
    setMines();
    
    gameBoard.innerHTML = '';
    // populating board dynamically
    for(let r = 0; r < rows; r++) {
        let row = [];
        for(let c = 0; c < cols; c++) {
            let tile = document.createElement('div');
            tile.id = `${r}-${c}`;
            tile.addEventListener('contextmenu', setFlag); //event targeting mouse right click
            tile.addEventListener('click', clickTile);
            row.push(tile);
            gameBoard.appendChild(tile);
        }
        board.push(row);
    }
}

// helper function to initialize mines count and to update the count every time a flag is placed in the board
function updateMinesCount() {
    if(minesCount < 0) return;

    if(minesCount <= 9) {
        minesCountElement.children[0].innerText = '00' + minesCount;
    } else if(minesCount <= 99) {
        minesCountElement.children[0].innerText = '0' + minesCount;
    } else {
        minesCountElement.children[0].innerText = minesCount;
    }
}

function setFlag(e) {
    e.preventDefault(); // prevent the context menu to appear

    if(!timerStarted) {
        timerID = startTimer();
    }

    let tile = this; // tile on which user right clicks

    if(!tile.classList.contains('flag') && !tile.classList.contains('tile-pressed')) {
        tile.classList.add('flag');
        minesCount--;
        updateMinesCount();
        if(minesCount < 0) {
            alert('Maximum number of flags set!');
            tile.classList.remove('flag');
            minesCount = 0;
            return;
        }
        flag = document.createElement('img');
        flag.src = 'imgs/flag.png';
        flag.classList.add('icon');
        flag.alt = 'flag';
        tile.appendChild(flag);
    } else if(!tile.classList.contains('tile-pressed')) {
        tile.classList.remove('flag');
        tile.removeChild(tile.children[0]);
        minesCount++;
        updateMinesCount();
    }
}

/* function to randomly generate and set the mines in the board *
 * based on board dimensions (rows and cols) and mines count    */
function setMines() {
    for(let i = 0; i < minesCount; i++) {
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * cols);
        if(!minesLocation.includes(`${row}-${col}`)) {
            minesLocation.push(`${row}-${col}`);
        } else {
            i--;
        }
    }
    //console.log(minesLocation);
}

function clickTile() {
    if(!timerStarted) {
        timerID = startTimer();
    }

    let tile = this;

    // triggering game over and mines reval only if user presses on a tile NOT having a flag placed
    if(!tile.classList.contains('flag')) {
        if(minesLocation.includes(tile.id)) {
            gameOver = true;
            gameBtn.children[0].src = 'imgs/lose-game.png';
            gameBtn.children[0].alt = 'lose-game';
            tile.classList.add('mine-exploded');
            revealMines();
            clearInterval(timerID);
            return;
        }
    }

    let coords = tile.id.split('-');
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

function checkMine(row, col) {
    if(gameOver) {
        return;
    }

    if(row < 0 || row >= rows || col < 0 || col >= cols) {
        return;
    }
    if(board[row][col].classList.contains('tile-pressed')) {
        return; // no recursion if tile has already been revealed
    } else if(!board[row][col].classList.contains('flag')) {
        board[row][col].classList.add('tile-pressed');
        tilesClicked += 1;
    }

    let minesFound = 0;

    // counting number of mines around a tile
    minesFound += checkTile(row-1, col-1);      // top left
    minesFound += checkTile(row-1, col);        // top 
    minesFound += checkTile(row-1, col+1);      // top right

    minesFound += checkTile(row, col-1);        // left
    minesFound += checkTile(row, col+1);        // right

    minesFound += checkTile(row+1, col-1);      // bottom left
    minesFound += checkTile(row+1, col);        // bottom 
    minesFound += checkTile(row+1, col+1);      // bottom right

    if(minesFound > 0 && board[row][col].innerText != minesFound) {
        board[row][col].innerText = minesFound;
        board[row][col].classList.add(`x${minesFound}`);
    } else if(!board[row][col].classList.contains('flag')) { //recursion to check all neighbouring tiles
        checkMine(row-1, col-1);      // top left
        checkMine(row-1, col);        // top 
        checkMine(row-1, col+1);      // top right

        checkMine(row, col-1);        // left
        checkMine(row, col+1);        // right

        checkMine(row+1, col-1);      // bottom left
        checkMine(row+1, col);        // bottom 
        checkMine(row+1, col+1);      // bottom right
    } else {
        return;
    }

    if(tilesClicked == rows * cols - initMinesCount) {
        gameWon();
    }
}

function checkTile(row, col) {
    if(row < 0 || row >= rows || col < 0 || col >= cols) {
        return 0;
    }
    if(minesLocation.includes(`${row}-${col}`)) {
        return 1;
    }
    return 0;
}

// revealing mines location in the board and removing event listeners from the tiles
function revealMines() {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < cols; c++) {
            let tile = board[r][c];
            if(minesLocation.includes(tile.id)) {
                tile.classList.add('tile-pressed');
                if(tile.classList.contains('flag')) {
                    tile.removeChild(tile.children[0])
                }
                bomb = document.createElement('img');
                bomb.src = 'imgs/bomb.png';
                bomb.classList.add('icon');
                bomb.alt = 'bomb';
                tile.appendChild(bomb);
            }
            tile.removeEventListener('contextmenu', setFlag);
            tile.removeEventListener('click', clickTile);
        }
    }
}

function startTimer() {
    timerStarted = true;

    const timerID = setInterval(() => {
        time++;
        if(time > 999) {
            clearInterval(timerID);
            return;
        }
        if(time <= 9) {
            gameTimer.children[0].innerText = '00' + time;
        } else if(time <= 99) {
            gameTimer.children[0].innerText = '0' + time;
        } else {
            gameTimer.children[0].innerText = time;
        }
    }, 1000);

    return timerID;
}

function gameWon() {
    gameOver = true;
    gameBtn.children[0].src = 'imgs/win-game.png';
    gameBtn.children[0].alt = 'win-game';
    clearInterval(timerID);
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < cols; c++) {
            let tile = board[r][c];
            tile.removeEventListener('contextmenu', setFlag);
            tile.removeEventListener('click', clickTile);
        }
    }
}