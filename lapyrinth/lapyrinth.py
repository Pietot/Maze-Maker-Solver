"""A program capable of creating mazes with many different algorithms."""


# By Pietot
# Discord : Piétôt#1754 | pietot
# Start : 15/03/2024 at 15h30 FR
# End : 19/03/2024 at 16h30 FR


# v1.1 :
# Start : 19/03/2024 at 16h50 FR
# End : 20/03/2024 at 22h30 FR
# Changelogs : Added numpy loop, type checking, rasing error, better code, better logic and more

# v1.2 :
# Start : 21/03/2024 at 11h00 FR
# End : 04/03/2024
# Changelogs : Minor changes, just improved some code by optimizing it and/or refactoring itand implemented better logic

# v1.3 :
# Start : 13/04/2024
# End : 14/04/2024 at 17h42 FR
# Changelogs : Added Depth First Search algorithm

# v1.4 :
# Start : 15/04/2024 at 14h00 FR
# End : 15/04/2024 at 23h12 FR
# Changelogs : Added Prim's algorithm

# v1.5 :
# Start : 16/04/2024 at 23h15 FR
# End : 17/04/2024 at 18h00 FR
# Changelogs : Added Hunt and Kill algorithm

# v1.6 :
# Start : 24/04/2024 at 20h30 FR
# End : 25/04/2024 at 11h45 FR
# Changelogs : Added Binary Tree algorithm

# v1.7 :
# Start : 21/04/2024 at 11h30 FR
# End : 04/05/2024 at 01h00 FR
# Changelogs : Added Recursive Division algorithm

# v1.8 :
# Start : 06/05/2024 at 00h45 FR
# End : 6/05/2024 at 15h45 FR
# Changelogs : Added Sidewinder algorithm

# v1.9 :
# Start : 06/05/2024 at 21h45 FR
# End : 07/05/2024 at 16h30 FR
# Changelogs : Added Growing Tree algorithm

# v1.10 :
# Start : 18/04/2024 at 12h00 FR
# End : 09/05/2024 at 02h20 FR
# Changelogs : Added Eller's algorithm

# v1.11 :
# Start : 12/05/2024 at 22h00 FR
# End : 12/05/2024 at 22h40 FR
# Changelogs : Added Aldous-Broder algorithm

# v1.12 :
# Start : 13/05/2024 at 10h45 FR
# End : 14/05/2024 at 12h50 FR
# Changelogs : Added Wilson's algorithm

# v1.13 :
# Start : 06/06/2024 at 9h30 FR
# End : 06/06/2024 at 21h00 FR
# Changelogs : Added 3 ways to save the maze (pickle.dump, numpy.save and numpy.savetxt),
#              added 2 way to load the maze (pickle.load, numpy.load) and added requirements.txt

import pickle

import random as rdm

from typing import Generator, Any
from numpy import typing as npt

import numpy as np

from PIL import Image, ImageDraw


