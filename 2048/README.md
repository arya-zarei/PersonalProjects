# 2048 Game

This is a Python implementation of the popular game 2048 using the Pygame library.

## How to Play

- Use the arrow keys to move the tiles in the desired direction.
- Tiles with the same number merge into one when they touch. 
- Keep merging tiles to reach 2048!
- If no merges can be made the game is over. 

## Screenshots
![Screenshot 2024-05-28 140553](https://github.com/arya-zarei/PersonalProjects/assets/132939550/c8211be8-0550-47e1-8e31-4cfb26c2b95c)
![Screenshot 2024-05-28 143851](https://github.com/arya-zarei/PersonalProjects/assets/132939550/da6a5b30-b9b7-4cfd-a636-2a0fdb35cfef)
![Screenshot 2024-05-28 142434](https://github.com/arya-zarei/PersonalProjects/assets/132939550/539484a5-d4ce-470f-96c5-6b08a90b49a1)


## Features

- Colorful UI with smooth animations.
- Game logic closely matching the original 2048 game.
- Simple and intuitive controls.
- **Tile Class**: Represents each number tile on the game board, storing value, position, and color.
- **Grid Representation**: Game board represented as a grid of tiles, managed in a dictionary.
- **Tile Movement**: Functions for moving tiles in four directions, handling merging, game boundaries and updating positions.
- **Game Loop**: Controls game flow, including user inputs, state updates, and rendering.
- **Game Over Check**: Checks for game over conditions, such as no possible moves or reaching 2048.
- **Random Tile Generation**: Generates random positions for new tiles on the board (two for the beginning of the game) and 2 and 4 blocks throughout the game on each move.
- **Display Message**: Function to display messages on the screen, such as game win or loss and then closes the screen after a two second delay.
