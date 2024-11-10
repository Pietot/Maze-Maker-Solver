class MinHeap {
  constructor() {
    this.heap = [];
  }

  // Method to add an element to the heap
  push(value) {
    this.heap.push(value);
    this.heapifyUp();
  }

  // Method to remove the smallest element from the heap
  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return min;
  }

  // Method to reorganize the heap after an insertion
  heapifyUp() {
    let index = this.heap.length - 1;
    while (
      this.getParentIndex(index) >= 0 &&
      // Comparison based on the weight
      this.heap[index][2] < this.heap[this.getParentIndex(index)][2]
    ) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  // Method to reorganize the heap after a removal
  heapifyDown() {
    let index = 0;
    while (this.getLeftChildIndex(index) < this.heap.length) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (
        this.getRightChildIndex(index) < this.heap.length &&
        this.heap[this.getRightChildIndex(index)][2] <
          // Comparison based on the weight
          this.heap[smallerChildIndex][2]
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }

      // Comparison based on the weight
      if (this.heap[index][2] <= this.heap[smallerChildIndex][2]) break;

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }

  // Method to get the parent index of an element
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  // Method to get the left child index of an element
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  // Method to get the right child index of an element
  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  // Method to swap two elements in the heap
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }

  // Method to get the size of the heap
  size() {
    return this.heap.length;
  }

  // Method to check if the heap is empty
  isEmpty() {
    return this.heap.length === 0;
  }
}

const speedInput = document.getElementById("speed");

let speed = parseInt(speedInput.value);
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

      speedInput.value = this.getAttribute("value");
      speed = parseInt(speedInput.value);
    }
  };
});

speedInput.addEventListener("input", function () {
  speed = parseInt(this.value);
});

document.getElementById("generate").addEventListener("click", function () {
  const select = document.getElementById("select-algorithm");
  const algorithm = select.options[select.selectedIndex].value;
  switch (algorithm) {
    case "kruskal":
      scultGrid();
      replaceStartEnd();
      kruskal();
      break;
    case "rdfs":
      fillGrid();
      replaceStartEnd();
      rdfs();
      break;
    case "simplified_prim":
      fillGrid();
      replaceStartEnd();
      simplifiedPrim();
      break;
    case "true_prim":
      scultGrid();
      replaceStartEnd();
      truePrim();
      break;
    case "hunt_and_kill":
      fillGrid();
      replaceStartEnd();
      huntAndKill();
      break;
    case "eller":
      clearGrid();
      replaceStartEnd();
      eller();
      break;
    case "iterative_division":
      emptyGrid();
      replaceStartEnd();
      iterativeDivision();
      break;
    case "binary_tree":
      fillGrid();
      replaceStartEnd();
      binaryTree();
      break;
    case "sidewinder":
      scultGrid();
      replaceStartEnd();
      sidewinder();
      break;
    case "aldous-broder":
      fillGrid();
      replaceStartEnd();
      aldousBroder();
      break;
    case "wilson":
      fillGrid();
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

function getRandomCell(maze) {
  const rows = maze.children;
  const randomRow = Math.floor(Math.random() * ((rows.length - 2) / 2)) * 2 + 1;
  const randomColumn =
    Math.floor(Math.random() * ((rows[0].children.length - 2) / 2)) * 2 + 1;
  return rows[randomRow].children[randomColumn];
}

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
  Array.from(maze.querySelectorAll("div")).forEach((cell) => {
    cell.style.backgroundColor = "";
    cell.classList.remove("visited");
  });
}

function emptyGrid() {
  clearGrid();
  const maze = document.getElementById("maze");
  const rows = maze.children;
  const numRows = rows.length;
  const numCols = rows[0].children.length;

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (i === 0 || i === numRows - 1 || j === 0 || j === numCols - 1) {
        rows[i].children[j].classList.add("wall");
      }
    }
  }
}

function scultGrid() {
  fillGrid();
  const maze = document.getElementById("maze");
  const cells = maze.querySelectorAll(".cell1, .cell2");
  cells.forEach((cell) => {
    const [row, col] = getCellPosition(cell);
    if (row % 2 === 1 && col % 2 === 1) {
      removeWall(cell);
    }
  });
}

