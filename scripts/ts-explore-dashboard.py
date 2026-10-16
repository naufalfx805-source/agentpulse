"""TestSprite Dashboard - wait for SPA to render, then extract content and navigate"""
import sys, time, os, json
from playwright.sync_api import sync_playwright

OUT = r"C:\Users\naufa\agentpulse\testsprite-screenshots"
USER_DATA = r"C:\Users\naufa\agentpulse\.playwright-data"
os.makedirs(OUT, exist_ok=True)

with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(
        user_data_dir=USER_DATA,
        headless=False,
        slow_mo=200,
        viewport={"width": 1280, "height": 900},
        args=["--disable-blink-features=AutomationControlled"]
    )
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    page.set_default_timeout(30000)
    
    try:
        # Go to dashboard with networkidle wait
        print("Loading dashboard (waiting for SPA)...", flush=True)
        page.goto("https://www.testsprite.com/dashboard", wait_until="networkidle")
        time.sleep(8)  # Extra wait for React/Next hydration
        
        url = page.url
        print(f"URL: {url}", flush=True)
        page.screenshot(path=os.path.join(OUT, "dashboard_full.png"), full_page=True)
        
        # Try multiple ways to get text
        text = page.evaluate("() => document.body.innerText || document.body.textContent || ''")
        html = page.evaluate("() => document.body.innerHTML.substring(0, 5000)")
        
        with open(os.path.join(OUT, "dashboard_text.txt"), "w", encoding="utf-8") as f:
            f.write(text)
        with open(os.path.join(OUT, "dashboard_html.txt"), "w", encoding="utf-8") as f:
            f.write(html)
            
        print(f"Text length: {len(text)}", flush=True)
        print(f"HTML length: {len(html)}", flush=True)
        print(f"Text content:\n{text[:3000]}", flush=True)
        
        if len(text) < 50:
            print("\nPage seems empty. Checking iframes...", flush=True)
            frames = page.frames
            print(f"Found {len(frames)} frames", flush=True)
            for i, frame in enumerate(frames):
                ft = frame.evaluate("() => document.body?.innerText?.substring(0, 500) || ''")
                if ft:
                    print(f"  Frame {i} ({frame.url[:60]}): {ft[:200]}", flush=True)
        
        # Get all links and buttons
        nav = page.evaluate("""() => {
            return Array.from(document.querySelectorAll('a[href], button, [role="button"], [onclick]')).map(el => ({
                tag: el.tagName,
                text: (el.innerText || el.textContent || '').trim().substring(0, 80),
                href: el.href || el.getAttribute('href') || '',
                class: el.className?.substring?.(0, 60) || '',
                visible: el.offsetParent !== null || el.offsetWidth > 0
            })).filter(x => x.text.length > 0).slice(0, 50)
        }""")
        print(f"\nAll elements ({len(nav)}):", flush=True)
        for link in nav:
            v = "V" if link['visible'] else "H"
            print(f"  [{v}][{link['tag']}] {link['text'][:50]} | href={link['href'][:50]} | cls={link['class'][:30]}", flush=True)
        
        # Try navigating to settings
        print("\nTrying Settings page...", flush=True)
        page.goto("https://www.testsprite.com/dashboard/settings", wait_until="networkidle")
        time.sleep(5)
        page.screenshot(path=os.path.join(OUT, "settings.png"), full_page=True)
        settings_text = page.evaluate("() => document.body.innerText || ''")
        print(f"Settings text ({len(settings_text)}):\n{settings_text[:2000]}", flush=True)
        
        # Try projects page  
        print("\nTrying Projects page...", flush=True)
        page.goto("https://www.testsprite.com/dashboard/projects", wait_until="networkidle")
        time.sleep(5)
        page.screenshot(path=os.path.join(OUT, "projects.png"), full_page=True)
        proj_text = page.evaluate("() => document.body.innerText || ''")
        print(f"Projects text ({len(proj_text)}):\n{proj_text[:2000]}", flush=True)
        
        print("\nDONE", flush=True)
    finally:
        ctx.close()
