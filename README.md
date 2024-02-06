# 3D Tic Tac Toe Game

## Project Description
This project introduces a 4x4x4 grid 3D Tic Tac Toe game for a single player against AI, offering a challenging gameplay experience. The AI adjusts strategically to the player's movements using Alpha-beta pruning combined with the MiniMax algorithm. The three-dimensional layout is designed to discourage ties, thereby increasing interaction and competitiveness. A user-friendly GUI enhances the game's appeal and difficulty, updating the classic Tic Tac Toe game.

## Objective
The main goal is to create an interactive 3D Tic Tac Toe game with a robust AI opponent. The game aims to prevent ties, making it more sophisticated and strategic compared to typical versions. The AI uses a minimax algorithm with alpha-beta pruning and offers three difficulty settings, catering to a range of players from novices to experts.

## Game Rules
- **Objective:** Arrange four markers ('O' or 'X') in a row horizontally, diagonally, or vertically.
- **Players:** Two players - the AI and the human user.
- **Marker Selection:** Players choose between the 'O' and 'X' markers.
- **Gameplay:** Players take turns placing their markers in the grid squares.
- **Winning Condition:** Successfully aligning four markers in a row, column, or diagonal.
- **Draw Condition:** The game is a draw if neither player achieves the winning condition.

## System Flow Diagram
![System Flow Diagram](https://github.com/anveshchidura/3D-TicTacToe/blob/main/system%20flow%20diagram.png)
## Data Flow Diagram
![Data Flow Diagram](https://github.com/anveshchidura/3D-TicTacToe/blob/main/data%20flow%20diagram.png)

## Input Design
The game is developed using JavaScript. Players interact through a board interface, with input controls designed to be intuitive and accessible.

## Min-Max Algorithm
The Minimax algorithm with Alpha-Beta pruning maximizes move selection by anticipating the opponent's best responses. It projects outcomes in strategic games by evaluating potential future moves and choosing a strategy that maximizes the player's advantage.

## Output Design
The output is a responsive graphical user interface, ensuring a consistent gaming experience across various devices.