function fillGrid() {
  const maze = document.getElementById("maze");
  clearGrid();
  const cells = maze.querySelectorAll(".cell1, .cell2");
  cells.forEach((cell) => cell.classList.add("wall"));
}

function setRandomColor(maze) {
  const usedColors = new Set();
  const letters = "0123456789ABCDEF";

  maze.querySelectorAll(".cell1, .cell2").forEach((cell) => {
    if (!cell.classList.contains("wall")) {
      let color;
      do {
        color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
      } while (usedColors.has(color));
      usedColors.add(color);
      cell.style.backgroundColor = color;
    }
  });
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

function getNeighbors(maze, cell) {
  const [row, col] = getCellPosition(cell);
  const rows = maze.children;
  const neighbors = [];
  // Up
  if (row > 1 && rows[row - 2].children[col].classList.contains("wall")) {
    neighbors.push(rows[row - 2].children[col]);
  }
  // Right
  if (
    col < rows[0].children.length - 2 &&
    rows[row].children[col + 2].classList.contains("wall")
  ) {
    neighbors.push(rows[row].children[col + 2]);
  }
  // Down
  if (
    row < rows.length - 2 &&
    rows[row + 2].children[col].classList.contains("wall")
  ) {
    neighbors.push(rows[row + 2].children[col]);
  }
  // Left
  if (col > 1 && rows[row].children[col - 2].classList.contains("wall")) {
    neighbors.push(rows[row].children[col - 2]);
  }
  return neighbors;
}

function getNeighborsWithDirection(maze, cell) {
  const [row, col] = getCellPosition(cell);
  const rows = maze.children;
  const neighbors = [];
  // Up
  if (
    (row > 1 && rows[row - 2].children[col].classList.contains("wall")) ||
    (row > 1 && rows[row - 2].children[col].getAttribute("opacity"))
  ) {
    neighbors.push([rows[row - 2].children[col], [-1, 0]]);
  }
  // Right
  if (
    (col < rows[0].children.length - 2 &&
      rows[row].children[col + 2].classList.contains("wall")) ||
    (col < rows[0].children.length - 2 &&
      rows[row].children[col + 2].getAttribute("opacity"))
  ) {
    neighbors.push([rows[row].children[col + 2], [0, 1]]);
  }
  // Down
  if (
    (row < rows.length - 2 &&
      rows[row + 2].children[col].classList.contains("wall")) ||
    (row < rows.length - 2 &&
      rows[row + 2].children[col].getAttribute("opacity"))
  ) {
    neighbors.push([rows[row + 2].children[col], [1, 0]]);
  }
  // Left
  if (
    (col > 1 && rows[row].children[col - 2].classList.contains("wall")) ||
    (col > 1 && rows[row].children[col - 2].getAttribute("opacity"))
  ) {
    neighbors.push([rows[row].children[col - 2], [0, -1]]);
  }
  return neighbors;
}

function getAllNeighbors(maze, cell) {
  const [row, col] = getCellPosition(cell);
  const rows = maze.children;
  const neighbors = [];
  // Up
  if (row > 2) {
    neighbors.push(rows[row - 2].children[col]);
  }
  // Right
  if (col < rows[0].children.length - 2) {
    neighbors.push(rows[row].children[col + 2]);
  }
  // Down
  if (row < rows.length - 2) {
    neighbors.push(rows[row + 2].children[col]);
  }
  // Left
  if (col > 2) {
    neighbors.push(rows[row].children[col - 2]);
  }
  return neighbors;
}

function getConnection(maze, cell) {
  const [row, col] = getCellPosition(cell);
  const rows = maze.children;
  const neighbors = [];
  // Up
  if (row > 1 && !rows[row - 2].children[col].classList.contains("wall")) {
    neighbors.push(rows[row - 2].children[col]);
  }
  // Right
  if (
    col < rows[0].children.length - 2 &&
    !rows[row].children[col + 2].classList.contains("wall")
  ) {
    neighbors.push(rows[row].children[col + 2]);
  }
  // Down
  if (
    row < rows.length - 2 &&
    !rows[row + 2].children[col].classList.contains("wall")
  ) {
    neighbors.push(rows[row + 2].children[col]);
  }
  // Left
  if (col > 1 && !rows[row].children[col - 2].classList.contains("wall")) {
    neighbors.push(rows[row].children[col - 2]);
  }
  return neighbors;
}

function getOpacityFromRgba(color) {
  const rgbaRegex = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)$/;
  const match = color.match(rgbaRegex);
  if (match) {
    return parseFloat(match[4]);
  }
  return null;
}

