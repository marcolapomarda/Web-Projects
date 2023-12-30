document.addEventListener('DOMContentLoaded', function() {
    const gridSize = 9;
    const solveButton = document.getElementById("solve-btn");
    solveButton.addEventListener('click', solveSudoku);

    const sudokuGrid = document.getElementById("sudoku-grid");
    // Creating sudoku grid and inserting cells
    for(let row = 0; row < gridSize; row++) {
        const newRow = document.createElement("tr");
        for(let col = 0; col < gridSize; col++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }

    const resetButton = document.getElementById("reset-btn");
    resetButton.addEventListener('click', resetGrid);
});

async function solveSudoku() {
    const gridSize = 9;
    const sudokuArray = [];

    // Filling sudokuArray with input values from the grid
    for(let row = 0; row < gridSize; row++) {
        sudokuArray[row] = [];
        for(let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cellValue = document.getElementById(cellId).value;
            sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
        }
    }

    // Identifying user-input cells and marking them
    for(let row = 0; row < gridSize; row++) {
        for(let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);

            if(sudokuArray[row][col] !== 0) {
                cell.classList.add("user-input");
            }
        }
    }

    //console.log(sudokuArray);

    // Solving sudoku puzzle and displaying solution
    if(solveSudokuHelper(sudokuArray)) {
        for(let row = 0; row < gridSize; row++) {
            for(let col = 0; col < gridSize; col++) {
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);

                // Filling solution with animation
                if(!cell.classList.contains("user-input")) {
                    cell.value = sudokuArray[row][col];
                    cell.classList.add("solved");
                    await sleep(20); // Delay for visualization
                }
            }
        }
    } else {
        alert("No solution exists for the given Sudoku puzzle!");
    }

}

function solveSudokuHelper(board) {
    const gridSize = 9; 

    for(let row = 0; row < gridSize; row++) {
        for(let col = 0; col < gridSize; col++) {
            if(board[row][col] === 0) {
                for(let num = 1; num <= 9; num++) {
                    if(isValidMove(board, row, col, num)) {
                        board[row][col] = num;

                        // Recursively attempting to solve the puzzle
                        if(solveSudokuHelper(board)) {
                            return true; // Puzzle solved
                        }

                        board[row][col] = 0; // Backtrack
                    }
                }
                return false; // No valid number found
            }
        }
    }

    return true; // All cells filled
}

function isValidMove(board, row, col, num) {
    const gridSize = 9;

    // Checking row and column for confilcts
    for(let i = 0; i < gridSize; i++) {
        if(board[row][i] === num || board[i][col] === num) {
            return false; // Conflict found
        }
    }

    // Checking the 3*3 subgrid for conflicts
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for(let i = startRow; i < startRow + 3; i++) {
        for(let j = startCol; j < startCol + 3; j++) {
            if(board[i][j] === num) {
                return false; // Conflict found
            }
        }
    }

    return true; // No conflicts found
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetGrid() {
    const gridSize = 9;
    for(let row = 0; row < gridSize; row++) {
        for(let col = 0; col < gridSize; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            cell.value = "";
            cell.classList.remove("solved");
            cell.classList.remove("user-input");
        }
    }
}