"""
TestSprite Portal Automation with Persistent Browser Context.
Saves login cookies so subsequent runs stay logged in.
"""
import sys, time, os, json
from playwright.sync_api import sync_playwright

OUT = r"C:\Users\naufa\agentpulse\testsprite-screenshots"
USER_DATA = r"C:\Users\naufa\agentpulse\.playwright-data"
os.makedirs(OUT, exist_ok=True)
os.makedirs(USER_DATA, exist_ok=True)

with sync_playwright() as p:
    # Use persistent context — cookies survive between runs!
    ctx = p.chromium.launch_persistent_context(
        user_data_dir=USER_DATA,
        headless=False,
        slow_mo=300,
        viewport={"width": 1280, "height": 900},
        args=["--start-maximized", "--disable-blink-features=AutomationControlled"]
    )
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    page.set_default_timeout(15000)
    
    try:
        # Step 1: Try going directly to dashboard (might work if cookies exist)
        print("STEP1: Trying dashboard directly...", flush=True)
        page.goto("https://www.testsprite.com/dashboard", wait_until="domcontentloaded")
        time.sleep(4)
        
        url = page.url
        text = page.evaluate("() => document.body.innerText")
        print(f"  URL: {url}", flush=True)
        page.screenshot(path=os.path.join(OUT, "01_initial.png"))
        
        # Check if we're on login page
        if "sign-in" in url or "Sign in" in text[:200]:
            print("  Not logged in. Clicking GitHub OAuth...", flush=True)
            
            # Click Continue with GitHub
            try:
                page.click('button:has-text("Continue with GitHub")', timeout=5000)
                time.sleep(4)
                url = page.url
                print(f"  After GitHub click URL: {url}", flush=True)
                page.screenshot(path=os.path.join(OUT, "02_github.png"))
                
                if "github.com/login" in url:
                    # Need to login to GitHub - type username
                    print("  On GitHub login. Entering credentials...", flush=True)
                    page.fill('#login_field', 'naufalfx805-source')
                    time.sleep(1)
                    page.screenshot(path=os.path.join(OUT, "03_github_user.png"))
                    print("  Username entered. WAITING 30s for password entry...", flush=True)
                    print("  >>> ENTER YOUR GITHUB PASSWORD IN THE BROWSER <<<", flush=True)
                    time.sleep(30)
                    
                elif "github.com/login/oauth/authorize" in url:
                    # Already logged in to GitHub, just need to authorize
                    print("  GitHub auth page - clicking Authorize...", flush=True)
                    try:
                        page.click('button:has-text("Authorize")', timeout=5000)
                        time.sleep(5)
                    except:
                        print("  No authorize button, waiting...", flush=True)
                        time.sleep(10)
                
                # After GitHub auth, check if we're back on TestSprite
                url = page.url
                print(f"  Current URL after auth: {url}", flush=True)
                page.screenshot(path=os.path.join(OUT, "04_after_auth.png"))
                
                if "testsprite.com" in url and "sign-in" not in url:
                    print("  LOGIN SUCCESS!", flush=True)
                else:
                    print("  Still not logged in. Waiting 30s more...", flush=True)
                    time.sleep(30)
                    url = page.url
                    print(f"  Final URL: {url}", flush=True)
                    
            except Exception as e:
                print(f"  GitHub click failed: {e}", flush=True)
                print("  Waiting 45s for manual login...", flush=True)
                time.sleep(45)
        
        # Step 2: Now on dashboard — extract info
        url = page.url
        print(f"\nSTEP2: Dashboard URL: {url}", flush=True)
        page.screenshot(path=os.path.join(OUT, "05_dashboard.png"))
        
        text = page.evaluate("() => document.body.innerText")
        with open(os.path.join(OUT, "dashboard_text.txt"), "w", encoding="utf-8") as f:
            f.write(text)
        print(f"  Dashboard text ({len(text)} chars):", flush=True)
        print(text[:2500], flush=True)
        
        # Extract all clickable elements
        nav = page.evaluate("""() => {
            return Array.from(document.querySelectorAll('a[href], button')).map(el => ({
                tag: el.tagName,
                text: (el.innerText || '').trim().substring(0, 60),
                href: el.href || '',
                visible: el.offsetParent !== null
            })).filter(x => x.visible && x.text && x.text.length > 0).slice(0, 30)
        }""")
        with open(os.path.join(OUT, "nav_links.json"), "w") as f:
            json.dump(nav, f, indent=2)
        print("\n  Clickable elements:", flush=True)
        for link in nav:
            print(f"  [{link['tag']}] {link['text'][:45]} | {link['href'][:60]}", flush=True)
        
        print("\nALL DONE", flush=True)
        
    finally:
        ctx.close()
