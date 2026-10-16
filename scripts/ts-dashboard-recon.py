import sys, time, os, json
sys.path.append(r"C:\Users\naufa\playwright-agent")
from browser_controller import BrowserController

OUT = r"C:\Users\naufa\agentpulse\testsprite-screenshots"
os.makedirs(OUT, exist_ok=True)
os.chdir(OUT)

b = BrowserController(headless=False, slow_mo=200)
try:
    # Step 1: Go to dashboard (user already logged in)
    print("STEP1: Loading dashboard...", flush=True)
    b.goto("https://www.testsprite.com/dashboard")
    time.sleep(5)
    b.take_screenshot("01_dashboard.png")
    
    # Extract page text
    text = b.page.evaluate("() => document.body.innerText")
    with open("dashboard_text.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print(f"STEP1: Done. Text length={len(text)}", flush=True)
    print(text[:2000], flush=True)

    # Step 2: Get all clickable elements
    print("\nSTEP2: Extracting nav elements...", flush=True)
    nav_links = b.page.evaluate("""() => {
        return Array.from(document.querySelectorAll('a[href], button')).map(el => ({
            tag: el.tagName,
            text: (el.innerText || '').trim().substring(0, 60),
            href: el.href || '',
            visible: el.offsetParent !== null
        })).filter(x => x.visible && x.text && x.text.length > 0)
    }""")
    
    with open("nav_links.json", "w") as f:
        json.dump(nav_links, f, indent=2)
    print(f"STEP2: Found {len(nav_links)} elements", flush=True)
    for link in nav_links[:25]:
        print(f"  [{link['tag']}] {link['text'][:45]} | {link['href'][:60]}", flush=True)

    print("\nDONE", flush=True)
finally:
    try:
        b.close()
    except:
        pass
