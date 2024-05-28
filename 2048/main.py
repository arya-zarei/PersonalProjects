# Python imports for game
import pygame
import random
import math
import pygame.font

pygame.init()

# regulate game speed (per sec)
FPS = 60

# square game dimensions
WIDTH, HEIGHT = 800, 800
ROWS = 4
COLS = 4

# square dimensions
RECT_HEIGHT = HEIGHT // ROWS
RECT_WIDTH = WIDTH // COLS

# RBG game outline color
OUTLINE_COLOR = (187, 173, 160)
# Outline Thickness
OUTLINE_THICKNESS = 10
# RBG game background color
BACKGROUND_COLOR = (205, 192, 180)
# Text font colour
FONT_COLOR = (119, 110, 101)

# Font of screen text
FONT = pygame.font.SysFont("comicsans", 60, bold=True)
#  Speed of which tiles will move (per sec)
MOVE_VEL = 20

# initialize display window for pygame application
WINDOW = pygame.display.set_mode((WIDTH, HEIGHT))
# title caption of window display
pygame.display.set_caption("2048")


class Tile:
    # All Colors used in 2048 number blocks 2-2048
    COLORS = [
        (237, 229, 218),  # 2
        (238, 225, 201),  # 4
        (243, 178, 122),  # 8
        (246, 150, 101),  # 16
        (247, 124, 95),  # 32
        (247, 95, 59),  # 64
        (237, 208, 115),  # 128
        (237, 204, 99),  # 256
        (236, 202, 80),  # 512
        (216, 182, 60),  # 1024
        (196, 162, 40),  # 2048
    ]

    # Tile initialization
    def __init__(self, value, row, col):
        self.value = value
        self.row = row
        self.col = col
        self.x = col * RECT_WIDTH  # x cord for tile
        self.y = row * RECT_HEIGHT  # y cord for tile

    def get_color(self):
        # get log of value minus 1 to get index of color ex. 8 log 2 = 3 - 1 = index 2
        color_index = int(math.log2(self.value)) - 1
        # get and return color at index
        color = self.COLORS[color_index]
        return color

    # draw the
    def draw(self, window):
        # color of rectangle
        color = self.get_color()
        # draw the rectangle at the specific position and color
        pygame.draw.rect(window, color, (self.x, self.y, RECT_WIDTH, RECT_HEIGHT))
        # text to write number in rectangle
        text = FONT.render(str(self.value), 1, FONT_COLOR)
        # display number on the center of square
        window.blit(
            text,
            (
                self.x + (RECT_WIDTH / 2 - text.get_width() / 2),
                self.y + (RECT_HEIGHT / 2 - text.get_height() / 2),
            ),
        )

    # determine which cell in the grid the tile occupies when moving left and right
    def set_pos(self, ceil=False):
        # if rounding up
        if ceil:
            self.row = math.ceil(self.y / RECT_HEIGHT)
            self.col = math.ceil(self.x / RECT_WIDTH)
        # rounding down tile position
        else:
            self.row = math.floor(self.y / RECT_HEIGHT)
            self.col = math.floor(self.x / RECT_WIDTH)

    # move tiles by certain amount based on delta for scenario
    def move(self, delta):
        self.x += delta[0]
        self.y += delta[1]


def draw_grid(window):
    # draw lines for rows
    for row in range(1, ROWS):
        y = row * RECT_HEIGHT
        pygame.draw.line(window, OUTLINE_COLOR, (0, y), (WIDTH, y), OUTLINE_THICKNESS)
    # draw lines for columns
    for col in range(1, COLS):
        x = col * RECT_WIDTH
        pygame.draw.line(window, OUTLINE_COLOR, (x, 0), (x, HEIGHT), OUTLINE_THICKNESS)

    pygame.draw.rect(window, OUTLINE_COLOR, (0, 0, WIDTH, HEIGHT), OUTLINE_THICKNESS)


def draw(window, tiles):
    window.fill(BACKGROUND_COLOR)  # set background color of game

    for tile in tiles.values():
        tile.draw(window)  # draw all tiles before grid lines

    draw_grid(window)
    pygame.display.update()  # update game display


# generate random positions of rows and columns for first two pieces
def get_random_pos(tiles):
    row = None
    col = None
    while True:
        row = random.randrange(0, ROWS)
        col = random.randrange(0, COLS)

        if f"{row}{col}" not in tiles:
            break

    return row, col


