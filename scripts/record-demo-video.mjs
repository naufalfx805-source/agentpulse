import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function smoothScroll(page, distance, steps = 15, delayMs = 50) {
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, distance / steps);
    await sleep(delayMs);
  }
}

async function record() {
  const outputDir = path.resolve('videos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎬 Launching Chromium for automated demo recording...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  console.log('🌐 Opening AgentPulse production site...');
  await page.goto('https://agentpulse-pi.vercel.app', { waitUntil: 'networkidle' });
  await sleep(2000);

  // --- ACT 1: FLEET OVERVIEW & TELEMETRY ---
  console.log('📊 Act 1: Fleet Overview & Observability');
  await sleep(2500);

  // Hover over metric cards
  const cards = await page.$$('.grid > div');
  if (cards.length > 0) {
    await cards[0].hover();
    await sleep(1000);
    if (cards.length > 1) {
      await cards[1].hover();
      await sleep(1000);
    }
  }

  // Smooth scroll down to telemetry stream
  await smoothScroll(page, 450);
  await sleep(3500);

  // Scroll back to top
  await smoothScroll(page, -450);
  await sleep(1500);

  // --- ACT 2: PIPELINE STUDIO ---
  console.log('⚡ Act 2: Multi-Step Pipeline Execution DAG');
  const pipelineTab = page.locator('nav button:has-text("Pipeline Studio")');
  await pipelineTab.click();
  await sleep(2500);

  // Hover over DAG steps
  const runPipelineBtn = page.locator('button:has-text("Run Pipeline")');
  if (await runPipelineBtn.isVisible()) {
    await runPipelineBtn.hover();
    await sleep(1200);
    console.log('▶️ Executing Pipeline verification DAG...');
    await runPipelineBtn.click();
    // Wait for the simulated pipeline steps to advance (takes ~4s)
    await sleep(4500);
  }

  await smoothScroll(page, 200);
  await sleep(2000);
  await smoothScroll(page, -200);
  await sleep(1000);

  // --- ACT 3: TEST SCENARIOS ---
  console.log('🧩 Act 3: Test Scenarios');
  const scenariosTab = page.locator('nav button:has-text("Test Scenarios")');
  await scenariosTab.click();
  await sleep(2500);
  await smoothScroll(page, 300);
  await sleep(2500);
  await smoothScroll(page, -300);
  await sleep(1000);

  // --- ACT 4: CHAOS & WEBHOOK SIMULATOR ---
  console.log('🌪️ Act 4: Chaos & Synthetic Webhook Simulator');
  const chaosTab = page.locator('nav button:has-text("Chaos & Webhooks")');
  await chaosTab.click();
  await sleep(2500);

  // Fire webhook event
  const dispatchBtn = page.locator('button:has-text("Dispatch Webhook Event"), button:has-text("Dispatch")');
  if (await dispatchBtn.first().isVisible()) {
    await dispatchBtn.first().hover();
    await sleep(1000);
    await dispatchBtn.first().click();
    await sleep(2500);
  }

  // --- ACT 5: THE TESTSPRITE SELF-HEALING LOOP ---
  console.log('🔄 Act 5: The TestSprite Self-Healing Loop');
  const loopTab = page.locator('nav button:has-text("The TestSprite Loop")');
  await loopTab.click();
  await sleep(3000);

  // Step 1: Write (Maker)
  console.log('  -> Step 1: Write (Maker)');
  const step1Btn = page.locator('button:has-text("Step 01")');
  if (await step1Btn.isVisible()) await step1Btn.click();
  await sleep(3000);

  // Step 2: Test (Checker)
  console.log('  -> Step 2: Test (Checker) - Regression Detected');
  const step2Btn = page.locator('button:has-text("Step 02")');
  if (await step2Btn.isVisible()) await step2Btn.click();
  await sleep(3500);

  // Step 3: Fix (Maker)
  console.log('  -> Step 3: Fix (Maker) - Remediation Patch');
  const step3Btn = page.locator('button:has-text("Step 03")');
  if (await step3Btn.isVisible()) await step3Btn.click();
  await sleep(3500);

  // Step 4: Test Again (Checker)
  console.log('  -> Step 4: Test Again (Checker) - 100% Green');
  const step4Btn = page.locator('button:has-text("Step 04")');
  if (await step4Btn.isVisible()) await step4Btn.click();
  await sleep(4000);

  // --- ACT 6: GITHUB EVIDENCE (PR #1 MERGED) ---
  console.log('🐙 Act 6: Live GitHub Proof — AgentPulse PR #1');
  await page.goto('https://github.com/naufalfx805-source/agentpulse/pull/1', { waitUntil: 'networkidle' });
  await sleep(3000);
  await smoothScroll(page, 450);
  await sleep(4000);
  await smoothScroll(page, -450);
  await sleep(1500);

  // --- ACT 7: TRACK B PROOF (TESTSPRITE CLI PR #386) ---
  console.log('🛠️ Act 7: Upstream Track B Proof — TestSprite CLI PR #386');
  await page.goto('https://github.com/TestSprite/testsprite-cli/pull/386', { waitUntil: 'networkidle' });
  await sleep(3000);
  await smoothScroll(page, 400);
  await sleep(4000);

  console.log('🏁 Demo walkthrough complete. Finalizing video...');
  await page.close();
  await context.close();
  await browser.close();

  // Find recorded video
  const files = fs.readdirSync(outputDir).filter((f) => f.endsWith('.webm'));
  if (files.length > 0) {
    // Sort by mtime descending
    files.sort((a, b) => {
      return (
        fs.statSync(path.join(outputDir, b)).mtime.getTime() -
        fs.statSync(path.join(outputDir, a)).mtime.getTime()
      );
    });
    const latestVideo = path.join(outputDir, files[0]);
    console.log(`✅ Raw recording saved: ${latestVideo}`);
    return latestVideo;
  }
  throw new Error('No webm video recorded!');
}

record().catch((err) => {
  console.error('❌ Recording failed:', err);
  process.exit(1);
});
