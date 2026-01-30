class MinHeapComparator {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  push(value) {
    this.heap.push(value);
    this.heapifyUp();
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return min;
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (
      this.getParentIndex(index) >= 0 &&
      this.comparator(this.heap[index], this.heap[this.getParentIndex(index)]) <
        0
    ) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  heapifyDown() {
    let index = 0;
    while (this.getLeftChildIndex(index) < this.heap.length) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (
        this.getRightChildIndex(index) < this.heap.length &&
        this.comparator(
          this.heap[this.getRightChildIndex(index)],
          this.heap[smallerChildIndex],
        ) < 0
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }
      if (this.comparator(this.heap[index], this.heap[smallerChildIndex]) <= 0)
        break;

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }
}

let isRunning = false;

document.getElementById("solve").addEventListener("click", function () {
  isRunning = false;
  cleanGrid();
  const select = document.getElementById("select-solving");
  const algorithm = select.options[select.selectedIndex].value;
  switch (algorithm) {
    case "dfs":
      cleanGrid();
      dfs();
      break;
    case "bfs":
      cleanGrid();
      bfs();
      break;
    case "gbfs":
      cleanGrid();
      gbfs();
      break;
    case "a*":
      cleanGrid();
      aStar();
      break;
    default:
      break;
  }
});

document.getElementById("maze").onmousedown = cleanGrid;

function cleanGrid() {
  isRunning = false;
  const cells = Array.from(document.querySelectorAll(".cell1, .cell2"));
  cells.forEach((cell) => {
    cell.classList.remove("viewed", "marked", "path");
    cell.style.removeProperty("background-color");
  });
}

function getCellNeighbors(maze, cell, directions = null) {
  const [row, col] = getCellPosition(cell);
  const rows = maze.children;
  const neighbors = [];
  const classNames = ["wall", "viewed", "marked"];
  const searchDirections = directions || [
    [-1, 0], // Up
    [0, 1], // Right
    [1, 0], // Down
    [0, -1], // Left
  ];

  searchDirections.forEach(([directionRow, directionCol]) => {
    const newRow = row + directionRow;
    const newCol = col + directionCol;
    if (
      newRow >= 0 &&
      newRow < rows.length &&
      newCol >= 0 &&
      newCol < rows[newRow].children.length &&
      !classNames.some((className) =>
        rows[newRow].children[newCol].classList.contains(className),
      )
    ) {
      neighbors.push(rows[newRow].children[newCol]);
    }
  });

  return neighbors;
}

async function showPath(path) {
  for (let cell of path) {
    if (!isRunning) {
      break;
    }
    cell.style.removeProperty("background-color");
    cell.classList.replace("marked", "path");
    // For BFS, cells don't have "marked" class
    cell.classList.add("path");
    speed > 0 &&
      (await new Promise((resolve) => setTimeout(resolve, speed / 3)));
  }
}

async function dfs() {
  isRunning = true;
  function getDirectionPriority(start, end) {
    const directions = [
      [-1, 0], // Up
      [0, 1], // Right
      [1, 0], // Down
      [0, -1], // Left
    ];

    directions.sort((a, b) => {
      const distanceA =
        Math.abs(start[0] + a[0] - end[0]) + Math.abs(start[1] + a[1] - end[1]);
      const distanceB =
        Math.abs(start[0] + b[0] - end[0]) + Math.abs(start[1] + b[1] - end[1]);
      return distanceB - distanceA; // Reverse order
    });

    return directions;
  }

  const maze = document.querySelector(".maze");
  const start = document.querySelector(".start");
  const end = document.querySelector(".end");
  const stack = [start];
  const cameFrom = new Map();

  let isEndReached = false;
  let current = start;
  let visited = new Set();
  cameFrom.set(start, null);

  while (stack.length > 0 && !isEndReached) {
    current = stack.pop();
    if (current === end) {
      break;
    }
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);
    speed > 0 &&
      (await new Promise((resolve) => setTimeout(resolve, speed / 2)));
    if (current !== start && isRunning) {
      current.classList.replace("viewed", "marked");
    }
    const neighbors = getCellNeighbors(
      maze,
      current,
      getDirectionPriority(getCellPosition(current), getCellPosition(end)),
    );
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        cameFrom.set(neighbor, current);
        if (neighbor !== start && neighbor !== end && isRunning) {
          neighbor.classList.add("viewed");
        }
        if (neighbor === end) {
          isEndReached = true;
          cameFrom.set(end, current);
          break;
        }
      }
    }
  }

  // Reconstruct the path
  const path = [];
  let step = end;
  while (step) {
    path.push(step);
    step = cameFrom.get(step);
  }
  path.reverse();

  if (path[0] === start && isRunning) {
    showPath(path);
  }
}

