document.addEventListener("DOMContentLoaded", function () {
  const mazeContainer = document.getElementById("maze-container");
  const maze = document.getElementById("maze");
  console.log(mazeContainer.offsetWidth);
  console.log(maze.offsetWidth % 5);
});