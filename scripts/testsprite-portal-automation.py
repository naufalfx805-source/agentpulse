"""
TestSprite Portal Automation Script
Automates: Login → Generate Test Suite → Install GitHub App
Uses the Playwright Agent skill for headed browser automation on Windows.
"""
import sys
import time
import os

sys.path.append(r"C:\Users\naufa\playwright-agent")
from browser_controller import BrowserController

TESTSPRITE_LOGIN_URL = "https://www.testsprite.com/auth/cognito/sign-in"
TESTSPRITE_DASHBOARD_URL = "https://www.testsprite.com/dashboard"
APP_URL = "https://agentpulse-pi.vercel.app"
EMAIL = "naufalfx805@gmail.com"

def step_login(browser):
    """Step 1: Login to TestSprite portal"""
    print("[STEP 1] Navigating to TestSprite login page...")
    browser.goto(TESTSPRITE_LOGIN_URL)
    time.sleep(3)
    browser.take_screenshot("01_login_page.png")
    
    # Type email
    print("[STEP 1] Entering email...")
    try:
        browser.click('input[name="email"], input[type="email"], #email')
        browser.type_text('input[name="email"], input[type="email"], #email', EMAIL)
    except Exception as e:
        print(f"  Email field attempt 1 failed: {e}")
        # Try alternative selectors
        browser.click('input[placeholder*="email" i]')
        browser.type_text('input[placeholder*="email" i]', EMAIL)
    
    browser.take_screenshot("02_email_entered.png")
    print("[STEP 1] Email entered. Please complete password/auth manually if needed.")
    print("[STEP 1] Waiting 15 seconds for manual auth completion...")
    time.sleep(15)
    browser.take_screenshot("03_after_auth.png")
    return True

def step_navigate_dashboard(browser):
    """Step 2: Navigate to dashboard and check current state"""
    print("[STEP 2] Navigating to dashboard...")
    browser.goto(TESTSPRITE_DASHBOARD_URL)
    time.sleep(5)
    browser.take_screenshot("04_dashboard.png")
    return True

def step_generate_suite(browser):
    """Step 3: Generate test suite against the live app URL"""
    print("[STEP 3] Looking for 'Generate Tests' or 'New Suite' button...")
    browser.take_screenshot("05_before_suite.png")
    
    # Try clicking various possible buttons
    selectors = [
        'button:has-text("Generate")',
        'button:has-text("New Suite")',
        'button:has-text("Create")',
        'a:has-text("Generate")',
        '[data-testid="generate-tests"]',
    ]
    
    for sel in selectors:
        try:
            browser.click(sel)
            print(f"  Clicked: {sel}")
            time.sleep(3)
            break
        except Exception:
            continue
    
    browser.take_screenshot("06_suite_setup.png")
    
    # Try entering the app URL
    url_selectors = [
        'input[name="url"]',
        'input[placeholder*="url" i]',
        'input[placeholder*="URL" i]',
        'input[type="url"]',
    ]
    
    for sel in url_selectors:
        try:
            browser.click(sel)
            browser.type_text(sel, APP_URL)
            print(f"  Entered URL in: {sel}")
            break
        except Exception:
            continue
    
    browser.take_screenshot("07_url_entered.png")
    print("[STEP 3] URL entered. Check screenshots for next steps.")
    return True

def step_github_app(browser):
    """Step 4: Navigate to GitHub App settings"""
    print("[STEP 4] Navigating to GitHub App settings...")
    
    # Try Settings → GitHub App
    settings_selectors = [
        'a:has-text("Settings")',
        'button:has-text("Settings")',
        '[href*="settings"]',
    ]
    
    for sel in settings_selectors:
        try:
            browser.click(sel)
            print(f"  Clicked settings: {sel}")
            time.sleep(3)
            break
        except Exception:
            continue
    
    browser.take_screenshot("08_settings_page.png")
    
    # Look for GitHub App section
    github_selectors = [
        'a:has-text("GitHub")',
        'button:has-text("GitHub App")',
        'a:has-text("GitHub App")',
        '[href*="github"]',
    ]
    
    for sel in github_selectors:
        try:
            browser.click(sel)
            print(f"  Clicked GitHub: {sel}")
            time.sleep(3)
            break
        except Exception:
            continue
    
    browser.take_screenshot("09_github_app.png")
    print("[STEP 4] GitHub App settings reached. Check screenshots.")
    return True

def main():
    screenshot_dir = r"C:\Users\naufa\agentpulse\testsprite-screenshots"
    os.makedirs(screenshot_dir, exist_ok=True)
    os.chdir(screenshot_dir)
    
    print("=" * 60)
    print("TestSprite Portal Automation")
    print("=" * 60)
    
    with BrowserController(headless=False, slow_mo=500) as browser:
        step_login(browser)
        step_navigate_dashboard(browser)
        step_generate_suite(browser)
        step_github_app(browser)
        
        print("\n" + "=" * 60)
        print("Automation complete. Review screenshots in:")
        print(f"  {screenshot_dir}")
        print("=" * 60)
        
        # Keep browser open for manual intervention
        print("Browser will stay open for 60 seconds for manual steps...")
        time.sleep(60)

if __name__ == "__main__":
    main()