class Maze:
    """The Maze class\n
    0 is for pillars, 1 for breakable walls, 2 for visited cells and other for unvisited cells.
    """

    def __init__(
        self,
        *nb_cells_by_sides: int,
        start: tuple[int, int] | None = None,
        end: tuple[int, int] | None = None,
    ) -> None:
        nb_cells_by_sides = nb_cells_by_sides if nb_cells_by_sides else (5, 5)
        self.maze = np.zeros(cells_to_shape(*nb_cells_by_sides), dtype=np.uint)
        self.algorithm: None | str = None
        self.pathfinder: None | str = None
        self.have_value = False
        shape = self.maze.shape[0], self.maze.shape[1]
        self.start = verify_coordinates(start, shape) if start else (1, 0)
        self.end = (
            verify_coordinates(end, shape) if end else (shape[0] - 2, shape[1] - 1)
        )
        self.sculpt_grid()

    def __str__(self) -> str:
        maze = [["# " if value < 2 else "  " for value in row] for row in self.maze]
        return "\n".join("".join(row) for row in maze)

    def __repr__(self) -> str:
        return np.array2string(self.maze, separator=" ")

    def __iter__(self) -> Generator[tuple[tuple[int, int], np.uint16], None, None]:
        # The slice is using to avoid walls/edges. We only want to iterate over the cells.
        for index, value in np.ndenumerate(self.maze[1:-1:2, 1:-1:2]):
            yield (index[0] * 2 + 1, index[1] * 2 + 1), value

    def sculpt_grid(self) -> None:
        """Creates the grid."""
        self.maze[1:-1:2, 2:-1:2] = 1
        self.maze[2:-1:2, 1:-1:2] = 1
        self.maze[1:-1:2, 1:-1:2] = 3
        self.was_scuplted = True

    def set_values(self) -> None:
        """Set a unique value to each cell."""
        indices = np.where(self.maze == 3)
        self.maze[indices] = np.arange(3, 3 + len(indices[0]))

    def set_start_end(self) -> None:
        """Set the entry and the exit of the maze."""
        self.maze[self.start], self.maze[self.end] = (2, 2)

    def remove_walls(self) -> None:
        """Remove all walls inside the maze.

        Returns:
            Maze: The Maze object.
        """
        self.maze[1:-1, 1:-1] = 3

    def kruskal(self) -> None:
        """Applies Kruskal's algorithm to generate a maze.

        It starts by initializing each non-wall cell as unique value.\n
        For each breakable_walls (shuffled) it checks if the cells it connects are different.\n
        If they are, the program picks a value between them randomly
        and change all the other by the chosen value including the wall.\n
        If they are the same, the wall is not destroyed to avoid creating a loop.\n
        Finally, the wall is removed from the list of breakable walls.\n
        This process continues until the list if empty, resulting in a maze
        where each cell is connected to every other cell via a unique path without forming loops.
        """
        if not self.have_value:
            self.set_values()
            self.have_value = True
        breakable_walls = get_breakable_walls(self)
        rdm.shuffle(breakable_walls)
        while breakable_walls:
            coordinates = breakable_walls.pop()
            if coordinates[0] % 2 == 0:
                upper_value = self.maze[coordinates[0] - 1, coordinates[1]]
                bottom_value = self.maze[coordinates[0] + 1, coordinates[1]]
                values = (upper_value, bottom_value)
            else:
                left_value = self.maze[coordinates[0], coordinates[1] - 1]
                right_value = self.maze[coordinates[0], coordinates[1] + 1]
                values = (left_value, right_value)
            if values[0] == values[1]:
                continue
            self.merge_values(coordinates, values)
        self.set_start_end()
        self.algorithm = "Kruskal"

    def randomized_depth_first_search(
        self, start: tuple[int, int] | None = None
    ) -> None:
        """Applies the randomized version of the Depth First Search algorithm to generate a maze.

        It starts by choosing a random cell to start and marking it as visited.\n
        Then it lists all the neighbors of the current cell and shuffles them.\n
        It loops over the unvisited neighbors.\n
        If the neighbor cell has not been visited,
        the wall between the two cells is destroyed and the neighbor becomes the current cell.\n
        This process continues until the current cell has no unvisited neighbors.\n
        Then the algorithm backtracks to the previous cell
        and repeats the process until all cells have been visited.

        Args:
            current_cell (tuple[int, int] | None, optional):
                The current cell being visited. Defaults to None.
        """
        current_cell = (
            start
            if start
            else get_random_cell((self.maze.shape[0], self.maze.shape[1]))
        )
        stack = [current_cell]
        self.maze[current_cell] = 2

        while stack:
            current_cell = stack[-1]
            neighbors = get_neighbors(self, current_cell)

            if not neighbors:
                stack.pop()
            else:
                chosen_neighbor, direction = rdm.choice(neighbors)
                wall_coordinates = (
                    current_cell[0] + direction[0] // 2,
                    current_cell[1] + direction[1] // 2,
                )
                self.maze[wall_coordinates] = 2
                self.maze[chosen_neighbor] = 2
                stack.append(chosen_neighbor)

        self.set_start_end()
        self.algorithm = "Randomized Depth First Search"

    def prim(self, start: tuple[int, int] | None = None) -> None:
        """Applies Prim's algorithm to generate a maze.

        It starts by selecting a starting cell, either specified in parameter or chosen randomly.\n
        Then it lists all its neighbors and adds them to the list of cells to explore.\n
        While there are neighbors to explore, it randomly selects one
        and if it was not explored, the wall between the two cells is destroyed.\n
        Finally it removes the neighbors from the list.

        Args:
            start (tuple[int, int] | None, optional):
                The starting cell coordinates.\n
                Defaults to None, meaning a random starting cell will be chosen within the maze.
        """
        neighbors: list[tuple[tuple[int, int], tuple[int, int]]] = []
        start = (
            start
            if start
            else get_random_cell((self.maze.shape[0], self.maze.shape[1]))
        )
        self.maze[start] = 2
        neighbors.extend(get_neighbors(self, start))
        while neighbors:
            neighbor, direction = rdm.choice(neighbors)
            # Avoid overlapping, maybe this condition can be removed idk
            if self.maze[neighbor] != 2:
                self.maze[neighbor] = 2
                wall_coordinates = (
                    neighbor[0] - direction[0] // 2,
                    neighbor[1] - direction[1] // 2,
                )
                self.maze[wall_coordinates] = 2
            neighbors.remove((neighbor, direction))
            neighbors.extend(get_neighbors(self, neighbor))
        self.set_start_end()
        self.algorithm = "Prim"

    def hunt_and_kill(self, start: tuple[int, int] | None = None) -> None:
        """Applies Hunt and Kill algorithm to generate a maze.

        It starts at a random cell and carves a path to a random unvisited neighbor (kill phase).\n
        If there are no unvisited neighbors,
        it scans the grid for an unvisited cell that is adjacent to a visited one (hunt phase).\n
        The process ends when the hunt phase fails to find any suitable cells.

        Args:
            start (tuple[int, int] | None, optional):
            The starting cell for the algorithm.\n
            Defaults to None, which means a random cell will be chosen.
        """
        cell = (
            start
            if start
            else get_random_cell((self.maze.shape[0], self.maze.shape[1]))
        )

        def hunt() -> tuple[int, int] | None:
            unvisited_cells = np.where(self.maze > 2)
            if not unvisited_cells:
                return None
            unvisited_cells = np.transpose(np.asarray(unvisited_cells))
            for cell_index in unvisited_cells:
                neighbor, direction = get_connection(self, cell_index)
                if neighbor == (0, 0):
                    continue
                self.maze[neighbor] = 2
                wall_coordinates = (
                    neighbor[0] - direction[0] // 2,
                    neighbor[1] - direction[1] // 2,
                )
                self.maze[wall_coordinates] = 2
                cell_index = tuple(cell_index)
                return cell_index
            return None

        while cell:
            self.maze[cell] = 2
            neighbors = get_neighbors(self, cell)

            if neighbors:
                neighbor, direction = rdm.choice(neighbors)
                wall_coordinates = (
                    cell[0] + direction[0] // 2,
                    cell[1] + direction[1] // 2,
                )
                self.maze[wall_coordinates] = 2
                cell = neighbor
            else:
                cell = hunt()

        self.set_start_end()
        self.algorithm = "Hunt and Kill"

    def eller(
        self,
        probability_carve_horizontally: float = 0.5,
        probability_carve_vertically: float = 0.5,
    ) -> None:
        """Applies Eller's algorithm to generate a maze.

        It starts by initializing each non-wall cell as unique value.\n
        For each row, it randomly joins adjacent cells, but only if they are not in the same set.\n
        Then it randomly joins cells to the South, but at least one per set.\n
        This process continues until the last row is reached.\n
        For the last row, it joins all adjacent cells that are not in the same set.\n

        Args:
            probability_carve_horizontally (float, optional): The probability to carve a wall
            and merge two different number.\n
                Defaults to 0.5.
            probability_carve_vertically (float, optional): The probability to carve
            and extend the value of a set to the South.
                Defaults to 0.5.
        """
        if not self.have_value:
            self.set_values()
            self.have_value = True
        probability_carve_horizontally = min(
            1.0, max(0.0, probability_carve_horizontally)
        )
        probability_carve_vertically = min(1.0, max(0.0, probability_carve_vertically))
        rows = self.maze[1:-1:2]
        for row_index, row in enumerate(rows):
            last_row = row_index == len(rows) - 1
            for value_index, _ in enumerate(row[2:-1:2]):
                values = row[value_index * 2 + 1], row[value_index * 2 + 3]
                if last_row and values[0] != values[1]:
                    self.merge_values((row_index * 2 + 1, value_index * 2 + 2), values)
                if (
                    values[0] != values[1]
                    and rdm.random() <= probability_carve_horizontally
                ):
                    self.merge_values((row_index * 2 + 1, value_index * 2 + 2), values)
            if last_row:
                break
            carves = 0
            for value_index, _ in enumerate(row[1:-1:2]):
                if value_index == len(row[1:-1:2]) - 1:
                    values = row[value_index * 2 + 1], row[value_index * 2 - 1]
                else:
                    values = row[value_index * 2 + 1], row[value_index * 2 + 3]
                if (values[0] != values[1] and not carves) or (
                    values[0] == values[1]
                    and not carves
                    and value_index == len(row[1:-1:2]) - 1
                ):
                    wall_coordinates = row_index * 2 + 2, value_index * 2 + 1
                    merge_values = (
                        values[0],
                        self.maze[row_index * 2 + 3, value_index * 2 + 1],
                    )
                    self.merge_values(wall_coordinates, merge_values)
                    carves += 1
                elif rdm.random() <= probability_carve_vertically:
                    wall_coordinates = row_index * 2 + 2, value_index * 2 + 1
                    merge_values = (
                        values[0],
                        self.maze[row_index * 2 + 3, value_index * 2 + 1],
                    )
                    self.merge_values(wall_coordinates, merge_values)
                    carves += 1
                if values[0] != values[1]:
                    carves = 0
        self.set_start_end()
        self.algorithm = "Eller"

    def iterative_division(self) -> None:
        """Applies the Recursive division algorithm but iteratively to generate a maze.

        It starts by dividing the maze into two parts, either horizontally or vertically.
        Then it creates a wall in the middle of the division.
        After that, it creates a carve into the wall.
        This process continues until the maze is fully divided.
        """

        def divide_vertically(width: int, height: int) -> int:
            return width > height if width != height else rdm.getrandbits(1)

        self.remove_walls()
        stack: list[tuple[tuple[int, int], tuple[int, int], tuple[int, int]]] = [
            ((1, 1), (self.maze.shape[0] - 2, self.maze.shape[1] - 2), (0, 0))
        ]

        while stack:
            start_index, end_index, ban = stack.pop()
            height = end_index[0] - start_index[0]
            width = end_index[1] - start_index[1]

            if height < 2 or width < 2:
                continue

            if divide_vertically(width, height):
                wall_columns = [
                    i
                    for i in range(start_index[1], end_index[1] + 1)
                    if i not in (start_index[1], ban[1], end_index[1]) and i % 2 == 0
                ]
                wall_column_index = rdm.choice(wall_columns)
                self.maze[start_index[0] : end_index[0] + 1, wall_column_index] = 0
                entries = [
                    i for i in range(start_index[0], end_index[0] + 1) if i % 2 == 1
                ]
                entry = rdm.choice(entries)
                entry_coordinate = (entry, wall_column_index)
                self.maze[entry, wall_column_index] = 3

                stack.append(
                    (
                        (start_index[0], start_index[1]),
                        (end_index[0], wall_column_index - 1),
                        entry_coordinate,
                    )
                )
                stack.append(
                    (
                        (start_index[0], wall_column_index + 1),
                        (end_index[0], end_index[1]),
                        entry_coordinate,
                    )
                )
            else:
                wall_rows = [
                    i
                    for i in range(start_index[0], end_index[0] + 1)
                    if i not in (start_index[0], ban[0], end_index[0]) and i % 2 == 0
                ]
                wall_row_index = rdm.choice(wall_rows)
                self.maze[wall_row_index, start_index[1] : end_index[1] + 1] = 0
                entries = [
                    i for i in range(start_index[1], end_index[1] + 1) if i % 2 == 1
                ]
                entry = rdm.choice(entries)
                entry_coordinate = (wall_row_index, entry)
                self.maze[wall_row_index, entry] = 3

                stack.append(
                    (
                        (start_index[0], start_index[1]),
                        (wall_row_index - 1, end_index[1]),
                        entry_coordinate,
                    )
                )
                stack.append(
                    (
                        (wall_row_index + 1, start_index[1]),
                        (end_index[0], end_index[1]),
                        entry_coordinate,
                    )
                )

        self.set_start_end()
        self.algorithm = "Iterative division"

    def binary_tree(
        self, user_biais: int = 0, probability_carve_vertically: float = 0.5
    ) -> None:
        """Applies the Binary Tree algorithm to generate a maze.

        It starts by iterating over the maze and checking if the cell is a path.\n
        Then looks for neighbors corresponding to the biais.\n
        For example, by default the biais is ((-2, 0), (0, -2)) for nortwest.\n
        So it will look for the neighbors at (-2, 0) and (0, -2).\n
        After choosing randomly a neighbor, it will destroy the wall between the two cells.\n

        Here are the different biais you can choose from :\n
        0 = Northwest (default) \n
        1 = Northeast\n
        2 = Southwest\n
        3 = Southeast\n
        4 = Random\n

        Args:
            user_biais (int, optional): The biais to choose from.
                Defaults to 0.\n
            probability_carve_vertically (float, optional):
                The probability to carve a wall vertically.
                Defaults to 0.5.
        """
        probability_carve_vertically = (
            min(1.0, max(0.0, probability_carve_vertically))
            if probability_carve_vertically
            else 0.5
        )
        match user_biais:
            case 0:
                nb_rotation = 0
            case 1:
                nb_rotation = -1
            case 2:
                nb_rotation = -2
            case 3:
                nb_rotation = 1
            case 4:
                nb_rotation = rdm.choice([0, 1, 2, -1])
            case _:
                raise ValueError("biais must be between 1 and 4")
        self.maze[1][1:-1] = 2
        self.maze[1:-1, 1] = 2
        north_biais, west_biais = (1, 1)
        for index, _ in np.ndenumerate(self.maze[3:-1:2, 3:-1:2]):
            if rdm.random() <= probability_carve_vertically:
                wall_coordinates = (index[0] * 2 + 3 - north_biais, index[1] * 2 + 3)
                self.maze[wall_coordinates] = 2
            else:
                wall_coordinates = (index[0] * 2 + 3, index[1] * 2 + 3 - west_biais)
                self.maze[wall_coordinates] = 2
        if nb_rotation:
            self.maze = np.rot90(self.maze, nb_rotation)
        self.set_start_end()
        self.algorithm = "Binary Tree"

    def sidewinder(self, probability_carve_north: float = 0.5) -> None:
        """Applies the Sidewinder algorithm to generate a maze.

        It starts by carving the second row.\n
        Then it iterates over the maze.\n
        If we are in the second row in a wall, we continue.\n
        Else, we add the cell to a list.\n
        Then if the probability we set is True or if we are at the last cell of the row,
        we choose a random cell from the list and destroy the wall to the North.\n
        Else, we destroy the wall to the East.

        Args:
            probability (float, optional): The probability to carve an entry to the North.\n
            The higher the value is, the more the maze will have a column shape.\n
            The lower the value is, the more the maze will have a row shape.\n
            Defaults to 0.5.
        """
        probability_carve_north = min(1.0, max(0.0, probability_carve_north))
        east_direction = (0, 1)
        north_direction = (-1, 0)
        set_cells: list[tuple[int, int]] = []
        self.maze[1][1:-1] = 2
        for index, value in self:
            # If we are in the second row or if the cell is a wall
            if index[0] == 1 or value < 2:
                continue
            set_cells.append(index)
            if (
                rdm.random() <= probability_carve_north
                or index[1] == self.maze.shape[1] - 2
            ):
                chosen_cell = rdm.choice(set_cells)
                wall_coordinates = (
                    chosen_cell[0] + north_direction[0],
                    chosen_cell[1] + north_direction[1],
                )
                self.maze[wall_coordinates] = 2
                set_cells.clear()
            else:
                wall_coordinates = (
                    index[0] + east_direction[0],
                    index[1] + east_direction[1],
                )
                self.maze[wall_coordinates] = 2
        self.set_start_end()
        self.algorithm = "Sidewinder"

    def growing_tree(
        self,
        start: tuple[int, int] | None = None,
        mode: str = "newest",
        probability: float | None = None,
    ) -> None:
        """Applies the Growing Tree algorithm to generate a maze.

        It starts by choosing a random cell to start.\n
        Then it adds the cell to a list of cells to explore.\n
        While there are cells to explore, it selects one depending on the mode.\n
        If the mode is 'newest', it will choose the newest cell added to the list.\n
        If the mode is 'middle', it will choose the middle cell added to the list.\n
        If the mode is 'oldest', it will choose the oldest cell added to the list.\n
        If the mode is 'random', it will choose a random cell from the list.\n
        If the mode is 'mixed', it will choose randomly between the newest, the middle,
        the oldest and a random cell.\n
        You can also chose 2 modes at the same time by separating them with a comma
        and setting a probability for the first mode.\n

        Args:
            start (tuple[int, int] | None, optional): The starting cell for the algorithm.\n
                Defaults to None.
            mode (str, optional): The mode for the selection of the cells. Defaults to 'newest'.
            probability (float | None, optional): If two modes are set,
            the probability of the first mode te be chosen.\n
                Defaults to None.
        """
        start = (
            start
            if start
            else get_random_cell((self.maze.shape[0], self.maze.shape[1]))
        )
        cells = [start]
        self.maze[start] = 2
        probability = probability if probability is not None else 1.0
        probability = min(1.0, max(0.0, probability))
        while cells:
            chosen_cell, index = select_cell_by_mode(cells, mode, probability)
            neighbors = get_neighbors(self, chosen_cell)
            if neighbors:
                chosen_neighbor, direction = rdm.choice(neighbors)
                wall_coordinates = (
                    chosen_cell[0] + direction[0] // 2,
                    chosen_cell[1] + direction[1] // 2,
                )
                self.maze[wall_coordinates] = 2
                self.maze[chosen_neighbor] = 2
                cells.append(chosen_neighbor)
            else:
                cells.pop(index)
        self.set_start_end()
        if probability != 1.0:
            probability = round(probability, 2)
            split = str(probability) + "/" + str(1 - probability)
        else:
            split = ""
        self.algorithm = f"Growing Tree ({mode}{split})"

    def aldous_broder(self, start: tuple[int, int] | None = None) -> None:
        """Applies the Aldous-Broder algorithm to generate a maze.

        It starts by choosing a random cell to start and mark it as visited.\n
        While visited cells are less than the total number of cells\n
        It randomly selects a neighbor of the current cell.\n
        Then if the neighbor has not been visited, the wall between the two cells is destroyed
        Finally the neighbor is marked as visited.\n
        This process continues until all cells have been visited.

        Args:
            start (tuple[int, int] | None, optional): The starting cell for the algorithm.
                Defaults to None.
        """
        current_cell = (
            start
            if start
            else get_random_cell((self.maze.shape[0], self.maze.shape[1]))
        )
        height, width = self.maze.shape
        number_cell = (height // 2) * (width // 2)
        visited_cell = 1
        self.maze[current_cell] = 2
        while visited_cell < number_cell:
            rdm_neighbor, rdm_direction = rdm.choice(
                get_neighbors(self, current_cell, return_visited=True)
            )
            if self.maze[rdm_neighbor] != 2:
                self.maze[rdm_neighbor] = 2
                wall_coordinates = (
                    current_cell[0] + rdm_direction[0] // 2,
                    current_cell[1] + rdm_direction[1] // 2,
                )
                self.maze[wall_coordinates] = 2
                visited_cell += 1
            current_cell = rdm_neighbor
        self.set_start_end()
        self.algorithm = "Aldous-Broder"

    def wilson(self) -> None:
        """Applies the Wilson's algorithm to generate a maze.

        It starts by marking a random cell as visited.\n
        Then, from a random cell, it performs a random walk until it reaches a visited cell.\n
        During this walk, if the current cell is already in the path,
        the loop is broken and the path is shortened.\n
        If the current cell is not in the path, it is added to the path.\n
        Once a visited cell is reached,
        all cells in the path are marked as visited and the walls between them are removed.\n
        This process is repeated until all cells have been visited.\n
        """
        end = get_random_cell((self.maze.shape[0], self.maze.shape[1]))
        self.maze[end] = 2
        while np.any(self.maze > 2):
            unvisited_cells = np.argwhere(self.maze > 2).tolist()
            start = rdm.choice(unvisited_cells)
            start = (start[0], start[1])
            path = [start]
            while self.maze[path[-1]] != 2:
                current_cell = path[-1]
                neighbors = get_neighbors(self, current_cell, return_visited=True)
                neighbor, _ = rdm.choice(neighbors)
                if len(path) > 1 and neighbor == path[-2]:
                    path.pop()
                elif neighbor in path:
                    index = path.index(neighbor)
                    path = path[: index + 1]
                else:
                    path.append(neighbor)
            for index in path:
                if index == start:
                    self.maze[index] = 2
                else:
                    self.maze[index] = 2
                    direction = (
                        index[0] - path[path.index(index) - 1][0],
                        index[1] - path[path.index(index) - 1][1],
                    )
                    wall_coordinates = (
                        index[0] - direction[0] // 2,
                        index[1] - direction[1] // 2,
                    )
                    self.maze[wall_coordinates] = 2
        self.set_start_end()
        self.algorithm = "Wilson"

    def merge_values(
        self, wall_coordinate: tuple[int, int] | list[int], values: tuple[int, int]
    ) -> None:
        """Destroys a wall and merging the values.

        Args:
            wall_coordinate (tuple[int, int] | list[int]): The wall coordinates.
            values (tuple[int, int]): The values to merge.
        """
        selected_value = values[0]
        value_to_replace = values[1]
        self.maze[self.maze == value_to_replace] = selected_value
        self.maze[wall_coordinate] = selected_value

    def make_imperfect_maze(self, mode: tuple[str, int | float]) -> None:
        """Make the maze more complex by removing some walls randomly.

        Args:
            mode (tuple[str, int | float]): The mode to remove walls.
            The first element is the mode ('number' or 'probability').
            The second element is the number of walls to remove or the probability to remove a wall.
        """
        breakable_walls_coordinates = get_breakable_walls(self)
        if float(mode[1]) == 0.0:
            raise ValueError(
                "The number of walls to remove or the probab must be greater than 0"
            )
        if mode[0] == "number":
            # Force the number to be between 0 and the number of breakable walls
            number = max(0, min(int(mode[1]), len(breakable_walls_coordinates)))
            for coordinates in rdm.sample(breakable_walls_coordinates, number):
                self.maze[coordinates] = 2
        elif mode[0] == "probability":
            # Force the probability to be between 0 and 1
            probability = max(0, min(1, mode[1]))
            for coordinates in breakable_walls_coordinates:
                if 0 < rdm.uniform(0, 1) <= probability:
                    self.maze[coordinates] = 2
        else:
            raise ValueError('mode must be "probability" or "number"')

    def generate_image(self, filename: str | None = None) -> None:
        """Generate a maze image from a maze object."""
        size = self.maze.shape
        filename = (
            filename + ".png"
            if filename
            else f"Maze_{size[0]//2}x{size[1]//2}_{self.algorithm}.png"
        )
        cell_size = 50
        wall_color = (0, 0, 0)

        image = Image.new(
            "RGB", (size[1] * cell_size, size[0] * cell_size), (255, 255, 255)
        )
        draw = ImageDraw.Draw(image)

        for index, cell_value in np.ndenumerate(self.maze):
            x1 = index[1] * cell_size
            y1 = index[0] * cell_size
            x2 = (index[1] + 1) * cell_size
            y2 = (index[0] + 1) * cell_size

            if index == self.start:
                draw.rectangle((x1, y1 + 1, x2, y2), fill=(255, 0, 0))
            elif index == self.end:
                draw.rectangle((x1, y1 + 1, x2, y2), fill=(255, 255, 0))
            elif int(cell_value) < 2:
                draw.rectangle((x1, y1, x2, y2), fill=wall_color)

        image.save(filename)

    def save_maze(self, filename: str) -> None:
        """Save the maze to a pickle file or a binary file or a txt file.

        Pickle file is recommanded because it saves the object with all its attributes
        and it's easier to load.\n
        Binary file is used to only store the array of the because it saves and loads faster.\n
        Additionally, it stores the maze without loss of accuracy.\n
        Texte file is useful for editing and compatibility and it takes less space.

        Args:
            filename (str | None): The name of the file. Defaults to None.

        Raises:
            ValueError: file_type must be 'npy' or 'txt'.
        """
        file_type = filename.split(".")[-1]
        size = self.maze.shape
        filename = (
            f"{filename}"
            if filename
            else f"Maze_{size[0]//2}x{size[1]//2}_{self.algorithm}"
        )
        match file_type:
            case "pkl":
                with open(filename, "wb") as file:
                    pickle.dump(self, file)
            case "npy":
                np.save(filename, self.maze)
            case "txt":
                np.savetxt(filename, self.maze, fmt="%d", delimiter=",")
            case _:
                raise ValueError("filename must end with 'pkl' or 'npy' or 'txt'")

    def load_maze(self, file: str) -> None:
        """Load a maze from a binary file or a txt file.

        Args:
            file (str): The location of the file.

        Raises:
            ValueError: file must be a '.npy' or '.txt' file.
        """
        if file.endswith(".npy"):
            loaded_maze = np.load(file)
        elif file.endswith(".txt"):
            loaded_maze = np.loadtxt(file, delimiter=",", dtype=np.uint)
        else:
            raise ValueError("file must be a '.npy' or '.txt' file")
        if not verify_shape(loaded_maze.shape):
            raise ValueError("The file contain an invalid maze shape")
        if not np.all(0 <= loaded_maze) and not np.all(loaded_maze == 1):
            raise ValueError("The file contain an invalid maze")
        self.maze = loaded_maze


def cells_to_shape(*nb_cells_by_side: int) -> tuple[int, int]:
    """Convert the number of cells of each dimension (height, width) to the shape of the maze.

    Raises:
        ValueError: nb_cells_by_side must be an one or two int greater or equal to 2.

    Returns:
        tuple[int, int]: The shape of the maze.
    """
    if len(nb_cells_by_side) == 1 and nb_cells_by_side[0] >= 2:
        shape = (nb_cells_by_side[0] * 2 + 1, nb_cells_by_side[0] * 2 + 1)
        return shape
    if len(nb_cells_by_side) == 2 and all(cells >= 2 for cells in nb_cells_by_side):
        shape = (nb_cells_by_side[0] * 2 + 1, nb_cells_by_side[1] * 2 + 1)
        return shape
    raise ValueError("nb_cells_by_side must be an one or two int greater or equal to 2")


def verify_coordinates(
    end: Any | tuple[Any, ...], shape: tuple[int, int]
) -> tuple[int, int]:
    """Verifies if the end coordinates are valid.

    Args:
        end (Any): The end coordinates.
        shape (tuple[int, int]): The shape of the maze.

    Returns:
        bool: True if the end coordinates are valid, False otherwise.
    """
    if not isinstance(end, tuple):
        raise ValueError(
            "end must be a tuple of 2 ints corresponding to a point inside the maze"
        )
    if not len(end) == 2:
        raise ValueError(
            "end must be a tuple of 2 ints corresponding to a point inside the maze"
        )
    if not all(isinstance(i, int) for i in end):
        raise ValueError(
            "end must be a tuple of 2 ints corresponding to a point inside the maze"
        )
    if not (0 <= end[0] <= shape[0] and 0 <= end[1] <= shape[1]):
        raise ValueError(
            "end must be a tuple of 2 ints corresponding to a point inside the maze"
        )
    return end


def verify_shape(shape: Any | tuple[Any, ...]) -> bool:
    """Verifies if shape of the maze if an int greater than 5 and odd
    or a tuple of 2 int greater than 5 and odd
    """
    if not isinstance(shape, tuple):
        return False
    if not len(shape) == 2:
        return False
    if not all(isinstance(i, int) for i in shape if i > 4 and i % 2 == 1):
        return False
    return True


def verify_values_maze(maze: npt.NDArray[np.uint]) -> bool:
    """Verifies if the all the values in the maze are ints greater or equal than 0.

    Args:
        maze (npt.NDArray[np.uint]): The maze to verify.

    Returns:
        bool: True if all the values are valid, False otherwise.
    """
    return bool(np.issubdtype(maze.dtype, np.uint) and np.all(maze >= 0))


def get_breakable_walls(self: Maze) -> list[tuple[int, int]]:
    """Gets all breakable walls coordinates.

    Returns:
        list[list[int, int]]: List of all breakable walls coordinates.
    """
    return list(zip(*np.where(self.maze == 1)))


def get_neighbors(
    self: Maze,
    cell: tuple[int, int],
    directions: tuple[tuple[int, int], ...] | None = None,
    return_visited: bool = False,
) -> list[tuple[tuple[int, int], tuple[int, int]]]:
    """Returns a list of neighboring cells that are accessible from the given cell.

    Args:
        self (Maze): The maze object.
        cell (tuple[int, int]): The coordinates of the cell.
        directions (tuple[tuple[int, int], ...], optional): The directions to check.
        Defaults to None.
        return_visited (bool): If we want to return visited neighbors.
        Defaults to False.

    Returns:
        list[tuple[tuple[int, int], tuple[int, int]]]:
            A list of tuples representing neighboring cells along
            with the direction from the given cell.
    """
    neighbors: list[tuple[tuple[int, int], tuple[int, int]]] = []
    # North, East, South, West
    directions = directions if directions else ((-2, 0), (0, 2), (2, 0), (0, -2))
    for direction in directions:
        neighbor = cell[0] + direction[0], cell[1] + direction[1]
        if (
            1 <= neighbor[0] < self.maze.shape[0]
            and 1 <= neighbor[1] < self.maze.shape[1]
        ):
            if (return_visited and self.maze[neighbor] > 1) or self.maze[neighbor] > 2:
                neighbors.append((neighbor, direction))
    return neighbors


def get_random_cell(shape: tuple[int, int]) -> tuple[int, int]:
    """This function generates a random cell within a given shape.

    Args:
        shape (tuple[int, int]): A tuple representing the dimensions of the shape.
        The first integer is the height and the second integer is the width.

    Returns:
        tuple[int, int]: A tuple representing the coordinates of the randomly generated cell.
    """
    return (rdm.randrange(1, shape[0] - 2, 2), rdm.randrange(1, shape[1] - 2, 2))


def get_connection(
    self: Maze, index: tuple[int, int]
) -> tuple[tuple[int, int], tuple[int, int]]:
    """This method is used to get a connections of an unvisited cell to a visited cell in the maze.

    Args:
        self (Maze): An instance of the Maze class.
        index (tuple[int, int]): A tuple containing the coordinates of the cell in the maze.

    Returns:
        tuple[tuple[int, int], tuple[int, int]]:
        A tuple containing two tuples.\n
        The first tuple is the coordinates of the visited cell.\n
        The second tuple is the direction of the visited cell relative to the unvisited cell.\n
        If no neighbor is connected, returns ((0, 0), (0, 0)).
    """
    neighbors: list[tuple[tuple[int, int], tuple[int, int]]] = []
    # North, East, South, West
    directions = ((-2, 0), (0, 2), (2, 0), (0, -2))
    for row, column in directions:
        neighbor = (index[0] + row, index[1] + column)
        if (
            not 0 <= neighbor[0] < self.maze.shape[0]
            or not 0 <= neighbor[1] < self.maze.shape[1]
        ):
            continue
        if self.maze[neighbor] == 2:
            neighbors.append((neighbor, (row, column)))
    return rdm.choice(neighbors) if neighbors else ((0, 0), (0, 0))


def select_cell_by_mode(
    cells: list[tuple[int, int]], mode: str, probability: float
) -> tuple[tuple[int, int], int]:
    """Choose a cell from a list depending on the selection mode.

    Args:
        cells (list[tuple[int, int]]): A list of cells to choose from.
        mode (str): The selection mode.
        probability (float): The probability to choose the first mode for 2 modes.

    Raises:
        ValueError: If the mod set doesn't exist.

    Returns:
        tuple[int, int]: The chosen cell.
    """
    match mode:
        case "newest":
            chosen_cell, index = cells[-1], -1
        case "middle":
            chosen_cell, index = cells[len(cells) // 2], len(cells) // 2
        case "oldest":
            chosen_cell, index = cells[0], 0
        case "random":
            index = rdm.choice(range(len(cells)))
            chosen_cell = cells[index]
        case "mixed":
            prob = rdm.random()
            if prob <= 0.25:
                chosen_cell, index = cells[-1], -1
            elif prob <= 0.5:
                chosen_cell, index = cells[len(cells) // 2], len(cells) // 2
            elif prob <= 0.75:
                chosen_cell, index = cells[0], 0
            else:
                index = rdm.choice(range(len(cells)))
                chosen_cell = cells[index]
        case "new/mid":
            if rdm.random() <= probability:
                chosen_cell, index = cells[-1], -1
            else:
                chosen_cell, index = cells[len(cells) // 2], len(cells) // 2
        case "new/old":
            if rdm.random() <= probability:
                chosen_cell, index = cells[-1], -1
            else:
                chosen_cell, index = cells[0], 0
        case "new/rand":
            if rdm.random() <= probability:
                chosen_cell, index = cells[-1], -1
            else:
                index = rdm.choice(range(len(cells)))
                chosen_cell = cells[index]
        case "mid/old":
            if rdm.random() <= probability:
                chosen_cell, index = cells[len(cells) // 2], len(cells) // 2
            else:
                chosen_cell, index = cells[0], 0
        case "mid/rand":
            if rdm.random() <= probability:
                chosen_cell, index = cells[len(cells) // 2], len(cells) // 2
            else:
                index = rdm.choice(range(len(cells)))
                chosen_cell = cells[index]
        case "old/rand":
            if rdm.random() <= probability:
                chosen_cell, index = cells[0], 0
            else:
                index = rdm.choice(range(len(cells)))
                chosen_cell = cells[index]
        case _:
            raise ValueError("Invalid mode")
    return chosen_cell, index


def load_object(file_path: str) -> Maze:
    """Load a maze object from a pkl file.

    Args:
        file (str): The location of the file.

    Returns:
        Maze: The loaded maze object.
    """
    with open(file_path, "rb") as file:
        self = pickle.load(file)
    if verify_shape(self.maze.shape) and verify_values_maze(self.maze):
        return self
    raise ValueError("The file contain an invalid maze")


def curious_maze() -> Maze:
    """Don't run this function, it's only for curious people"""
    redflag = Maze()
    redflag.maze = np.array(
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [3, 3, 3, 3, 3, 3, 3, 3, 0],
            [0, 3, 0, 3, 0, 1, 0, 3, 0],
            [0, 3, 1, 3, 1, 3, 3, 3, 0],
            [0, 3, 0, 1, 0, 1, 0, 3, 0],
            [0, 3, 3, 3, 1, 3, 1, 3, 0],
            [0, 3, 0, 1, 0, 3, 0, 3, 0],
            [0, 3, 3, 3, 3, 3, 3, 3, 3],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]
    )
    print(redflag)
    print("Oups... My algorithm generated a curious maze... How do you find it?")
    return redflag
