import puppeteer from 'puppeteer';
import { env } from '../env.ts';

export default async function scraping(serial: string, senha: string) {
  let browser: puppeteer.Browser | null = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', // If running in Docker as non-root, prefer removing this flag; keep for compatibility
        '--disable-setuid-sandbox',
      ],
    });

    const page = await browser.newPage();
    // sensible timeouts
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (
        req.resourceType() === 'image' ||
        req.resourceType() === 'stylesheet' ||
        req.resourceType() === 'font'
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(`${env.BASE_URL}/v2/#/login`, { waitUntil: 'networkidle2', timeout: 15000 });

    await page.type('#email', env.EMAIL);
    await page.type('#password', env.PASSWORD);

    await page.click('#m_login_signin_submit');

    await page.waitForNavigation({ timeout: 15000 });

    await page.goto(`${env.BASE_URL}/v2/#/desbloqueio_rep_violacao`, {
      waitUntil: 'networkidle2',
      timeout: 15000,
    });

    await page.waitForSelector('[id^="n_"]', { timeout: 15000 });
    await page.evaluate(
      (serialValue: string, senhaValue: string) => {
        const inputSerial = document.querySelector('input[placeholder="Serial"]') as HTMLInputElement | null;
        const inputSenha = document.querySelector('input[placeholder="Senha"]') as HTMLInputElement | null;

        const btn = document.getElementById('btnSave') as HTMLElement | null;

        if (!inputSerial || !inputSenha || !btn) {
          throw new Error('Campos ou botão não encontrados na página.');
        }

        inputSerial.value = serialValue;
        inputSerial.dispatchEvent(new Event('input', { bubbles: true }));

        inputSenha.value = senhaValue;
        inputSenha.dispatchEvent(new Event('input', { bubbles: true }));

        btn?.click();
      },
      serial,
      senha
    );

    // await page.waitForSelector('.btn.btn-primary', { timeout: 10000 });
    // await page.click('#btnSave');

    await page.waitForSelector('.form-control.ng-binding.ng-scope', { timeout: 15000 });

    const contraSenha = await page.evaluate(() => {
      const element = document.querySelector('.form-control.ng-binding.ng-scope');
      return element ? element.textContent : null;
    });

    return contraSenha;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        // eslint-disable-next-line no-console
        console.error('Error closing browser:', closeErr);
      }
    }
  }
}
