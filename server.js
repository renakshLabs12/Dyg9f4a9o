const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

let browser;
let page;

// Initialize browser
async function initBrowser() {
  try {
    browser = await chromium.launch({ headless: true });
    console.log('✓ Browser launched');
  } catch (error) {
    console.error('Failed to launch browser:', error);
  }
}

// Navigate to URL
app.post('/api/navigate', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!page) {
      const context = await browser.newContext();
      page = await context.newPage();
    }

    // Add http if no protocol
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url;
    }

    await page.goto(finalUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Capture screenshot
    const screenshot = await page.screenshot({ fullPage: false });
    
    res.json({
      success: true,
      url: finalUrl,
      screenshot: screenshot.toString('base64')
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Click element
app.post('/api/click', async (req, res) => {
  try {
    const { selector } = req.body;
    
    if (!page) {
      return res.status(400).json({ success: false, error: 'No page loaded' });
    }

    await page.click(selector);
    const screenshot = await page.screenshot({ fullPage: false });
    
    res.json({
      success: true,
      screenshot: screenshot.toString('base64')
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Type text
app.post('/api/type', async (req, res) => {
  try {
    const { selector, text } = req.body;
    
    if (!page) {
      return res.status(400).json({ success: false, error: 'No page loaded' });
    }

    await page.fill(selector, text);
    const screenshot = await page.screenshot({ fullPage: false });
    
    res.json({
      success: true,
      screenshot: screenshot.toString('base64')
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get page content
app.get('/api/content', async (req, res) => {
  try {
    if (!page) {
      return res.status(400).json({ success: false, error: 'No page loaded' });
    }

    const content = await page.content();
    const screenshot = await page.screenshot({ fullPage: false });
    
    res.json({
      success: true,
      content,
      screenshot: screenshot.toString('base64')
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Go back
app.post('/api/back', async (req, res) => {
  try {
    if (!page) {
      return res.status(400).json({ success: false, error: 'No page loaded' });
    }

    await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
    const screenshot = await page.screenshot({ fullPage: false });
    
    res.json({
      success: true,
      screenshot: screenshot.toString('base64')
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Go forward
app.post('/api/forward', async (req, res) => {
  try {
    if (!page) {
      return res.status(400).json({ success: false, error: 'No page loaded' });
    }

    await page.goForward({ waitUntil: 'domcontentloaded' }).catch(() => {});
    const screenshot = await page.screenshot({ fullPage: false });
    
    res.json({
      success: true,
      screenshot: screenshot.toString('base64')
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Refresh
app.post('/api/refresh', async (req, res) => {
  try {
    if (!page) {
      return res.status(400).json({ success: false, error: 'No page loaded' });
    }

    await page.reload({ waitUntil: 'domcontentloaded' });
    const screenshot = await page.screenshot({ fullPage: false });
    
    res.json({
      success: true,
      screenshot: screenshot.toString('base64')
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

async function start() {
  await initBrowser();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);

process.on('exit', async () => {
  if (browser) await browser.close();
});
