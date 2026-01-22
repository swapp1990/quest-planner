#!/usr/bin/env node
/**
 * One-Pager PDF Generator for Sidequests
 *
 * Usage: node scripts/generate-one-pager.js
 * Output: assets/sidequests-one-pager.pdf
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// Chrome executable paths
const CHROME_PATHS = {
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  linux: '/usr/bin/google-chrome',
};

function getChromePath() {
  const chromePath = CHROME_PATHS[process.platform];
  if (chromePath && fs.existsSync(chromePath)) {
    return chromePath;
  }
  throw new Error(`Chrome not found. Please install Google Chrome.`);
}

// Screenshot paths
const SCREENSHOTS = {
  hero: 'assets/references/IMG_6CAECD885E7D-1.jpeg',
  chat: 'assets/references/IMG_AFB23520BFC2-1.jpeg',
  plan: 'assets/references/IMG_4110ACFA45F0-1.jpeg',
  home: 'assets/references/IMG_7A281E8EDEAE-1.jpeg',
};

function imageToBase64(imagePath) {
  const fullPath = path.join(__dirname, '..', imagePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Warning: Image not found at ${fullPath}`);
    return '';
  }
  const imageBuffer = fs.readFileSync(fullPath);
  const base64 = imageBuffer.toString('base64');
  const ext = path.extname(imagePath).slice(1);
  return `data:image/${ext};base64,${base64}`;
}

function generateHTML() {
  const heroImg = imageToBase64(SCREENSHOTS.hero);
  const chatImg = imageToBase64(SCREENSHOTS.chat);
  const planImg = imageToBase64(SCREENSHOTS.plan);
  const homeImg = imageToBase64(SCREENSHOTS.home);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0a0a0f;
      color: #fff;
      min-height: 100vh;
      padding: 32px 40px;
    }

    .container {
      max-width: 760px;
      margin: 0 auto;
    }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 28px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .title-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin-bottom: 10px;
    }

    .logo {
      font-size: 44px;
    }

    .title {
      font-size: 52px;
      font-weight: 900;
      color: #fff;
      letter-spacing: -2px;
    }

    .tagline {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 500;
    }

    /* Elevator Pitch */
    .pitch {
      background: linear-gradient(135deg, rgba(91, 159, 237, 0.12), rgba(139, 127, 214, 0.12));
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 20px 24px;
      margin-bottom: 28px;
      text-align: center;
    }

    .pitch-text {
      font-size: 15px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.85);
    }

    .pitch-highlight {
      color: #5B9FED;
      font-weight: 600;
    }

    /* Two Column Layout */
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 28px;
    }

    .card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
      padding: 18px 20px;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .card-icon {
      font-size: 20px;
    }

    .card-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: rgba(255, 255, 255, 0.4);
    }

    .card-title.problem { color: #FF6B6B; }
    .card-title.solution { color: #4CAF50; }

    .card-text {
      font-size: 13px;
      line-height: 1.55;
      color: rgba(255, 255, 255, 0.75);
    }

    /* How It Works */
    .how-section {
      margin-bottom: 28px;
    }

    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: rgba(255, 255, 255, 0.4);
      text-align: center;
      margin-bottom: 18px;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .step {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 16px 12px;
      text-align: center;
    }

    .step-number {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: linear-gradient(135deg, #5B9FED, #8B7FD6);
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 10px auto;
    }

    .step-title {
      font-size: 12px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }

    .step-desc {
      font-size: 10px;
      line-height: 1.4;
      color: rgba(255, 255, 255, 0.5);
    }

    /* Screenshots */
    .screenshots-section {
      margin-bottom: 28px;
    }

    .screenshots-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }

    .screenshot-card {
      text-align: center;
    }

    .screenshot-img {
      width: 100%;
      height: auto;
      border-radius: 14px;
      margin-bottom: 10px;
    }

    .screenshot-label {
      font-size: 10px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Key Features */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 28px;
    }

    .feature {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }

    .feature-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }

    .feature-title {
      font-size: 12px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
    }

    .feature-desc {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.4;
    }

    /* CTA */
    .cta {
      text-align: center;
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(91, 159, 237, 0.15));
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 22px;
    }

    .cta-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .cta-subtitle {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 14px;
    }

    .cta-button {
      display: inline-block;
      background: #fff;
      color: #0a0a0f;
      font-size: 13px;
      font-weight: 700;
      padding: 12px 28px;
      border-radius: 10px;
    }

    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.25);
    }
  </style>
