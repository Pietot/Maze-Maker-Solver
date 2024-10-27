document.getElementById("generate").addEventListener("click", function () {
  const select = document.getElementById("select-algorithm");
  const algorithm = select.options[select.selectedIndex].value;
  switch (algorithm) {
    case "kruskal":
      clearGrid();
      replaceStartEnd();
      kruskal();
      break;
    case "simplified_prim":
      clearGrid();
      replaceStartEnd();
      simplifiedPrim();
      break;
    case "true_prim":
      clearGrid();
      replaceStartEnd();
      truePrim();
      break;
    case "hunt_and_kill":
      clearGrid();
      replaceStartEnd();
      huntAndKill();
      break;
    case "eller":
      clearGrid();
      replaceStartEnd();
      eller();
      break;
    case "iterative_division":
      clearGrid();
      replaceStartEnd();
      iterativeDivision();
      break;
    case "binary_tree":
      clearGrid();
      replaceStartEnd();
      binaryTree();
      break;
    case "sidewinder":
      clearGrid();
      replaceStartEnd();
      sidewinder();
      break;
    case "growing_tree":
      clearGrid();
      replaceStartEnd();
      growingTree();
      break;
    case "aldous":
      clearGrid();
      replaceStartEnd();
      aldousBroder();
      break;
    case "wilson":
      clearGrid();
      replaceStartEnd();
      wilson();
      break;
    case "origin_shift":
      clearGrid();
      replaceStartEnd();
      originShift();
      break;
    default:
      break;
  }
});

function replaceStartEnd() {
  const maze = document.getElementById("maze");
  const rows = maze.children;
  const start = rows[1].children[1];
  const end = rows[rows.length - 2].children[rows[0].children.length - 2];
  maze.querySelector(".start").classList.remove("start");
  maze.querySelector(".end").classList.remove("end");
  start.classList.add("start");
  end.classList.add("end");
}

function addWall(cell) {
  cell.classList.add("wall");
}

function removeWall(cell) {
  cell.classList.remove("wall");
}

function clearGrid() {
  const maze = document.getElementById("maze");
  maze.querySelectorAll(".wall").forEach((cell) => removeWall(cell));
  Array.from(maze.querySelectorAll("div"))
    .filter((div) => div.style.backgroundColor)
    .forEach((cell) => (cell.style.backgroundColor = ""));
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getCellPosition(cell) {
  return [
    parseInt(cell.getAttribute("row")),
    parseInt(cell.getAttribute("col")),
  ];
}

function getBreakableWalls(maze) {
  const rows = maze.children;
  let breakableWalls = [];
  for (let i = 1; i < rows.length - 1; i++) {
    const cells = rows[i].children;
    for (let j = 1; j < cells.length - 1; j++) {
      if ((i % 2 === 0 && j % 2 === 1) || (i % 2 === 1 && j % 2 === 0)) {
        breakableWalls.push(cells[j]);
      }
    }
  }
  return shuffleArray(breakableWalls);
}

function removeColors(maze) {
  const cells = maze.querySelectorAll(".cell1, .cell2");
  cells.forEach((cell) => (cell.style.backgroundColor = ""));
}

async function mergeValues(wall, values) {
  const selectedCell = values[0];
  const cellToReplace = values[1];
  wall.style.backgroundColor = selectedCell.style.backgroundColor;
  wall.classList.remove("wall");

  const matchingCells = Array.from(
    maze.querySelectorAll(
      '.cell1[style*="background-color"], .cell2[style*="background-color"]'
    )
  ).filter(
    (cell) => cell.style.backgroundColor === cellToReplace.style.backgroundColor
  );

  matchingCells.forEach((cell) => {
    cell.style.backgroundColor = selectedCell.style.backgroundColor;
  });
}

async function kruskal() {
  const maze = document.getElementById("maze");
  const rows = maze.children;
  let breakableWalls = getBreakableWalls(maze);

  for (let i = 0; i < rows.length; i++) {
    const rowCells = rows[i].children;
    if (i === 0 || i === rows.length - 1) {
      for (let cell of rowCells) addWall(cell);
    } else {
      addWall(rowCells[0]);
      addWall(rowCells[rowCells.length - 1]);
      for (let j = 1; j < rowCells.length - 1; j++) {
        if (j % 2 === 0 || i % 2 === 0) addWall(rowCells[j]);
        else rowCells[j].style.backgroundColor = getRandomColor();
      }
    }
  }

  for (let wall of breakableWalls) {
    const [row, column] = getCellPosition(wall);
    let values = [];
    if (row % 2 === 0) {
      const upper_cell = rows[row - 1].children[column];
      const bottom_cell = rows[row + 1].children[column];
      values = [upper_cell, bottom_cell];
    } else {
      const left_cell = rows[row].children[column - 1];
      const right_cell = rows[row].children[column + 1];
      values = [left_cell, right_cell];
    }
    if (values[0].style.backgroundColor !== values[1].style.backgroundColor) {
      await new Promise((resolve) => {
        setTimeout(() => {
          mergeValues(wall, values);
          resolve();
        }, 50);
      });
    }
  }
  removeColors(maze);
}
