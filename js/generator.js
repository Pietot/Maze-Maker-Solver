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
  btn.addEventListener("click", function () {
    speedBtn.forEach((btn) => {
      btn.dataset.isToggled = "0";
      btn.style.boxShadow = "";
    });

    this.dataset.isToggled = "1";
    this.style.boxShadow = "0px 0px 10px 3px rgb(62, 0, 128)";

    speedInput.value = this.getAttribute("value");
    speed = parseInt(speedInput.value);
  });
});

speedInput.addEventListener("input", function () {
  speed = parseInt(this.value);
});

document.getElementById("generate").addEventListener("click", function () {
  const select = document.getElementById("select-algorithm");
  const algorithm = select.options[select.selectedIndex].value;
  switch (algorithm) {
    case "aldous-broder":
      fillGrid();
      replaceStartEnd();
      aldousBroder();
      break;
    case "binary_tree":
      fillGrid();
      replaceStartEnd();
      binaryTree();
      break;
    case "eller":
      scultGrid();
      replaceStartEnd();
      eller();
      break;
    case "hunt_and_kill":
      fillGrid();
      replaceStartEnd();
      huntAndKill();
      break;
    case "iterative_division":
      emptyGrid();
      replaceStartEnd();
      iterativeDivision();
      break;
    case "kruskal":
      scultGrid();
      replaceStartEnd();
      kruskal();
      break;
    case "modified_prim":
      fillGrid();
      replaceStartEnd();
      modifiedPrim();
      break
    case "origin_shift":
      fillGrid();
      replaceStartEnd();
      originShift();
      break;
    case "pietot":
      scultGrid();
      replaceStartEnd();
      pietot();
      break;
    case "rdfs":
      fillGrid();
      replaceStartEnd();
      rdfs();
      break;
    case "sidewinder":
      scultGrid();
      replaceStartEnd();
      sidewinder();
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
    case "wilson":
      fillGrid();
      replaceStartEnd();
      wilson();
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
  maze.querySelectorAll("div").forEach((cell) => {
    cell.style.backgroundColor = "";
    cell.classList.remove("visited", "viewed", "marked", "path");
    removeWall(cell);
    cell.className = cell.className
      .split(" ")
      .filter((cls) => !cls.startsWith("arrow"))
      .join(" ");
    cell.removeAttribute("opacity");
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

function getRandomColor(colors = []) {
  const letters = "0123456789ABCDEF";
  let color;
  do {
    color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (colors.includes(color));
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
  const classesToCheck = [
    "arrow-left",
    "arrow-right",
    "arrow-up",
    "arrow-down",
  ];
  // Up
  if (
    (row > 1 && rows[row - 2].children[col].classList.contains("wall")) ||
    (row > 1 && rows[row - 2].children[col].getAttribute("opacity")) ||
    (row > 1 &&
      classesToCheck.some((cls) =>
        rows[row - 2].children[col].classList.contains(cls)
      ))
  ) {
    neighbors.push([rows[row - 2].children[col], [-1, 0]]);
  }
  // Right
  if (
    (col < rows[0].children.length - 2 &&
      rows[row].children[col + 2].classList.contains("wall")) ||
    (col < rows[0].children.length - 2 &&
      rows[row].children[col + 2].getAttribute("opacity")) ||
    (col < rows[0].children.length - 2 &&
      classesToCheck.some((cls) =>
        rows[row].children[col + 2].classList.contains(cls)
      ))
  ) {
    neighbors.push([rows[row].children[col + 2], [0, 1]]);
  }
  // Down
  if (
    (row < rows.length - 2 &&
      rows[row + 2].children[col].classList.contains("wall")) ||
    (row < rows.length - 2 &&
      rows[row + 2].children[col].getAttribute("opacity")) ||
    (row < rows.length - 2 &&
      classesToCheck.some((cls) =>
        rows[row + 2].children[col].classList.contains(cls)
      ))
  ) {
    neighbors.push([rows[row + 2].children[col], [1, 0]]);
  }
  // Left
  if (
    (col > 1 && rows[row].children[col - 2].classList.contains("wall")) ||
    (col > 1 && rows[row].children[col - 2].getAttribute("opacity")) ||
    (col > 1 &&
      classesToCheck.some((cls) =>
        rows[row].children[col - 2].classList.contains(cls)
      ))
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
  const [cell1, cell2] = values;
  const color1 = cell1.style.backgroundColor;
  const color2 = cell2.style.backgroundColor;

  const count1 = colorMap.has(color1) ? colorMap.get(color1).length : 0;
  const count2 = colorMap.has(color2) ? colorMap.get(color2).length : 0;

  const selectedCell = count1 >= count2 ? cell1 : cell2;
  const cellToReplace = selectedCell === cell1 ? cell2 : cell1;

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

async function eller() {
  const maze = document.getElementById("maze");
  const rows = maze.children;
  setRandomColor(maze);
  const colorMap = createColorMap(maze);

  for (let rowIndex = 1; rowIndex < rows.length - 1; rowIndex += 2) {
    const lastRow = rowIndex === rows.length - 2;
    const cells = rows[rowIndex].children;
    for (let valueIndex = 1; valueIndex < cells.length - 2; valueIndex += 2) {
      const [val1, val2] = [
        rows[rowIndex].children[valueIndex],
        rows[rowIndex].children[valueIndex + 2],
      ];
      if (
        lastRow &&
        val1.style.backgroundColor !== val2.style.backgroundColor
      ) {
        speed > 0 &&
          (await new Promise((resolve) => setTimeout(resolve, speed)));
        mergeValues(
          maze.children[rowIndex].children[valueIndex + 1],
          [val1, val2],
          colorMap
        );
      }
      if (
        val1.style.backgroundColor !== val2.style.backgroundColor &&
        Math.random() <= 0.5
      ) {
        speed > 0 &&
          (await new Promise((resolve) => setTimeout(resolve, speed)));
        mergeValues(
          maze.children[rowIndex].children[valueIndex + 1],
          [val1, val2],
          colorMap
        );
      }
    }
    if (lastRow) break;
    let carves = 0;
    // Carve vertically
    for (let valueIndex = 1; valueIndex <= cells.length - 2; valueIndex += 2) {
      let val1, val2;
      if (valueIndex === cells.length - 2) {
        [val1, val2] = [
          rows[rowIndex].children[valueIndex],
          rows[rowIndex].children[valueIndex - 2],
        ];
      } else {
        [val1, val2] = [
          rows[rowIndex].children[valueIndex],
          rows[rowIndex].children[valueIndex + 2],
        ];
      }
      if (
        (val1.style.backgroundColor !== val2.style.backgroundColor &&
          !carves) ||
        (val1.style.backgroundColor === val2.style.backgroundColor &&
          !carves &&
          valueIndex === cells.length - 2)
      ) {
        const wall = rows[rowIndex + 1].children[valueIndex];
        const [mergeVal1, mergeVal2] = [
          val1,
          maze.children[rowIndex + 2].children[valueIndex],
        ];
        speed > 0 &&
          (await new Promise((resolve) => setTimeout(resolve, speed)));
        mergeValues(wall, [mergeVal1, mergeVal2], colorMap);
        carves++;
      } else if (Math.random() <= 0.5) {
        const wall = rows[rowIndex + 1].children[valueIndex];
        const [mergeVal1, mergeVal2] = [
          val1,
          maze.children[rowIndex + 2].children[valueIndex],
        ];
        speed > 0 &&
          (await new Promise((resolve) => setTimeout(resolve, speed)));
        mergeValues(wall, [mergeVal1, mergeVal2], colorMap);
        carves++;
      }
      if (val1.style.backgroundColor !== val2.style.backgroundColor) carves = 0;
    }
  }
  speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
  removeColors(maze);
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
        Math.floor(
          parseInt(huntScan.getAttribute("value")) + (i - 1) * cell.offsetHeight
        ) + "px";
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
              (await new Promise((resolve) => setTimeout(resolve, speed)));
            removeWall(wall);
            speed > 0 &&
              (await new Promise((resolve) => setTimeout(resolve, speed)));
            removeWall(cell);
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
  speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
  removeColors(maze);
}

async function modifiedPrim() {
  let frontierCells = [];
  const maze = document.getElementById("maze");
  const start = getRandomCell(maze);
  removeWall(start);
  getNeighborsWithDirection(maze, start).forEach((neighbor) => {
    removeWall(neighbor[0]);
    neighbor[0].style.backgroundColor = "salmon";
    frontierCells.push([neighbor[0], start]);
    removeWall(neighbor[0]);
  });
  speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
  while (frontierCells.length) {
    random_index = Math.floor(Math.random() * frontierCells.length);
    const [frontierCell, inCell] = frontierCells[random_index];
    const [row, col] = getCellPosition(frontierCell);
    const [row2, col2] = getCellPosition(inCell);
    const wall = maze.children[(row + row2) / 2].children[(col + col2) / 2];
    removeWall(wall);
    speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
    frontierCell.style.backgroundColor = "";
    speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
    frontierCells = frontierCells.filter((cell) => cell !== frontierCells[random_index]);
    getNeighborsWithDirection(maze, frontierCell).forEach((neighbor) => {
      if (neighbor[0].style.backgroundColor === "") {
        removeWall(neighbor[0]);
        neighbor[0].style.backgroundColor = "salmon";
        frontierCells.push([neighbor[0], frontierCell]);
        removeWall(neighbor[0]);
      }
    });

  }
}

async function originShift() {
  const maze = document.getElementById("maze");
  const rows = maze.children;
  const start = maze.getElementsByClassName("start")[0];
  const end = maze.getElementsByClassName("end")[0];

  start.classList.remove("start");
  end.classList.remove("end");

  for (let i = 1; i < rows.length - 1; i += 2) {
    for (let j = 2; j < rows[i].children.length - 2; j += 2) {
      removeWall(rows[i].children[j]);
      rows[i].children[j + 1].classList.add("arrow", "arrow-left");
    }
    if (i < rows.length - 2) {
      removeWall(rows[i + 1].children[1]);
      rows[i].children[1].classList.add("arrow", "arrow-down");
    }
  }
  let origin = rows[rows.length - 2].children[1];
  origin.style.backgroundColor = "coral";
  const nb_iterations = rows.length * rows[0].children.length;

  const classToDirections = {
    "arrow-right": [0, 1],
    "arrow-down": [1, 0],
    "arrow-left": [0, -1],
    "arrow-up": [-1, 0],
  };
  const directionsToClass = {
    "0, 2": "arrow-right",
    "2, 0": "arrow-down",
    "0, -2": "arrow-left",
    "-2, 0": "arrow-up",
  };

  for (let i = 0; i < nb_iterations; i++) {
    const neighbors = getNeighborsWithDirection(maze, origin);
    const [newOrigin, direction] =
      neighbors[Math.floor(Math.random() * neighbors.length)];

    speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
    origin.style.backgroundColor = "";
    const newDirection =
      directionsToClass[direction[0] * 2 + ", " + direction[1] * 2];
    origin.classList.add("arrow");
    origin.classList.replace(origin.classList[2], newDirection);

    origin = newOrigin;
    const newOriginArrow = origin.classList[2];
    origin.style.backgroundColor = "coral";

    const [row, col] = getCellPosition(origin);
    const wall = maze.children[row - direction[0]].children[col - direction[1]];
    if (wall.classList.contains("wall")) {
      removeWall(wall);
      const [row2, col2] = classToDirections[newOriginArrow];
      const newWall = maze.children[row + row2].children[col + col2];
      addWall(newWall);
    }
  }
  speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
  const arrows = Array.from(maze.getElementsByClassName("arrow"));
  for (let arrow of arrows) {
    const classesToRemove = [];
    for (let className of arrow.classList) {
      if (className.startsWith("arrow")) {
        classesToRemove.push(className);
      }
    }
    for (let className of classesToRemove) {
      arrow.classList.remove(className);
    }
  }
  origin.style.backgroundColor = "";
  start.classList.add("start");
  end.classList.add("end");
}

async function pietot() {
  const maze = document.getElementById("maze");
  const rows = maze.children;
  const cols = rows[0].children.length;

  const getCell = (r, c) => rows[r]?.children[c];

  const allCells = [];
  for (let r = 1; r < rows.length; r += 2) {
    for (let c = 1; c < cols; c += 2) {
      const cell = getCell(r, c);
      if (
        cell.classList.contains("cell1") ||
        cell.classList.contains("cell2")
      ) {
        allCells.push([r, c]);
      }
    }
  }

  const visited = new Set();
  const first = allCells[Math.floor(Math.random() * allCells.length)];
  visited.add(first.join(","));
  getCell(first[0], first[1]).classList.add("visited");

  while (visited.size < allCells.length) {
    const visitedArray = Array.from(visited).map((s) =>
      s.split(",").map(Number),
    );
    const target =
      visitedArray[Math.floor(Math.random() * visitedArray.length)];

    const unvisited = allCells.filter((c) => !visited.has(c.join(",")));
    if (!unvisited.length) break;
    const start = unvisited[Math.floor(Math.random() * unvisited.length)];

    const startEl = getCell(start[0], start[1]);
    const targetEl = getCell(target[0], target[1]);

    startEl.classList.add("visited");
    visited.add(start.join(","));

    startEl.style.backgroundColor = "#00cc00";
    targetEl.style.backgroundColor = "#ff0000";
    if (speed > 0) await new Promise((resolve) => setTimeout(resolve, speed));

    const path = manhattanPath(start, target);
    for (const step of path) {
      const { cell, direction } = step;
      const wall = [cell[0] - direction[0] / 2, cell[1] - direction[1] / 2];

      const cellEl = getCell(cell[0], cell[1]);
      const wallEl = getCell(wall[0], wall[1]);

      if (wallEl) {
        wallEl.classList.remove("wall");
        wallEl.classList.add("visited");
      }

      if (visited.has(cell.join(","))) break;

      cellEl.classList.add("visited");
      visited.add(cell.join(","));

      if (speed > 0) await new Promise((resolve) => setTimeout(resolve, speed));
      cellEl.style.backgroundColor = "";
    }

    startEl.style.backgroundColor = "";
    targetEl.style.backgroundColor = "";
  }

  maze
    .querySelectorAll(".visited")
    .forEach((cell) => cell.classList.remove("visited"));
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
  speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
  maze
    .querySelectorAll(".visited")
    .forEach((cell) => cell.classList.remove("visited"));
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
        speed > 0 &&
          (await new Promise((resolve) => setTimeout(resolve, speed)));
        removeWall(rows[wallCoordinates[0]].children[wallCoordinates[1]]);
        cells = [];
      } else {
        const cellCoordinates = getCellPosition(rows[i].children[j]);
        const wallCoordinates = [
          cellCoordinates[0],
          cellCoordinates[1] + eastDirection[1],
        ];
        speed > 0 &&
          (await new Promise((resolve) => setTimeout(resolve, speed)));
        removeWall(rows[wallCoordinates[0]].children[wallCoordinates[1]]);
      }
    }
  }
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
  const colors = [];

  while ((remainningCells = getRemainningCells(maze)).length) {
    const start =
      remainningCells[Math.floor(Math.random() * remainningCells.length)];
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
    const rdmColor = getRandomColor(colors);
    colors.push(rdmColor);
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
  speed > 0 && (await new Promise((resolve) => setTimeout(resolve, speed)));
  removeColors(maze);
}

function manhattanPath(a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];

  let directions = [];
  for (let i = 0; i < Math.abs(dx / 2); i++)
    directions.push([dx > 0 ? 2 : -2, 0]);
  for (let i = 0; i < Math.abs(dy / 2); i++)
    directions.push([0, dy > 0 ? 2 : -2]);

  directions.sort(() => Math.random() - 0.5);

  let current = [...a];
  return directions.map((d) => {
    current = [current[0] + d[0], current[1] + d[1]];
    return { cell: [...current], direction: d };
  });
}
