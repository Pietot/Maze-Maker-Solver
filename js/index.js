// Function to generate the grid of the maze (rows and columns, colors, svg)
function generateGrid(rows, cols) {
  const mazeContainer = document.getElementById("maze-container");
  const maze = document.getElementById("maze");

  const autoSquareSize = 30;
  const offset = 30;

  const autoRows = Math.floor(
    (mazeContainer.offsetHeight - offset) / autoSquareSize
  );
  const autoCols = Math.floor(
    (mazeContainer.offsetWidth - offset) / autoSquareSize
  );

  let nbRows = rows || autoRows;
  let nbCols = cols || autoCols;

  // Clear the maze to not add more rows and columns from the previous grid
  maze.innerHTML = "";

  // Make sure the maze has an odd number of rows and columns (must have for the maze generation algorithm)
  if (nbRows % 2 === 0) nbRows -= 1;
  if (nbCols % 2 === 0) nbCols -= 1;

  if (nbRows <= 2) nbRows = 3;
  if (nbCols <= 2) nbCols = 3;

  // Calculate the size of each square
  const squareSize = Math.min(
    Math.floor((mazeContainer.offsetWidth - offset) / nbCols),
    Math.floor((mazeContainer.offsetHeight - offset) / nbRows)
  );

  maze.style.width = `${squareSize * nbCols}px`;
  maze.style.height = `${squareSize * nbRows}px`;

  // Create the grid
  for (let i = 0; i < nbRows; i++) {
    const row = document.createElement("div");
    row.style.display = "flex";
    for (let j = 0; j < nbCols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.style.width = `${squareSize}px`;
      cell.style.height = `${squareSize}px`;
      cell.style.backgroundColor =
        (i + j) % 2 === 0 ? "rgb(255, 255, 255)" : "rgb(231, 231, 233)";
      cell.setAttribute("row", i);
      cell.setAttribute("col", j);
      cell.addEventListener("mousedown", function () {
        if (cell.style.backgroundColor === "rgb(43, 45, 66)") {
          cell.style.backgroundColor =
            (i + j) % 2 === 0 ? "rgb(255, 255, 255)" : "rgb(231, 231, 233)";
        } else {
          cell.style.backgroundColor = "rgb(43, 45, 66)";
        }
      });
      row.appendChild(cell);
    }
    maze.appendChild(row);
  }
}

function updateGrid() {
  const maze = document.getElementById("maze");
  const cells = maze.querySelectorAll(".cell");
  let mazeWidth = Math.floor((mazeContainer.offsetWidth - 30) / squareSide);
  let mazeHeight = Math.floor((mazeContainer.offsetHeight - 30) / squareSide);

  cells.forEach((cell) => {
    if (cell.style.backgroundColor === "rgb(43, 45, 66)") {
      cell.style.backgroundColor = "rgb(231, 231, 233)";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  generateGrid();
  window.addEventListener("resize", updateGrid);
});