function createColorMap(maze) {
  const colorMap = new Map();
  maze.querySelectorAll(".cell1, .cell2").forEach((cell) => {
    const color = cell.style.backgroundColor;
    if (!colorMap.has(color)) {
      colorMap.set(color, []);
    }
    colorMap.get(color).push(cell);
  });
  return colorMap;
}

function mergeValues(wall, values, colorMap) {
  const [selectedCell, cellToReplace] = values;
  const selectedColor = selectedCell.style.backgroundColor;
  const replaceColor = cellToReplace.style.backgroundColor;

  wall.style.backgroundColor = selectedColor;
  removeWall(wall);

  if (colorMap.has(replaceColor)) {
    const matchingCells = colorMap.get(replaceColor);

    matchingCells.forEach((cell) => {
      cell.style.backgroundColor = selectedColor;
    });

    if (colorMap.has(selectedColor)) {
      colorMap.get(selectedColor).push(...matchingCells, wall);
    } else {
      colorMap.set(selectedColor, [...matchingCells, wall]);
    }
    colorMap.delete(replaceColor);
  }
}

async function kruskal() {
  const maze = document.getElementById("maze");
  setRandomColor(maze);
  const rows = maze.children;
  let breakableWalls = getBreakableWalls(maze);

  const colorMap = createColorMap(maze);

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
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      mergeValues(wall, values, colorMap);
    }
  }

  removeColors(maze);
}

async function rdfs() {
  const maze = document.getElementById("maze");
  const start = getRandomCell(maze);
  let stack = [start];
  removeWall(start);
  while (stack.length) {
    const currentCell = stack[stack.length - 1];
    const neighbors = getNeighbors(maze, currentCell);
    if (neighbors.length) {
      const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      const [row, col] = getCellPosition(neighbor);
      const [row2, col2] = getCellPosition(currentCell);
      const wall = maze.children[(row + row2) / 2].children[(col + col2) / 2];
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      removeWall(wall);
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      removeWall(neighbor);
      stack.push(wall);
      stack.push(neighbor);
    } else {
      const wall = stack.pop();
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      wall.classList.add("visited");
      const visited = stack.pop();
      if (stack.length) {
        speed > 0 &&
          (await new Promise((resolve) => setTimeout(resolve, speed)));
        visited.classList.add("visited");
      }
    }
  }
  maze
    .querySelectorAll(".visited")
    .forEach((cell) => cell.classList.remove("visited"));
}

async function simplifiedPrim() {
  let neighbors = [];
  const maze = document.getElementById("maze");
  const start = getRandomCell(maze);
  removeWall(start);
  neighbors.push(...getNeighborsWithDirection(maze, start));
  while (neighbors.length) {
    const [neighbor, direction] =
      neighbors[Math.floor(Math.random() * neighbors.length)];
    if (neighbor.classList.contains("wall")) {
      const [row, col] = getCellPosition(neighbor);
      const wall =
        maze.children[row - direction[0]].children[col - direction[1]];
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      removeWall(wall);
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      removeWall(neighbor);
    }
    neighbors = neighbors.filter((n) => n[0] !== neighbor);
    neighbors.push(...getNeighborsWithDirection(maze, neighbor));
  }
}

