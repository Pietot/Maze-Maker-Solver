// Offset between the maze and the container (15px on left/right and top/bottom)
const offset = 30;
// Size of each square in the maze by default
const defaultSquareSize = 45;

let isMouseDown = false;

// Function to generate the grid of the maze (rows and columns, colors, svg)
function generateGrid(rows, cols) {
  const mazeContainer = document.getElementById("maze-container");
  const maze = document.getElementById("maze");

  const defaultRows = Math.floor(
    (mazeContainer.offsetHeight - offset) / defaultSquareSize
  );
  const defaultCols = Math.floor(
    (mazeContainer.offsetWidth - offset) / defaultSquareSize
  );

  let nbRows = rows || defaultRows;
  let nbCols = cols || defaultCols;

  // Make sure the maze has an odd number of rows and columns (must have for the maze generation algorithm)
  if (nbRows % 2 === 0) nbRows -= 1;
  if (nbCols % 2 === 0) nbCols -= 1;

  // Make sure the maze has at least 3 rows and columns
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
      cell.style.width = `${squareSize}px`;
      cell.style.height = `${squareSize}px`;
      let color = (i + j) % 2 === 0 ? "cell1" : "cell2";
      cell.classList.add(color);
      cell.setAttribute("row", i);
      cell.setAttribute("col", j);

      // Event listeners for adding/removing "wall" class
      cell.addEventListener("mousedown", function () {
        isMouseDown = true;
        toggleWall(cell);
      });

      cell.addEventListener("mouseenter", function () {
        if (isMouseDown) {
          toggleWall(cell);
        }
      });

      row.appendChild(cell);
    }
    maze.appendChild(row);
  }

  // Stop the drawing when mouse is released
  document.addEventListener("mouseup", function () {
    isMouseDown = false;
  });
}

// Function to toggle the "wall" class on a cell
function toggleWall(cell) {
  if (cell.classList.contains("wall")) {
    cell.classList.remove("wall");
  } else {
    cell.classList.add("wall");
  }
}

function updateGrid() {
  const mazeContainer = document.getElementById("maze-container");
  const maze = document.getElementById("maze");
  const cells = maze.getElementsByClassName("cell");

  const nbRows = maze.childElementCount;
  const nbCols = maze.firstChild.childElementCount;

  // Calculate the new size of each square
  const squareSize = Math.min(
    Math.floor((mazeContainer.offsetWidth - offset) / nbCols),
    Math.floor((mazeContainer.offsetHeight - offset) / nbRows)
  );

  maze.style.width = `${squareSize * nbCols}px`;
  maze.style.height = `${squareSize * nbRows}px`;

  // Update the size of each cell
  for (let cell of cells) {
    cell.style.width = `${squareSize}px`;
    cell.style.height = `${squareSize}px`;
  }
}

function setButtons() {
  const clear = document.getElementById("trash");
  clear.onclick = function () {
    const maze = document.getElementById("maze");
    const walls = maze.getElementsByClassName("wall");
    while (walls.length > 0) {
      walls[0].classList.remove("wall");
    }
  };
}

// Add event listener for window resize to update the grid
window.addEventListener("resize", updateGrid);

// Initial grid generation
generateGrid();
setButtons();