# function for movement of tiles
def move_tiles(window, tiles, clock, direction):
    updated = True
    blocks = set()

    # control movement left
    if direction == "left":
        sort_func = lambda x: x.col  # set sort function to x.col
        reverse = False  # if we want to sort to ascending or descending order
        delta = (-MOVE_VEL, 0)  # how much to move each tile by each frame
        boundary_check = lambda tile: tile.col == 0  # check if the tile is on the edge of boundary
        get_next_tile = lambda tile: tiles.get(
            f"{tile.row}{tile.col - 1}")  # get the tile to the left to merge or be blocked
        merge_check = lambda tile, next_tile: tile.x > next_tile.x + MOVE_VEL  # should we merge the tile or not
        move_check = (
            # when we move and are not merging into next tile
            lambda tile, next_tile: tile.x > next_tile.x + RECT_WIDTH + MOVE_VEL
        )
        ceil = True  # round up for location of tile after move

    # control movement right
    elif direction == "right":
        sort_func = lambda x: x.col  # set sort function to x.col
        reverse = False  # if we want to sort to ascending or descending order
        delta = (MOVE_VEL, 0)  # how much to move each tile by each frame
        boundary_check = lambda tile: tile.col == COLS - 1  # check if the tile is on the edge of boundary
        # get the tile to the left to merge or be blocked
        get_next_tile = lambda tile: tiles.get(f"{tile.row}{tile.col + 1}")
        merge_check = lambda tile, next_tile: tile.x < next_tile.x - MOVE_VEL  # should we merge the tile or not
        move_check = (
            # when we move and are not merging into next tile
            lambda tile, next_tile: tile.x + RECT_WIDTH + MOVE_VEL < next_tile.x
        )
        ceil = False  # round down for location of tile after move

    # control movement up
    elif direction == "up":
        sort_func = lambda x: x.row  # set sort function to x.col
        reverse = False  # if we want to sort to ascending or descending order
        delta = (0, -MOVE_VEL)  # how much to move each tile by each frame
        boundary_check = lambda tile: tile.row == 0  # check if the tile is on the edge of boundary
        get_next_tile = lambda tile: tiles.get(
            f"{tile.row - 1}{tile.col}")  # get the tile to the left to merge or be blocked
        merge_check = lambda tile, next_tile: tile.y > next_tile.y + MOVE_VEL  # should we merge the tile or not
        move_check = (
            # when we move and are not merging into next tile
            lambda tile, next_tile: tile.y > next_tile.y + RECT_HEIGHT + MOVE_VEL
        )
        ceil = True  # round up for location of tile after move

    # control movement down
    elif direction == "down":
        sort_func = lambda x: x.row  # set sort function to x.col
        reverse = True  # if we want to sort to ascending or descending order
        delta = (0, MOVE_VEL)  # how much to move each tile by each frame
        boundary_check = lambda tile: tile.row == ROWS - 1  # check if the tile is on the edge of boundary
        get_next_tile = lambda tile: tiles.get(
            f"{tile.row + 1}{tile.col}")  # get the tile to the left to merge or be blocked
        merge_check = lambda tile, next_tile: tile.y < next_tile.y - MOVE_VEL  # should we merge the tile or not
        move_check = (
            # when we move and are not merging into next tile
            lambda tile, next_tile: tile.y + RECT_HEIGHT + MOVE_VEL < next_tile.y
        )
        ceil = False  # round up for location of tile after move

    # when no updated has occurred, break out of loop
    while updated:
        clock.tick(FPS)
        updated = False  # update variable to true if update has occurred
        sorted_tiles = sorted(tiles.values(), key=sort_func, reverse=reverse)  # sort tiles in correct order

        # get the index and tile object
        for i, tile in enumerate(sorted_tiles):
            if boundary_check(tile):
                continue
            # get the tile in the way of current tile
            next_tile = get_next_tile(tile)
            # if no tile in the way move current tile by delta
            if not next_tile:
                tile.move(delta)
            # if the tile and the next tile have the same value and these two tiles have yet not merged
            elif tile.value == next_tile.value and tile not in blocks and next_tile not in blocks:
                # checks if tiles can merge, if not move tile by delta
                if merge_check(tile, next_tile):
                    tile.move(delta)
                else:  # merge check returned false, merge two tiles
                    # multiply tile by two to get next value
                    next_tile.value *= 2
                    # move the tile that merged
                    sorted_tiles.pop(i)
                    # add tile to block so it does not merge again
                    blocks.add(next_tile)
            elif move_check(tile, next_tile):
                tile.move(delta)
            else:
                continue

            # set tile position (moving right mean ceiling is false, left equals true)
            tile.set_pos(ceil)
            # unless else statement occurs something moved
            updated = True

        # remove sorted tiles that no longer exist
        update_tiles(window, tiles, sorted_tiles)

    # check if game is over
    return end_move(tiles)


