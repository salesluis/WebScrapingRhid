import puppeteer from 'puppeteer';
import { env } from '../env.ts';

export default async function scraping(serial: string, senha: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox', // Recomendado para ambientes de produção (Docker)
      '--disable-setuid-sandbox',
    ],
  });

  const page = await browser.newPage();
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

  await page.goto(`${env.BASE_URL}/v2/#/login`, { waitUntil: 'networkidle2' });

  await page.type('#email', env.EMAIL);
  await page.type('#password', env.PASSWORD);

  await page.click('#m_login_signin_submit');

  await page.waitForNavigation();

  await page.goto(`${env.BASE_URL}/v2/#/desbloqueio_rep_violacao`, {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('[id^="n_"]');
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

  //todo -> testar se adicionando o evento de click via console browser funciona
  // await page.waitForSelector('.btn.btn-primary');
  // await page.click('#btnSave');

  await page.waitForSelector('.form-control.ng-binding.ng-scope');

  const contraSenha = await page.evaluate(() => {
    const element = document.querySelector('.form-control.ng-binding.ng-scope');
    return element ? element.textContent : null;
  });

  await browser.close();
  return contraSenha;
}
