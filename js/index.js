// Offset min between the maze and the container (15px on left/right and top/bottom)
const offset = 30;
// Size of each square in the maze by default
const defaultSquareSize = 35;

let isMouseDown = false;
let drawingMode = "paintbrush";
let lastTouchedCell = null;

// Function to generate the grid of the maze (rows and columns, colors, svg)
function generateGrid(rows, cols) {
  const mazeContainer = document.getElementById("maze-container");
  const maze = document.getElementById("maze");
  maze.innerHTML = "";

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
  const squareSize =
    defaultSquareSize ||
    Math.min(
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
      cell.addEventListener("touchstart", function (e) {
        // Prevents scrolling on mobile
        e.preventDefault();
        isMouseDown = true;
        lastTouchedCell = cell;
        toggleCell(cell, drawingMode);
      });

      cell.addEventListener("mouseenter", function () {
        if (isMouseDown) {
          toggleCell(cell, drawingMode);
        }
      });
      cell.addEventListener("touchmove", function (e) {
        // Prevents scrolling on mobile
        e.preventDefault();
        if (isMouseDown) {
          const touch = e.touches[0];
          const targetCell = document.elementFromPoint(
            touch.clientX,
            touch.clientY
          );
          if (
            targetCell &&
            (targetCell.classList.contains("cell1") ||
              targetCell.classList.contains("cell2")) &&
            targetCell !== lastTouchedCell
          ) {
            lastTouchedCell = targetCell;
            toggleCell(targetCell, drawingMode);
          }
        }
      });

      row.appendChild(cell);
    }
    maze.appendChild(row);
  }
  setStartEnd();
}

// Function to toggle the "wall" class on a cell depending on the drawing mode
function toggleCell(cell, drawingMode) {
  if (cell.classList.contains("start") || cell.classList.contains("end")) {
    return;
  }
  if (drawingMode === "pen") {
    cell.classList.add("wall");
  } else if (drawingMode === "paintbrush") {
    cell.classList.toggle("wall");
  } else {
    cell.classList.remove("wall");
  }
}

function updateGrid() {
  const mazeContainer = document.getElementById("maze-container");
  const maze = document.getElementById("maze");
  const cells = maze.querySelectorAll(".cell1, .cell2");

  const nbRows = maze.childElementCount;
  const nbCols = maze.firstChild.childElementCount;

  const isGridLocked = document.getElementById("lock").value === "1";

  if (isGridLocked) {
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
  } else {
    generateGrid();
  }
}

// Function to set actions to buttons
function setButtons() {
  // When the button with id "trash" is clicked, remove all walls
  const clear = document.getElementById("trash");
  clear.onclick = () => {
    clearGrid();
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
      generateGrid();
    } else {
      lockScreen.value = "1";
      lockScreen.style.backgroundColor = "red";
      lockScreen.style.borderColor = "darkred";
      svg.src = "assets/lock.svg";
      svg.alt = "lock.svg";
    }
  };

  // Manage the style of the buttons & the drawing mode
  const buttons = Array.from(document.querySelectorAll(".action-button")).slice(
    0,
    3
  );
  buttons.forEach((button) => {
    button.onclick = function () {
      if (this.dataset.isToggled !== "1") {
        buttons.forEach((btn) => {
          btn.dataset.isToggled = "0";
          btn.style.boxShadow = "";
        });

        this.dataset.isToggled = "1";
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
    };
  });

  // Manage the style of the speed buttons
  const speedBtn = document.querySelectorAll(".speed-button");
  speedBtn.forEach((btn) => {
    btn.onclick = function () {
      if (this.dataset.isToggled !== "1") {
        speedBtn.forEach((btn) => {
          btn.dataset.isToggled = "0";
          btn.style.boxShadow = "";
        });

        this.dataset.isToggled = "1";
        this.style.boxShadow = "0px 0px 10px 3px rgb(62, 0, 128)";
      }
    };
  });
}

function setInputSpeed() {
  const numElement = document.getElementById("speed");
  ["change", "input", "keyup", "keydown", "paste"].forEach((event) =>
    numElement.addEventListener(event, validateMax)
  );

  function validateMax() {
    const value = parseInt(numElement.value, 10);
    if (isNaN(value)) {
      numElement.value = "";
    } else if (value < 0) {
      numElement.value = "";
    } else if (value > 10000) {
      numElement.value = 10000;
    }
    numElement.value = Math.round(numElement.value);
  }
}

function setHuntScan() {
  const huntScan = document.getElementById("hunt");
  const cell = document.getElementsByClassName("cell1")[0];

  huntScan.style.width = maze.offsetWidth + cell.offsetWidth / 2 + "px";
  huntScan.style.height = 1.5 * cell.offsetHeight + "px";
  huntScan.style.top = Math.floor(offset - cell.offsetHeight / 2) + "px";
  huntScan.style.left = maze.offsetLeft - cell.offsetWidth / 4 + "px";
  huntScan.setAttribute("value", Math.floor(offset - cell.offsetHeight / 2));
}

// Download the maze as a text file
document.getElementById("download").onclick = function () {
  const maze = document.getElementById("maze");
  const rows = maze.children;

  let mazeString = "[";
  for (let i = 0; i < rows.length; i++) {
    mazeString += "[";
    const cols = rows[i].children;
    for (let j = 0; j < cols.length; j++) {
      if (cols[j].classList.contains("solution")) {
        mazeString += "2,";
      } else if (cols[j].classList.contains("wall")) {
        mazeString += "1,";
      } else {
        mazeString += "0,";
      }
    }
    // Delete the last comma
    mazeString = mazeString.slice(0, -1);
    mazeString += "]\n";
  }
  // Delete the last break line
  mazeString = mazeString.slice(0, -1);
  mazeString += "]";

  const blob = new Blob([mazeString], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "maze.txt";
  a.click();

  URL.revokeObjectURL(url);
};

// Function to set the start and end of the maze like align-content: center and justify-content: space-around
function setStartEnd() {
  const maze = document.getElementById("maze");
  const rows = maze.children;
  const centeredRow = rows[Math.floor(rows.length / 2)];
  const centeredCells = centeredRow.children;

  const startIndex = Math.floor(centeredCells.length / 4);
  const endIndex = Math.floor(centeredCells.length * (3 / 4));

  const start = centeredCells[startIndex];
  const end = centeredCells[endIndex];

  start.classList.add("start");
  end.classList.add("end");
}

// Add event listener for window resize to update the grid
window.addEventListener("resize", updateGrid);

// Initial grid generation
generateGrid();
setButtons();
setInputSpeed();
setHuntScan();

// Stop the drawing when mouse or touch is released
document.addEventListener("mouseup", function () {
  isMouseDown = false;
});
document.addEventListener("touchend", function () {
  isMouseDown = false;
  lastTouchedCell = null;
});
