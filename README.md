# 📍 Maze Maker Solver

![Localisation](https://img.shields.io/badge/Made_in-France-red?labelColor=blue)
![Language](https://img.shields.io/badge/Language-JavaScript-ffdf00)

Maze Maker Solver is a online web page that allows you to understant more easily how maze generating and pathfinding algorithms work. This project is an online visualisation of my previous python package project : **[Lapyrinth](https://github.com/Pietot/Lapyrinth)**

The web page is available : **[here](pietot.github.io/Maze-Maker-Solver/)**

<p align="center">
	<img src="assets/img/page.png">
</p>

## 📋 Summary

### 1. [Features](#1---features)
### 2. [Maze generation algorithms](#2---maze-generation-algorithms)
### 3. [Pathfinding algorithms](#3---pathfinding-algorithms)
### 4. [Improve the project](#4---improve-the-project)
### 5. [Credits](#5---credits)

## 1 - Features

- Choose a generation algorithm among 12 of them:

<p align="center">
	<img src="assets/img/algos.png">
</p>

- Add/remove wall as you want:

<p align="center">
	<img src="assets/img/maze.png" width="75%">
</p>

- Find a path between the start and the end with 4 different algorithms:

<p align="center">
	<img src="assets/img/solve.png" width="30%">
</p>

- Set the speed of the animation

- Download the maze's array as a text file

## 2 - Maze generation algorithms

- **Kruskal's algorithm:**

<p align="center">
	<img src="assets/gifs/kruskal.gif" width="49%" alt="Image illustrating a maze after using Kruskal's algorithm"style="border-radius:10px">
	<img src="assets/img/kruskal.png" width="49%" alt="Animation showing the process of Kruskal's algorithm" style="border-radius:10px"> <br><br>
</p>

- **Randomized Depth-First Search:**

<p align="center">
	<img src="assets/gifs/rdfs.gif" width="49%" alt="Image illustrating a maze after using randomized depth first search algorithm"style="border-radius:10px">
	<img src="assets/img/rdfs.png" width="49%" alt="Animation showing the process of randomized depth first search algorithm" style="border-radius:10px"> <br><br>
</p>

- **Simplified Prim's Algorithm:**

<p align="center">
	<img src="assets/gifs/simplified_prim.gif" width="49%" alt="Image illustrating a maze after using simplified Prim's algorithm"style="border-radius:10px">
	<img src="assets/img/simplified_prim.png" width="49%" alt="Animation showing the process of simplified Prim's algorithm" style="border-radius:10px"> <br><br>
</p>

- **True Prim's Algorithm:**

<p align="center">
	<img src="assets/gifs/true_prim.gif" width="49%" alt="Image illustrating a maze after using true Prim's algorithm"style="border-radius:10px">
	<img src="assets/img/true_prim.png" width="49%" alt="Animation showing the process of true Prim's algorithm" style="border-radius:10px"> <br><br>
</p>

- **Hunt & Kill algorithm:**

<p align="center">
	<img src="assets/gifs/hunt_and_kill.gif" width="49%" alt="Image illustrating a maze after using hunt and kill algorithm"style="border-radius:10px">
	<img src="assets/img/hunt_and_kill.png" width="49%" alt="Animation showing the process of hunt and kill algorithm" style="border-radius:10px"> <br><br>
</p>

- **Eller's algorithm:**

<p align="center">
	<img src="assets/gifs/eller.gif" width="49%" alt="Image illustrating a maze after using Eller's algorithm"style="border-radius:10px">
	<img src="assets/img/eller.png" width="49%" alt="Animation showing the process of Eller's algorithm" style="border-radius:10px"> <br><br>
</p>

- **Iterative Division algorithm:**

<p align="center">
	<img src="assets/gifs/iterative_division.gif" width="49%" alt="Image illustrating a maze after using iterative division algorithm"style="border-radius:10px">
	<img src="assets/img/iterative_division.png" width="49%" alt="Animation showing the process of iterative division algorithm" style="border-radius:10px"> <br><br>
</p>

- **Binary Tree algorithm:**

<p align="center">
	<img src="assets/gifs/binary_tree.gif" width="49%" alt="Image illustrating a maze after using binary tree algorithm"style="border-radius:10px">
	<img src="assets/img/binary_tree.png" width="49%" alt="Animation showing the process of binary tree algorithm" style="border-radius:10px"> <br><br>
</p>

- **Sidewinder algorithm:**

<p align="center">
	<img src="assets/gifs/sidewinder.gif" width="49%" alt="Image illustrating a maze after using sidewinder algorithm"style="border-radius:10px">
	<img src="assets/img/sidewinder.png" width="49%" alt="Animation showing the process of sidewinder algorithm" style="border-radius:10px"> <br><br>
</p>

- **Aldous-Broder's algorithm:**

<p align="center">
	<img src="assets/gifs/aldous_broder.gif" width="49%" alt="Image illustrating a maze after using Aldous-Broder's algorithm"style="border-radius:10px">
	<img src="assets/img/aldous_broder.png" width="49%" alt="Animation showing the process of Aldous-Broder's algorithm" style="border-radius:10px"> <br><br>
</p>

- **Wilson's algorithm:**

<p align="center">
	<img src="assets/gifs/wilson.gif" width="49%" alt="Image illustrating a maze after using Wilson's algorithm"style="border-radius:10px">
	<img src="assets/img/wilson.png" width="49%" alt="Animation showing the process of Wilson's algorithm" style="border-radius:10px"> <br><br>
</p>

- **Origin Shift algorithm:**

<p align="center">
	<img src="assets/gifs/origin_shift.gif" width="49%" alt="Image illustrating a maze after using origin shift algorithm"style="border-radius:10px">
	<img src="assets/img/origin_shift.png" width="49%" alt="Animation showing the process of origin shift algorithm" style="border-radius:10px"> <br><br>
</p>

<br/>

## 3 - Pathfinding algorithms

- **Depth-first Search** _(Fast but gives a long path most of the time)_ **:**

<p align="center">
	<img src="assets/img/dfs_running.png" width="49%">
	<img src="assets/img/dfs_solve.png" width="49%">
</p>

- **Breadth-First Search (Dijkstra)** _(Very slow but gives one of the shortest path)_ **:**

<p align="center">
	<img src="assets/img/bfs_running.png" width="49%">
	<img src="assets/img/bfs_solve.png" width="49%">
</p>

- **Greedy Best-First Search** _(Very fast but does not always give the shortest path)_ **:**

<p align="center">
	<img src="assets/img/gbfs_running.png" width="49%">
	<img src="assets/img/gbfs_solve.png" width="49%">
</p>

- **A\*** _(Slow but gives one of the shortest path)_ **:**

<p align="center">
	<img src="assets/img/a_star_running.png" width="49%">
	<img src="assets/img/a_star_solve.png" width="49%">
</p>

<br/>

## 4 - Improve the project

If you like this project and/or want to help or improve it, you can:

- Create an issue if you find a bug or want to suggest a feature or any improvement (no matter how small it is).

- Create a pull request if you want to add a feature, fix a bug or improve the code.

- Contact me if you want to talk about the project or anything else (Discord: pietot).

> **Note**: If you want to be guided/helped, you already have a file named <a href="improvements.txt">improvements.txt</a> in the project directory, where you can see all the improvements that can be made.

# 5 - Credits

- **[Maze Solver](https://angeluriot.com/maze_solver/)**: The project was inspired by this website.
- **[Angel Uriot](https://angeluriot.com/maze_solver/)**: The original repository of the project.
- **[Lapyrinth](https://github.com/Pietot/Lapyrinth)**: My previous project which pushed me to create this web page.
