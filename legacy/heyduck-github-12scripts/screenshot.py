import os

from playwright.sync_api import sync_playwright

out = r'C:\Users\USER\Documents\GitHub\heyduck\preview.png'
p = sync_playwright().start()
browser = p.chromium.launch(headless=True)
page = browser.new_page(viewport={'width': 1920, 'height': 1080})
page.goto('file:///C:/Users/USER/Documents/GitHub/heyduck/index.html')
page.wait_for_timeout(4000)
page.screenshot(path=out)
print('Saved:', out, os.path.exists(out))
browser.close()
p.stop()