async function bfs() {
  isRunning = true;
  let isEndReached = false;

  const maze = document.getElementById("maze");
  const start = document.querySelector(".start");
  const end = document.querySelector(".end");

  let queue = [start];
  const cameFrom = new Map();
  const distance = new Map();
  const visited = new Set();

  distance.set(start, 0);
  cameFrom.set(start, null);
  visited.add(start);

  const colors = [
    [29, 198, 207],
    [39, 82, 214],
    [173, 22, 196],
    [255, 0, 238],
    [255, 0, 0],
  ];

  const cycleLength = getShortestPathLength() + 1;
  start.style.backgroundColor = `rgb(${colors[0][0]},${colors[0][1]},${colors[0][2]})`;

  while (queue.length > 0 && !isEndReached && isRunning) {
    const nextLevelQueue = [];
    const cellsToUpdate = [];

    for (const current of queue) {
      if (current === end) {
        isRunning = false;
        break;
      }

      const neighbors = getCellNeighbors(maze, current);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          cameFrom.set(neighbor, current);

          const d = distance.get(current) + 1;
          distance.set(neighbor, d);
          nextLevelQueue.push(neighbor);

          const t = (d % cycleLength) / cycleLength;
          const scaledT = t * (colors.length - 1);
          const idx = Math.floor(scaledT);
          const weight = scaledT - idx;
          const c1 = colors[idx],
            c2 = colors[idx + 1] || c1;

          const r = (c1[0] * (1 - weight) + c2[0] * weight) | 0;
          const g = (c1[1] * (1 - weight) + c2[1] * weight) | 0;
          const b = (c1[2] * (1 - weight) + c2[2] * weight) | 0;

          cellsToUpdate.push({
            cell: neighbor,
            color: `rgb(${r},${g},${b})`,
          });
          if (neighbor === end) {
            isEndReached = true;
            cameFrom.set(end, current);
            break;
          }
        }
      }
    }
    if (cellsToUpdate.length > 0) {
      for (const item of cellsToUpdate) {
        item.cell.style.backgroundColor = item.color;
      }
    }
    queue = nextLevelQueue;

    if (speed && isRunning) {
      await new Promise((r) => setTimeout(r, speed));
    }
  }

  // Reconstruct the path
  const path = [];
  let step = end;
  while (step) {
    path.push(step);
    step = cameFrom.get(step);
  }
  path.reverse();

  if (path[0] === start && isRunning) {
    showPath(path);
  }
}

async function gbfs() {
  // Heuristic function to calculate the Manhattan distance
  function heuristic(cell) {
    const [startRow, startCol] = getCellPosition(cell);
    const [endRow, endCol] = getCellPosition(end);
    return Math.abs(startRow - endRow) + Math.abs(startCol - endCol);
  }

  isRunning = true;
  const maze = document.getElementById("maze");
  const start = document.querySelector(".start");
  const end = document.querySelector(".end");

  const cellsToExplore = new MinHeapComparator((a, b) => a[1] - b[1]);
  cellsToExplore.push([start, heuristic(start)]);
  const cameFrom = new Map();
  cameFrom.set(start, null);

  while (cellsToExplore.heap.length > 0 && isRunning) {
    const [current, _] = cellsToExplore.pop();
    if (current === end) {
      break;
    }

    if (current.classList.contains("marked")) {
      continue;
    }

    speed > 0 &&
      (await new Promise((resolve) => setTimeout(resolve, speed / 2)));

    if (
      !current.classList.contains("start") &&
      !current.classList.contains("end") &&
      isRunning
    ) {
      current.classList.replace("viewed", "marked");
    }

    const neighbors = getCellNeighbors(maze, current);
    for (let neighbor of neighbors) {
      if (!cameFrom.has(neighbor)) {
        cameFrom.set(neighbor, current);
        cellsToExplore.push([neighbor, heuristic(neighbor)]);

        if (neighbor !== start && neighbor !== end && isRunning) {
          neighbor.classList.add("viewed");
        }
      }
    }
  }

  // Reconstruct the path
  const path = [];
  let step = end;
  while (step) {
    path.push(step);
    step = cameFrom.get(step);
  }
  path.reverse();

  if (path[0] === start && isRunning) {
    showPath(path);
  }
}