async function truePrim() {
  let neighbors = new MinHeap();
  const maze = document.getElementById("maze");
  const start = getRandomCell(maze);

  maze.querySelectorAll(".cell1, .cell2").forEach((cell) => {
    if (!cell.classList.contains("wall")) {
      rdmOpacity = Math.random();
      cell.style.backgroundColor = `rgba(217, 4, 41, ${rdmOpacity})`;
      cell.setAttribute("opacity", rdmOpacity);
    }
  });

  start.style.backgroundColor = "";
  start.removeAttribute("opacity");

  for (let neighbor of getNeighborsWithDirection(maze, start)) {
    const weight = getOpacityFromRgba(neighbor[0].style.backgroundColor);
    neighbors.push([neighbor[0], neighbor[1], weight]);
  }

  while (neighbors.heap.length) {
    const [neighbor, direction] = neighbors.pop();
    if (neighbor.style.backgroundColor !== "") {
      const [row, col] = getCellPosition(neighbor);
      const wall =
        maze.children[row - direction[0]].children[col - direction[1]];
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      removeWall(wall);
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      neighbor.style.backgroundColor = "";
      for (let next_neighbor of getNeighborsWithDirection(maze, neighbor)) {
        if (next_neighbor[0].style.backgroundColor !== "") {
          const weight = getOpacityFromRgba(
            next_neighbor[0].style.backgroundColor
          );
          neighbors.push([next_neighbor[0], next_neighbor[1], weight]);
        }
      }
    }
  }
}

async function huntAndKill() {
  const maze = document.getElementById("maze");
  const huntScan = document.getElementById("hunt");
  const start = getRandomCell(maze);
  let cell = start;
  removeWall(cell);

  async function hunt() {
    const rows = maze.children;
    huntScan.style.display = "block";
    for (let i = 1; i < rows.length - 1; i += 2) {
      huntScan.style.top =
        parseInt(huntScan.getAttribute("value")) +
        (i - 1) * cell.offsetHeight +
        "px";
      speed > 0 &&
        (await new Promise((resolve) => setTimeout(resolve, 2 * speed)));
      for (let j = 1; j < rows[i].children.length - 1; j += 2) {
        const cell = rows[i].children[j];
        if (cell.classList.contains("wall")) {
          const neighbors = getConnection(maze, cell);
          if (neighbors.length) {
            const neighbor =
              neighbors[Math.floor(Math.random() * neighbors.length)];
            const [row, col] = getCellPosition(neighbor);
            const [row2, col2] = getCellPosition(cell);
            const wall =
              maze.children[(row + row2) / 2].children[(col + col2) / 2];
            speed > 0 &&
              (await new Promise((resolve) => setTimeout(resolve, 2 * speed)));
            huntScan.style.display = "none";
            huntScan.style.top = huntScan.getAttribute("value") + "px";
            speed > 0 &&
              (await new Promise((resolve) => setTimeout(resolve, 2 * speed)));
            removeWall(wall);
            speed > 0 &&
              (await new Promise((resolve) => setTimeout(resolve, 2 * speed)));
            removeWall(cell);
            speed > 0 &&
              (await new Promise((resolve) => setTimeout(resolve, 2 * speed)));
            return cell;
          }
        }
      }
      speed > 0 &&
        (await new Promise((resolve) => setTimeout(resolve, 2 * speed)));
    }
    huntScan.style.display = "none";
    huntScan.style.top = huntScan.getAttribute("value") + "px";
    return null;
  }

  while (cell) {
    const neighbors = getNeighbors(maze, cell);
    if (neighbors.length) {
      const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      const [row, col] = getCellPosition(cell);
      const [row2, col2] = getCellPosition(neighbor);
      const wall = maze.children[(row + row2) / 2].children[(col + col2) / 2];
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      removeWall(wall);
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      removeWall(neighbor);
      cell = neighbor;
    } else {
      cell = await hunt();
    }
  }
}

