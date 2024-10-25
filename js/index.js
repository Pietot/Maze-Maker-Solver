// Offset between the maze and the container (15px on left/right and top/bottom)
const offset = 30;
// Size of each square in the maze by default
const defaultSquareSize = 45;

let isMouseDown = false;
let drawingMode = "pen";

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
        toggleCell(cell, drawingMode);
      });

      cell.addEventListener("mouseenter", function () {
        if (isMouseDown) {
          toggleCell(cell, drawingMode);
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
function toggleCell(cell, drawingMode) {
  if (drawingMode === "pen") {
    if (!cell.classList.contains("wall")) {
      cell.classList.add("wall");
    }
  } else if (drawingMode === "paintbrush") {
    if (cell.classList.contains("wall")) {
      cell.classList.remove("wall");
    } else {
      cell.classList.add("wall");
    }
  } else {
    cell.classList.remove("wall");
  }
}

function updateGrid() {
  const mazeContainer = document.getElementById("maze-container");
  const maze = document.getElementById("maze");
  const cells1 = maze.getElementsByClassName("cell1");
  const cells2 = maze.getElementsByClassName("cell2");
  const cells = [...cells1, ...cells2];

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

// Function to set actions to buttons
function setButtons() {
  // When the button with id "trash" is clicked, remove all walls
  const clear = document.getElementById("trash");
  clear.onclick = function () {
    const maze = document.getElementById("maze");
    const walls = maze.getElementsByClassName("wall");
    while (walls.length > 0) {
      walls[0].classList.remove("wall");
    }
  };

  // When the button with id "lock" is clicked, change the way to update the grid
  const lockScreen = document.getElementById("lock");
  lockScreen.onclick = function () {
    let svg = lockScreen.getElementsByTagName("img")[0];
    if (lockScreen.value === "1") {
      lockScreen.value = "0";
      lockScreen.style.backgroundColor = "green";
      lockScreen.style.borderColor = "darkgreen";
      svg.src = "assets/lock-open.svg";
      svg.alt = "lock-open.svg";
    } else {
      lockScreen.value = "1";
      lockScreen.style.backgroundColor = "red";
      lockScreen.style.borderColor = "darkred";
      svg.src = "assets/lock.svg";
      svg.alt = "lock.svg";
    }
  };

  // Manage the style of the buttons & the drawing mode
  document.addEventListener("DOMContentLoaded", function () {
    const buttons = Array.from(
      document.querySelectorAll(".action-button")
    ).slice(0, 3);
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        if (this.dataset.isToggle !== "1") {
          buttons.forEach((btn) => {
            btn.dataset.isToggle = "0";
            btn.style.boxShadow = "";
          });

          this.dataset.isToggle = "1";
          if (this.id === "pen") {
            this.style.boxShadow = "0px 0px 10px 3px rgba(0, 0, 0)";
            drawingMode = "pen";
          } else if (this.id === "paintbrush") {
            this.style.boxShadow = "0px 0px 10px 3px rgb(41, 11, 214)";
            drawingMode = "paintbrush";
          } else {
            this.style.boxShadow = "0px 0px 10px 3px rgba(255, 255, 255)";
            drawingMode = "eraser";
          }
        }
      });
    });
  });
}

// Add event listener for window resize to update the grid
window.addEventListener("resize", updateGrid);

// Initial grid generation
generateGrid();
setButtons();
