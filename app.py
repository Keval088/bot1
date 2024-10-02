import pyautogui
import sys

# Get x and y from command line arguments and convert them to integers
current_position = pyautogui.position()
x = float(sys.argv[1])
y = float(sys.argv[2])

# Move the mouse to the specified coordinates
pyautogui.moveTo(x, y, duration=1)

# Click at the current mouse position
pyautogui.click(x, y)
