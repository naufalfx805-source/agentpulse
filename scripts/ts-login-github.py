import sys, time, os, json
sys.path.append(r"C:\Users\naufa\playwright-agent")
from browser_controller import BrowserController

OUT = r"C:\Users\naufa\agentpulse\testsprite-screenshots"
os.makedirs(OUT, exist_ok=True)
os.chdir(OUT)

b = BrowserController(headless=False, slow_mo=300)
try:
    # Step 1: Go to login page
    print("STEP1: Loading login page...", flush=True)
    b.goto("https://www.testsprite.com/auth/cognito/sign-in")
    time.sleep(3)
    b.take_screenshot("01_login.png")
    
    # Step 2: Click "Continue with GitHub" (fastest OAuth)
    print("STEP2: Clicking 'Continue with GitHub'...", flush=True)
    try:
        b.page.click('button:has-text("Continue with GitHub")', timeout=5000)
        time.sleep(5)
        b.take_screenshot("02_github_oauth.png")
        
        # Check if we're on GitHub auth page or already redirected
        url = b.page.url
        text = b.page.evaluate("() => document.body.innerText")
        print(f"  Current URL: {url}", flush=True)
        print(f"  Page text (first 500): {text[:500]}", flush=True)
        
        if "github.com" in url:
            print("  On GitHub OAuth page - waiting 30s for user to authorize...", flush=True)
            time.sleep(30)
            b.take_screenshot("03_after_github_auth.png")
            url = b.page.url
            print(f"  After wait URL: {url}", flush=True)
        
        # Check if we made it to dashboard
        if "dashboard" in url or "testsprite.com" in url:
            print("  SUCCESS - redirected to TestSprite!", flush=True)
            time.sleep(3)
            b.take_screenshot("04_dashboard.png")
            text = b.page.evaluate("() => document.body.innerText")
            with open("dashboard_text.txt", "w", encoding="utf-8") as f:
                f.write(text)
            print(f"  Dashboard text (first 1500):", flush=True)
            print(text[:1500], flush=True)
            
            # Extract navigation
            nav = b.page.evaluate("""() => {
                return Array.from(document.querySelectorAll('a[href], button')).map(el => ({
                    tag: el.tagName,
                    text: (el.innerText || '').trim().substring(0, 60),
                    href: el.href || '',
                    visible: el.offsetParent !== null
                })).filter(x => x.visible && x.text && x.text.length > 0)
            }""")
            with open("nav_links.json", "w") as f:
                json.dump(nav, f, indent=2)
            for link in nav[:20]:
                print(f"  [{link['tag']}] {link['text'][:45]} | {link['href'][:60]}", flush=True)
    except Exception as e:
        print(f"  GitHub OAuth click failed: {e}", flush=True)
        # Fallback: try staying on page for manual login
        print("  Waiting 45s for manual login...", flush=True)
        time.sleep(45)
        b.take_screenshot("03_manual_login.png")
        url = b.page.url
        print(f"  After manual login URL: {url}", flush=True)
    
    print("\nDONE", flush=True)
finally:
    try:
        b.close()
    except:
        pass
