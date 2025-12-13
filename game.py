WIDTH = 300
HEIGHT = 300

TITLE = "Ghost in a Castle"
FPS = 30

ghost = Actor('ghost', (150, 150))
background = Actor("bg")

def draw():
    background.draw()
    ghost.draw()

def update():
    if keyboard.left and ghost.x > 20:
        ghost.x -= 5
    elif keyboard.right and ghost.x < WIDTH - 20:
        ghost.x += 5
    elif keyboard.up and ghost.y > 20:
        ghost.y -= 5
    elif keyboard.down and ghost.y < HEIGHT - 20:
        ghost.y += 5

def on_key_down(key):
    if key == keys.SPACE:
        if ghost.image == "ghost":
            ghost.image = "ghost1"
        else:
            ghost.image = "ghost"