async function iterativeDivision() {
  function divideVertically(width, height) {
    return width !== height ? width > height : Math.random() > 0.5;
  }
  stack = [
    [
      [1, 1],
      [maze.children.length - 2, maze.children[0].children.length - 2],
      [0, 0],
    ],
  ];
  while (stack.length) {
    const [startIndex, endIndex, ban] = stack.pop();
    const height = endIndex[0] - startIndex[0];
    const width = endIndex[1] - startIndex[1];
    if (height < 2 || width < 2) {
      continue;
    }

    if (divideVertically(width, height)) {
      // Like wall_columns = [i for i in range(start_index[1], endIndex[1] + 1)
      //                      if i not in (start_index[1], ban[1], end_index[1]) and i % 2 == 0
      //                     ]
      const wallColumns = Array.from(
        { length: endIndex[1] - startIndex[1] + 1 },
        (_, i) => startIndex[1] + i
      ).filter(
        (i) =>
          i !== startIndex[1] &&
          i !== ban[1] &&
          i !== endIndex[1] &&
          i % 2 === 0
      );
      const wallColumnIndex =
        wallColumns[Math.floor(Math.random() * wallColumns.length)];
      // Add walls to all column index cells
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      for (let i = startIndex[0]; i <= endIndex[0]; i++) {
        const cell = maze.children[i].children[wallColumnIndex];
        addWall(cell);
      }
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      const entries = Array.from(
        { length: endIndex[0] - startIndex[0] + 1 },
        (_, i) => startIndex[0] + i
      ).filter((i) => i % 2 === 1);
      const entry = entries[Math.floor(Math.random() * entries.length)];
      const entryCoordinates = [entry, wallColumnIndex];
      maze.children[entry].children[wallColumnIndex].classList.remove("wall");

      stack.push([
        startIndex,
        [endIndex[0], wallColumnIndex - 1],
        entryCoordinates,
      ]);
      stack.push([
        [startIndex[0], wallColumnIndex + 1],
        endIndex,
        entryCoordinates,
      ]);
    } else {
      // Like wall_rows = [i for i in range(start_index[0], endIndex[0] + 1)
      //                   if i not in (start_index[0], ban[0], end_index[0]) and i % 2 == 0
      //                  ]
      const wallRows = Array.from(
        { length: endIndex[0] - startIndex[0] + 1 },
        (_, i) => startIndex[0] + i
      ).filter(
        (i) =>
          i !== startIndex[0] &&
          i !== ban[0] &&
          i !== endIndex[0] &&
          i % 2 === 0
      );
      const wallRowIndex =
        wallRows[Math.floor(Math.random() * wallRows.length)];
      // Add walls to all row index cells
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      for (let i = startIndex[1]; i <= endIndex[1]; i++) {
        const cell = maze.children[wallRowIndex].children[i];
        addWall(cell);
      }
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      const entries = Array.from(
        { length: endIndex[1] - startIndex[1] + 1 },
        (_, i) => startIndex[1] + i
      ).filter((i) => i % 2 === 1);
      const entry = entries[Math.floor(Math.random() * entries.length)];
      const entryCoordinates = [wallRowIndex, entry];
      maze.children[wallRowIndex].children[entry].classList.remove("wall");

      stack.push([
        startIndex,
        [wallRowIndex - 1, endIndex[1]],
        entryCoordinates,
      ]);
      stack.push([
        [wallRowIndex + 1, startIndex[1]],
        endIndex,
        entryCoordinates,
      ]);
    }
  }
}

async function binaryTree() {
  const maze = document.getElementById("maze");
  const rows = maze.children;

  for (let i = 1; i < rows.length - 1; i++) {
    for (let j = 1; j < rows[i].children.length - 1; j++) {
      if (i === 1 || j === 1) removeWall(rows[i].children[j]);
    }
  }

  for (let i = 3; i < rows.length - 1; i += 2) {
    for (let j = 3; j < rows[i].children.length - 1; j += 2) {
      if (Math.random() > 0.5) {
        speed > 0 &&
          (await new Promise((resolve) => setTimeout(resolve, speed)));
        removeWall(rows[i - 1].children[j]);
        speed > 0 &&
          (await new Promise((resolve) => setTimeout(resolve, speed)));
        removeWall(rows[i].children[j]);
      } else {
        speed > 0 &&
          (await new Promise((resolve) => setTimeout(resolve, speed)));
        removeWall(rows[i].children[j - 1]);
        speed > 0 &&
          (await new Promise((resolve) => setTimeout(resolve, speed)));
        removeWall(rows[i].children[j]);
      }
    }
  }
}

