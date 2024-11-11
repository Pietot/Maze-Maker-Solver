document.getElementById("solve").addEventListener("click", function () {
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
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
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
    cell.classList.replace("marked", "path");
    speed > 0 &&
      (await new Promise((resolve) => setTimeout(resolve, speed / 3)));
  }
}

async function dfs() {
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
  const directions = getDirectionPriority(
    getCellPosition(start),
    getCellPosition(end)
  );

  let current = start;
  let visited = new Set();
  cameFrom.set(start, null);

  while (stack.length > 0) {
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
    if (current !== start) {
      current.classList.remove("viewed");
      current.classList.add("marked");
    }
    const neighbors = getCellNeighbors(maze, current, directions);
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        cameFrom.set(neighbor, current);
        if (neighbor !== start) {
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

  showPath(path);
}
