// Function to generate the grid of the maze (rows and columns, colors, svg)
function generateGrid() {
  const mazeContainer = document.getElementById("maze-container");
  const maze = document.getElementById("maze");
  const squareSide = 40;

  // Clear the maze to not add more rows and columns from the previous grid
  maze.innerHTML = "";

  let mazeWidth = Math.floor((mazeContainer.offsetWidth - 30) / squareSide);
  let mazeHeight = Math.floor((mazeContainer.offsetHeight - 30) / squareSide);

  // Make sure the maze has an odd number of rows and columns (must have for the maze generation algorithm)
  if (mazeWidth % 2 === 0) mazeWidth -= 1;
  if (mazeHeight % 2 === 0) mazeHeight -= 1;

  if (mazeWidth <= 2) mazeWidth = 3;
  if (mazeHeight <= 2) mazeHeight = 3;

  maze.style.width = `${mazeWidth * squareSide}px`;
  maze.style.height = `${mazeHeight * squareSide}px`;

  for (let i = 0; i < mazeHeight; i++) {
    const row = document.createElement("div");
    row.style.display = "flex";
    for (let j = 0; j < mazeWidth; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.style.width = `${squareSide}px`;
      cell.style.height = ` ${squareSide}px`;
      cell.style.backgroundColor =
        (i + j) % 2 === 0 ? "rgb(255, 255, 255)" : "rgb(231, 231, 233)";
      row.appendChild(cell);
    }
    maze.appendChild(row);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  generateGrid();
  window.addEventListener("resize", generateGrid);
});