async function sidewinder() {
  const rows = document.getElementById("maze").children;

  Array.from(rows[1].children).slice(1, -1).forEach(removeWall);

  const [northDirection, eastDirection] = [
    [-1, 0],
    [0, 1],
  ];

  let cells = [];

  for (let i = 3; i < rows.length - 1; i += 2) {
    for (let j = 1; j < rows[i].children.length - 1; j += 2) {
      cells.push(rows[i].children[j]);
      if (Math.random() <= 0.5 || j === rows[i].children.length - 2) {
        const cellCoordinates = getCellPosition(
          cells[Math.floor(Math.random() * cells.length)]
        );
        const wallCoordinates = [
          cellCoordinates[0] + northDirection[0],
          cellCoordinates[1] + northDirection[1],
        ];
        removeWall(rows[wallCoordinates[0]].children[wallCoordinates[1]]);
        cells = [];
      } else {
        const cellCoordinates = getCellPosition(rows[i].children[j]);
        const wallCoordinates = [
          cellCoordinates[0],
          cellCoordinates[1] + eastDirection[1],
        ];
        removeWall(rows[wallCoordinates[0]].children[wallCoordinates[1]]);
      }
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
    }
  }
}

async function aldousBroder() {
  const maze = document.getElementById("maze");
  const start = getRandomCell(maze);
  let cell = start;
  const numberCell =
    Math.floor(maze.children.length / 2) *
    Math.floor(maze.children[0].children.length / 2);
  removeWall(cell);
  let visited = 1;
  while (visited < numberCell) {
    const neighbors = getAllNeighbors(maze, cell);
    const rdmNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    if (rdmNeighbor.classList.contains("wall")) {
      const [row, col] = getCellPosition(rdmNeighbor);
      const [row2, col2] = getCellPosition(cell);
      const wall = maze.children[(row + row2) / 2].children[(col + col2) / 2];
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      removeWall(wall);
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      removeWall(rdmNeighbor);
      visited++;
    }
    cell = rdmNeighbor;
  }
}

async function wilson() {
  function getRemainningCells(maze) {
    const rows = maze.children;
    const remainningCells = [];
    for (let i = 1; i < rows.length - 1; i += 2) {
      for (let j = 1; j < rows[i].children.length - 1; j += 2) {
        if (rows[i].children[j].classList.contains("wall")) {
          remainningCells.push(rows[i].children[j]);
        }
      }
    }
    return remainningCells;
  }

  const maze = document.getElementById("maze");

  let end = getRandomCell(maze);
  removeWall(end);
  end.style.backgroundColor = "rgba(229, 60, 60, 0.5)";

  let remainningCells;

  while ((remainningCells = getRemainningCells(maze)).length) {
    const start =
      remainningCells[Math.floor(Math.random() * remainningCells.length)];
    start.style.backgroundColor = "rgba(120, 227, 95, 0.5)";
    const path = [start];
    while (path[path.length - 1].classList.contains("wall")) {
      const currentCell = path[path.length - 1];
      const neighbors = getAllNeighbors(maze, currentCell);
      const rdmNeighbor =
        neighbors[Math.floor(Math.random() * neighbors.length)];
      if (path.length > 1 && rdmNeighbor === path[path.length - 2]) {
        path.pop();
      } else if (path.includes(rdmNeighbor)) {
        const index = path.indexOf(rdmNeighbor);
        path.splice(index + 1);
      } else {
        path.push(rdmNeighbor);
      }
    }
    const rdmColor = setRandomColor(maze);
    for (let i = 0; i < path.length - 1; i++) {
      const [row, col] = getCellPosition(path[i]);
      const [row2, col2] = getCellPosition(path[i + 1]);
      const wall = maze.children[(row + row2) / 2].children[(col + col2) / 2];
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      removeWall(path[i]);
      path[i].style.backgroundColor = rdmColor;
      speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
      removeWall(wall);
      wall.style.backgroundColor = rdmColor;
    }
  }
  removeColors(maze);
}
