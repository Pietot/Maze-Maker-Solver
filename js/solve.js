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

function cleanGrid() {
  isRunning = false;
  const cells = document.querySelectorAll(".viewed, .marked, .path");
  cells.forEach((cell) => {
    cell.classList.remove("viewed", "marked", "path");
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
        rows[newRow].children[newCol].classList.contains(className)
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
    if (cell.classList.contains("start") || cell.classList.contains("end")) {
      cell.classList.add("path");
    }
    cell.classList.replace("marked", "path");
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
    if (current.classList.contains("wall")) {
      continue;
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
      getDirectionPriority(getCellPosition(current), getCellPosition(end))
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

  showPath(path);
}

async function bfs() {
  isRunning = true;
  const maze = document.querySelector(".maze");
  const start = document.querySelector(".start");
  const end = document.querySelector(".end");
  const queue = [start];
  const cameFrom = new Map();

  let isEndReached = false;
  let current = start;
  let visited = new Set();
  cameFrom.set(start, null);

  while (queue.length > 0 && !isEndReached && isRunning) {
    current = queue.shift();
    if (current === end) {
      break;
    }
    if (current.classList.contains("wall")) {
      continue;
    }
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);
    const neighbors = getCellNeighbors(maze, current);
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
        cameFrom.set(neighbor, current);
        if (neighbor !== start && neighbor !== end && isRunning) {
          speed && await new Promise((resolve) => setTimeout(resolve, speed / 3));
          neighbor.classList.add("marked");
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

  showPath(path);
}
