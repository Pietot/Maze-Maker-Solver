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

let speed = 50;
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
      speed = parseInt(this.getAttribute("value"));
    }
  };
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

function scultGrid() {
  fillGrid();
  const maze = document.getElementById("maze");
  const cells = maze.querySelectorAll(".cell1, .cell2");
  cells.forEach((cell) => {
    const [row, col] = getCellPosition(cell);
    if (row % 2 === 1 && col % 2 === 1) {
      cell.classList.remove("wall");
    }
  });
}

function fillGrid() {
  const maze = document.getElementById("maze");
  clearGrid();
  const cells = maze.querySelectorAll(".cell1, .cell2");
  cells.forEach((cell) => cell.classList.add("wall"));
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

function getNeighbors(maze, cell) {
  const [row, col] = getCellPosition(cell);
  const rows = maze.children;
  const neighbors = [];
  if (row > 1 && rows[row - 2].children[col].classList.contains("wall")) {
    neighbors.push(rows[row - 2].children[col]);
  }
  if (
    col < rows[0].children.length - 2 &&
    rows[row].children[col + 2].classList.contains("wall")
  ) {
    neighbors.push(rows[row].children[col + 2]);
  }
  if (
    row < rows.length - 2 &&
    rows[row + 2].children[col].classList.contains("wall")
  ) {
    neighbors.push(rows[row + 2].children[col]);
  }
  if (col > 1 && rows[row].children[col - 2].classList.contains("wall")) {
    neighbors.push(rows[row].children[col - 2]);
  }
  return neighbors;
}

function getNeighborsWithDirection(maze, cell) {
  const [row, col] = getCellPosition(cell);
  const rows = maze.children;
  const neighbors = [];
  if (
    (row > 1 && rows[row - 2].children[col].classList.contains("wall")) ||
    (row > 1 && rows[row - 2].children[col].getAttribute("opacity"))
  ) {
    // Up
    neighbors.push([rows[row - 2].children[col], [-1, 0]]);
  }
  if (
    (col < rows[0].children.length - 2 &&
      rows[row].children[col + 2].classList.contains("wall")) ||
    (col < rows[0].children.length - 2 &&
      rows[row].children[col + 2].getAttribute("opacity"))
  ) {
    // Right
    neighbors.push([rows[row].children[col + 2], [0, 1]]);
  }
  if (
    (row < rows.length - 2 &&
      rows[row + 2].children[col].classList.contains("wall")) ||
    (row < rows.length - 2 &&
      rows[row + 2].children[col].getAttribute("opacity"))
  ) {
    // Down
    neighbors.push([rows[row + 2].children[col], [1, 0]]);
  }
  if (
    (col > 1 && rows[row].children[col - 2].classList.contains("wall")) ||
    (col > 1 && rows[row].children[col - 2].getAttribute("opacity"))
  ) {
    // Left
    neighbors.push([rows[row].children[col - 2], [0, -1]]);
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

  maze.querySelectorAll(".cell1, .cell2").forEach((cell) => {
    if (!cell.classList.contains("wall")) {
      cell.style.backgroundColor = getRandomColor();
    }
  });

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
        }, speed);
      });
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
      removeWall(wall);
      removeWall(neighbor);
      stack.push(wall);
      stack.push(neighbor);
    } else {
      const wall = stack.pop();
      wall.classList.add("visited");
      const visited = stack.pop();
      if (stack.length) {
        visited.classList.add("visited");
      }
    }
    await new Promise((resolve) => setTimeout(resolve, speed));
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
      removeWall(wall);
      removeWall(neighbor);
      await new Promise((resolve) => setTimeout(resolve, speed));
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
      removeWall(wall);
      neighbor.style.backgroundColor = "";
      await new Promise((resolve) => setTimeout(resolve, speed));
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