async function aStar() {
  // Heuristic function to calculate the Manhattan distance
  function heuristic(cell) {
    const [startRow, startCol] = getCellPosition(cell);
    const [endRow, endCol] = getCellPosition(end);
    return (
      Math.abs(startRow - endRow) + Math.abs(startCol - endCol) * Math.sqrt(2)
    );
  }

  isRunning = true;
  const maze = document.getElementById("maze");
  const start = document.querySelector(".start");
  const end = document.querySelector(".end");
  const cost = 1;

  const cellsToExplore = new MinHeapComparator((a, b) => a[1] - b[1]);
  cellsToExplore.push([start, heuristic(start)]);

  // Map to stock path and cost g(n) for each cell
  const cameFrom = new Map();
  // Stock the cost to reach the cell
  const gScore = new Map();

  cameFrom.set(start, null);
  gScore.set(start, 0);

  while (cellsToExplore.heap.length > 0 && isRunning) {
    const [current, _] = cellsToExplore.pop();

    if (current === end) break;

    if (current.classList.contains("marked")) {
      continue;
    }

    speed > 0 &&
      (await new Promise((resolve) => setTimeout(resolve, speed / 2)));
    if (
      !current.classList.contains("start") &&
      !current.classList.contains("end") &&
      isRunning
    ) {
      current.classList.replace("viewed", "marked");
    }

    const neighbors = getCellNeighbors(maze, current);
    for (let neighbor of neighbors) {
      const tentativeGScore = gScore.get(current) + cost;

      // If we found a better path to reach the neighbor
      if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);

        const fScore = tentativeGScore + heuristic(neighbor);
        cellsToExplore.push([neighbor, fScore]);

        if (neighbor !== start && neighbor !== end && isRunning) {
          neighbor.classList.add("viewed");
        }
      }
    }
  }

  // Reconstruct the path
  const path = [];
  let step = end;
  while (step) {
    path.push(step);
    step = cameFrom.get(step);
  }
  path.reverse();

  if (path[0] === start && isRunning) {
    showPath(path);
  }
}

// Use A* just to get the length of the shortest path without visualization
function getShortestPathLength() {
  // Heuristic function to calculate the Manhattan distance
  function heuristic(cell) {
    const [startRow, startCol] = getCellPosition(cell);
    const [endRow, endCol] = getCellPosition(end);
    return (
      Math.abs(startRow - endRow) + Math.abs(startCol - endCol) * Math.sqrt(2)
    );
  }
  const maze = document.getElementById("maze");
  const start = document.querySelector(".start");
  const end = document.querySelector(".end");
  const cost = 1;
  const cellsToExplore = new MinHeapComparator((a, b) => a[1] - b[1]);
  cellsToExplore.push([start, heuristic(start)]);
  const gScore = new Map();
  gScore.set(start, 0);
  while (cellsToExplore.heap.length > 0) {
    const [current, _] = cellsToExplore.pop();
    if (current === end) break;
    const neighbors = getCellNeighbors(maze, current);
    for (let neighbor of neighbors) {
      const tentativeGScore = gScore.get(current) + cost;
      if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
        gScore.set(neighbor, tentativeGScore);
        const fScore = tentativeGScore + heuristic(neighbor);
        cellsToExplore.push([neighbor, fScore]);
      }
    }
  }
  // return the end or the max gScore if not reachable
  return gScore.get(end) || Math.max(...gScore.values());
}
