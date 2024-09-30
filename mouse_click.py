import pyautogui
import time
import sys

# Ensure that x and y are provided as command line arguments
if len(sys.argv) != 3:
    print("Usage: python mouse_click.py <x> <y>")
    sys.exit(1)

# Get x and y from command line arguments and convert them to integers
x = int(sys.argv[1])
y = int(sys.argv[2])

# Wait for 5 seconds
time.sleep(5)

# Move the mouse to the specified coordinates
pyautogui.moveTo(x, y, duration=1)

# Click at the current mouse position
pyautogui.click()