</head>
<body>
  <div class="container">

    <!-- Header -->
    <div class="header">
      <div class="title-row">
        <span class="logo">🗺️</span>
        <h1 class="title">Sidequests</h1>
      </div>
      <p class="tagline">Turn life goals into playable adventures</p>
    </div>

    <!-- Elevator Pitch -->
    <div class="pitch">
      <p class="pitch-text">
        An iOS app that turns big goals into <span class="pitch-highlight">bite-sized quests</span> — like a video game for your real life.
        AI breaks down your dream (trip, habit, side project) into daily micro-actions,
        then keeps you hooked with streaks, progress rings, and little "win" moments.
        <span class="pitch-highlight">Think Duolingo meets a choose-your-own-adventure life planner.</span>
      </p>
    </div>

    <!-- Problem / Solution -->
    <div class="two-col">
      <div class="card">
        <div class="card-header">
          <span class="card-icon">😩</span>
          <span class="card-title problem">The Problem</span>
        </div>
        <p class="card-text">
          Big goals are overwhelming and traditional planners are boring.
          You start excited but lose momentum when tasks pile up
          without a sense of progress or accomplishment.
        </p>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-icon">✨</span>
          <span class="card-title solution">The Solution</span>
        </div>
        <p class="card-text">
          AI creates personalized quests tailored to you. Choose your own path —
          Comfort or Stretch mode. Interactive quests with AI guiding you every step.
          Your goal becomes a story you play through.
        </p>
      </div>
    </div>

    <!-- How It Works -->
    <div class="how-section">
      <h2 class="section-title">How It Works</h2>
      <div class="steps-grid">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-title">Chat with AI</div>
          <div class="step-desc">Quick conversation about your goal, timeline, and energy level</div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-title">Get Your Brief</div>
          <div class="step-desc">AI generates a personalized mission brief based on your constraints</div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-title">Choose Your Path</div>
          <div class="step-desc">Pick Comfort (safe steps) or Stretch (push yourself) — your adventure, your rules</div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-title">Complete Quests</div>
          <div class="step-desc">Daily micro-actions with AI guidance, streaks, and progress tracking</div>
        </div>
      </div>
    </div>

    <!-- Screenshots -->
    <div class="screenshots-section">
      <div class="screenshots-grid">
        <div class="screenshot-card">
          ${heroImg ? `<img src="${heroImg}" class="screenshot-img" alt="Campaign">` : ''}
          <div class="screenshot-label">Pick Your Quest</div>
        </div>
        <div class="screenshot-card">
          ${chatImg ? `<img src="${chatImg}" class="screenshot-img" alt="Chat">` : ''}
          <div class="screenshot-label">AI Briefing</div>
        </div>
        <div class="screenshot-card">
          ${planImg ? `<img src="${planImg}" class="screenshot-img" alt="Path">` : ''}
          <div class="screenshot-label">Choose Path</div>
        </div>
        <div class="screenshot-card">
          ${homeImg ? `<img src="${homeImg}" class="screenshot-img" alt="Progress">` : ''}
          <div class="screenshot-label">Track Progress</div>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">🤖</div>
        <div class="feature-title">AI-Powered Quests</div>
        <div class="feature-desc">Personalized tasks based on your preferences, constraints, and energy</div>
      </div>
      <div class="feature">
        <div class="feature-icon">🎮</div>
        <div class="feature-title">Choose Your Adventure</div>
        <div class="feature-desc">Multiple paths to your goal — play it safe or push your limits</div>
      </div>
      <div class="feature">
        <div class="feature-icon">🧭</div>
        <div class="feature-title">AI Guide</div>
        <div class="feature-desc">Interactive quests with AI coaching you through every step</div>
      </div>
    </div>

    <!-- CTA -->
    <div class="cta">
      <h2 class="cta-title">Ready to start your sidequest?</h2>
      <p class="cta-subtitle">Transform your next big goal into an adventure</p>
      <span class="cta-button">Request Demo</span>
    </div>

    <div class="footer">
      Sidequests • iOS • Built with React Native
    </div>
  </div>
</body>
</html>
`;
}

async function generatePDF() {
  console.log('🚀 Generating Sidequests one-pager...\n');

  const html = generateHTML();
  const outputDir = path.join(__dirname, '..', 'assets');
  const outputPath = path.join(outputDir, 'sidequests-one-pager.pdf');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('📸 Loading screenshots...');
  Object.entries(SCREENSHOTS).forEach(([key, value]) => {
    const fullPath = path.join(__dirname, '..', value);
    const exists = fs.existsSync(fullPath);
    console.log(`   ${exists ? '✓' : '✗'} ${key}: ${value}`);
  });

  console.log('\n🖨️  Rendering PDF...');

  const chromePath = getChromePath();
  console.log(`🌐 Using Chrome at: ${chromePath}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();

  console.log(`\n✅ PDF generated successfully!`);
  console.log(`📄 Output: ${outputPath}`);

  const stats = fs.statSync(outputPath);
  const fileSizeKB = (stats.size / 1024).toFixed(1);
  console.log(`📦 Size: ${fileSizeKB} KB`);
}

generatePDF().catch(err => {
  console.error('❌ Error generating PDF:', err);
  process.exit(1);
});
