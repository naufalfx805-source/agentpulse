"""Quick TestSprite login + screenshot script"""
import sys, time, os
sys.path.append(r"C:\Users\naufa\playwright-agent")
from browser_controller import BrowserController

os.makedirs(r"C:\Users\naufa\agentpulse\testsprite-screenshots", exist_ok=True)
os.chdir(r"C:\Users\naufa\agentpulse\testsprite-screenshots")

with BrowserController(headless=False, slow_mo=300) as b:
    print("[1] Loading login page...")
    b.goto("https://www.testsprite.com/auth/cognito/sign-in")
    time.sleep(5)
    b.take_screenshot("01_login_page.png")
    print("[1] Screenshot saved: 01_login_page.png")
    
    # Try typing email
    print("[2] Trying to enter email...")
    selectors = [
        'input[name="username"]',
        'input[name="email"]', 
        'input[type="email"]',
        '#signInFormUsername',
        'input[placeholder*="email" i]',
        'input[placeholder*="Email" i]',
        'input',
    ]
    
    typed = False
    for sel in selectors:
        try:
            b.click(sel)
            time.sleep(0.5)
            b.type_text(sel, "naufalfx805@gmail.com")
            print(f"  SUCCESS: typed into {sel}")
            typed = True
            break
        except Exception as e:
            print(f"  SKIP {sel}: {e}")
    
    if typed:
        b.take_screenshot("02_email_entered.png")
        print("[2] Screenshot saved: 02_email_entered.png")
    
    print("[3] Keeping browser open 30s for manual password entry...")
    time.sleep(30)
    b.take_screenshot("03_after_auth.png")
    print("[3] Screenshot saved: 03_after_auth.png")
    print("DONE")
