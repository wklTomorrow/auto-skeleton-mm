const ppteer = require('puppeteer');
const devices = {
  mobile: [375, 667, 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'],
  ipad: [1024, 1366, 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'],
  pc: [1920, 1080, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36']
};

async function pp({device = 'mobile', headless = true}) {
  const browser = await ppteer.launch({headless});
  
  async function openPage(url, extraHTTPHeaders) {
    const page = await browser.newPage();
    try {
      let deviceSet = devices[device];
      page.setUserAgent(deviceSet[2]);
      page.setViewport({width: deviceSet[0], height: deviceSet[1]});

      if(extraHTTPHeaders) {
        await page.setExtraHTTPHeaders(extraHTTPHeaders);
      }
      page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
      await page.goto(url);
    } catch (e) {
      console.log('\n');
    }
    return page;
  }
  return {
    browser,
    openPage
  }
};

module.exports = pp;