def end_move(tiles):
    # Check if any tile has reached 2048
    for tile in tiles.values():
        if tile.value == 2048:
            return "won"

        # Check if the board is full
        if len(tiles) == ROWS * COLS:
            # Check if there are no possible moves
            for row in range(ROWS):
                for col in range(COLS):
                    tile = tiles.get(f"{row}{col}")

                    # Check adjacent tiles for possible merges
                    if (
                            (row > 0 and tile.value == tiles.get(f"{row - 1}{col}", Tile(0, 0, 0)).value) or  # Up
                            (row < ROWS - 1 and tile.value == tiles.get(f"{row + 1}{col}",
                                                                        Tile(0, 0, 0)).value) or  # Down
                            (col > 0 and tile.value == tiles.get(f"{row}{col - 1}", Tile(0, 0, 0)).value) or  # Left
                            (col < COLS - 1 and tile.value == tiles.get(f"{row}{col + 1}", Tile(0, 0, 0)).value)  # Right
                    ):
                        return "continue"

            # If no merges possible, the player has lost
            return "lost"

    # if game not over insert new 2 or 4 tile in random position to make game flow continue
    row, col = get_random_pos(tiles)
    tiles[f"{row}{col}"] = Tile(random.choice([2, 4]), row, col)
    return "continue"


def update_tiles(window, tiles, sorted_tiles):
    tiles.clear()
    for tile in sorted_tiles:
        tiles[f"{tile.row}{tile.col}"] = tile
    draw(window, tiles)  # draw all tiles on screen as they move


# generate two random positions to score first two #2 tiles
def generate_tiles():
    tiles = {}
    for _ in range(2):
        row, col = get_random_pos(tiles)
        tiles[f"{row}{col}"] = Tile(2, row, col)
    return tiles


# Display window for game result
def display_message(window, message):
    font = pygame.font.SysFont("comicsans", 40, bold=True) # Text font
    text = font.render(message, True, (0, 0, 0))  # Black text

    # Create a rectangle with curved corners
    rect_width = text.get_width() + 40  # width of rectangle + text padding
    rect_height = text.get_height() + 20  # height of rectangle + text padding
    rect = pygame.Rect((WIDTH - rect_width) // 2, (HEIGHT - rect_height) // 2, rect_width, rect_height)  #create rectangle
    pygame.draw.rect(window, (255, 165, 0), rect, border_radius=10)  # Orange background with curved corners

    # Draw text in the center of the rectangle
    text_rect = text.get_rect(center=rect.center)
    window.blit(text, text_rect)

    pygame.display.update() # update game window to show message


def main(window):
    clock = pygame.time.Clock()  # regulate speed of loop
    run = True
    game_status = "continue"  # Initialize game status

    tiles = generate_tiles()

    while run:
        clock.tick(FPS)  # run game on same speed for every user

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False
                break

            # read user key inputs
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    game_status = move_tiles(window, tiles, clock, "left")
                if event.key == pygame.K_RIGHT:
                    game_status = move_tiles(window, tiles, clock, "right")
                if event.key == pygame.K_UP:
                    game_status = move_tiles(window, tiles, clock, "up")
                if event.key == pygame.K_DOWN:
                    game_status = move_tiles(window, tiles, clock, "down")

        draw(window, tiles)

        # Display game result and close window
        if game_status == "won":  # if user got 2048
            display_message(window, "Congratulations! You won!")  # print message on board
            pygame.time.delay(2000)  # Delay for 2 seconds before closing
            run = False
        elif game_status == "lost": # if user lost
            display_message(window, "Game over! You lost.")  # print message on board
            pygame.time.delay(2000)  # Delay for 2 seconds before closing
            run = False

    pygame.quit()


# run game window main python file
if __name__ == "__main__":
    main(WINDOW)
