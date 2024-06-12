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

    // Solving sudoku puzzle and displaying solution
    if(solveSudokuHelper(sudokuArray)) {
        
        // Duplicates found in row, column or subgrid
        for(let row = 0; row < gridSize; row++) {
            for(let col = 0; col < gridSize; col++) {
                if(sudokuArray[row][col] == 0) return;
            }
        }

        for(let row = 0; row < gridSize; row++) {
            for(let col = 0; col < gridSize; col++) {
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);

                // Filling solution with animation
                if(!cell.classList.contains("user-input") || !cell.value) {
                    /* if a user inputs a duplicate number in a row, column or subgrid it will stop the sudoku solvig execution, 
                       so the cell in which the user is deleting the duplicate needs also the class 'user-input' to be removed */
                    if(!cell.value) cell.classList.remove("user-input");
                    cell.value = sudokuArray[row][col];
                    cell.classList.add("solved");
                    await sleep(10); // Delay for visualization
                }
            }
        }
    } else {
        alert("No solution exists for the given Sudoku puzzle!");
    }

}

function solveSudokuHelper(board) {
    const gridSize = 9; 

    // Checking grid having only user-input numbers for conflicts
    for(let row = 0; row < gridSize; row++) {
        for(let col = 0; col < gridSize; col++) {
            if(document.getElementById(`cell-${row}-${col}`).classList.contains("user-input")) {
                const numInput = parseInt(document.getElementById(`cell-${row}-${col}`).value);
                const subgridArray = [];
                const rowArray = [];
                const colArray = [];

                // Creating the 3*3 subgrid to check later for user-input conflicts
                const startRow = Math.floor(row / 3) * 3;
                const startCol = Math.floor(col / 3) * 3;
                
                for(let i = 0; i < 3; i++) {
                    subgridArray[i] = [];
                    for(let j = 0; j < 3; j++) {
                        const numInput = document.getElementById(`cell-${i+startRow}-${j+startCol}`).value;
                        subgridArray[i][j] = numInput !== "" ? parseInt(numInput) : 0;
                    }
                }

                // Creating row and column arrays to check later for user-input confilcts
                for(let i = 0; i < gridSize; i++) {
                    const numInputRow = document.getElementById(`cell-${row}-${i}`).value;
                    rowArray[i] = numInputRow !== "" ? parseInt(numInputRow) : 0;

                    const numInputCol = document.getElementById(`cell-${i}-${col}`).value;
                    colArray[i] = numInputCol !== "" ? parseInt(numInputCol) : 0;
                }

                // Incrementing counters if a number is duplicated in a Row or Column
                let rowNumCount = 0;
                let colNumCount = 0;
                for(let i = 0; i < gridSize; i++) {
                    if(rowArray[i] === numInput) rowNumCount++;
                    if(colArray[i] === numInput) colNumCount++;
                }

                // Incrementing counter if a number is duplicated in a 3*3 Sub Grid
                let subGridCount = 0;
                for(let row = 0; row < 3; row++) {
                    for(let col = 0; col < 3; col++) {
                        if(subgridArray[row][col] == numInput) subGridCount++;
                    }
                }

                // Checking user-input confilcts in Row or Column
                if(rowNumCount > 1 || colNumCount > 1) {
                    alert("Duplicate number in Row or Column found!");
                    return true; // Conflict found
                }

                // Checking user-input confilcts in 3*3 SubGrid
                if(subGridCount > 1) {
                    alert("Duplicate number in 3*3 sub grid found!");
                    return true; // Conflict found
                }
            }
        }
    }

    // Populating puzzle grid
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