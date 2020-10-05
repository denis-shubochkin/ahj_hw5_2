import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000);

describe('Goods list', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';
  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      headless: true,
      slowMo: 100,
    });
    page = await browser.newPage();
  });
  afterAll(async () => {
    server.kill();
    await browser.close();
  });
  test('add button', async () => {
    await page.goto(baseUrl);
    const but = await page.$('.add-button');
    but.click();
    await page.waitForSelector('.edit-form');
    const form = await page.$('.edit-form');
    const value = await page.evaluate((el) => el.style.display, form);
    if (value !== 'block') { throw new Error('error'); }
  });

  test('empty input name', async () => {
    await page.goto(baseUrl);
    const but = await page.$('.add-button');
    but.click();
    await page.waitForSelector('.edit-form');
    const form = await page.$('.edit-form');
    const button = await form.$('.button-save');
    button.click();
    await page.waitForSelector('.hidden-name');
    const label = await page.$('.hidden-name');
    const value = await page.evaluate((el) => el.style.display, label);
    if (value !== 'block') { throw new Error('error'); }
  });

  test('empty input price', async () => {
    await page.goto(baseUrl);
    const but = await page.$('.add-button');
    but.click();
    await page.waitForSelector('.edit-form');
    const form = await page.$('.edit-form');
    const button = await form.$('.button-save');
    button.click();
    await page.waitForSelector('.hidden-price-empty');
    const label = await page.$('.hidden-price-empty');
    const value = await page.evaluate((el) => el.style.display, label);
    if (value !== 'block') { throw new Error('error'); }
  });

  test('zero input price', async () => {
    await page.goto(baseUrl);
    const but = await page.$('.add-button');
    but.click();
    await page.waitForSelector('.edit-form');
    const form = await page.$('.edit-form');
    const button = await form.$('.button-save');
    const input = await form.$('.edit-price-input');
    input.type('0');
    button.click();
    await page.waitForSelector('.hidden-price-zero');
    const label = await page.$('.hidden-price-zero');
    const value = await page.evaluate((el) => el.style.display, label);
    if (value !== 'block') { throw new Error('error'); }
  });

  test('delete item', async () => {
    await page.goto(baseUrl);
    const but = await page.$('.add-button');
    but.click();
    await page.waitForSelector('.edit-form');
    const form = await page.$('.edit-form');
    const button = await form.$('.button-save');
    const inputName = await form.$('.edit-name-input');
    const inputPrice = await form.$('.edit-price-input');
    await inputName.type('test');
    await inputPrice.type('20');
    button.click();
    await page.waitForSelector('.edit-form');
    const value = await page.evaluate((el) => el.style.display, form);
    if (value !== 'none') { throw new Error('error'); }
    await page.waitForSelector('.unit-name');
    await page.waitForSelector('.unit-price');
    const delBut = await page.$('.delete-button');
    delBut.click();
    await page.waitForSelector('.unit-name');
    const newName = await page.$('.unit-name');
    if (newName) { throw new Error('error'); }
  });

  test('add item', async () => {
    await page.goto(baseUrl);
    const but = await page.$('.add-button');
    but.click();
    await page.waitForSelector('.edit-form');
    const form = await page.$('.edit-form');
    const button = await form.$('.button-save');
    const inputName = await form.$('.edit-name-input');
    const inputPrice = await form.$('.edit-price-input');
    await inputName.type('test');
    await inputPrice.type('20');
    button.click();
    await page.waitForSelector('.edit-form');
    const value = await page.evaluate((el) => el.style.display, form);
    if (value !== 'none') { throw new Error('error'); }
    const name = await page.$('.unit-name');
    const price = await page.$('.unit-price');
    await page.waitForSelector('.unit-name');
    await page.waitForSelector('.unit-price');
    const valueN = await page.evaluate((el) => el.textContent, name);
    if (valueN !== 'test') { throw new Error('error'); }
    const valueP = await page.evaluate((el) => el.textContent, price);
    if (valueP !== '20') { throw new Error('error'); }
  });


  test('edit item', async () => {
    await page.goto(baseUrl);
    const but = await page.$('.add-button');
    but.click();
    await page.waitForSelector('.edit-form');
    const form = await page.$('.edit-form');
    const button = await form.$('.button-save');
    const inputName = await form.$('.edit-name-input');
    const inputPrice = await form.$('.edit-price-input');
    await inputName.type('test');
    await inputPrice.type('20');
    button.click();
    await page.waitForSelector('.edit-form');
    const value = await page.evaluate((el) => el.style.display, form);
    if (value !== 'none') { throw new Error('error'); }
    await page.waitForSelector('.unit-name');
    await page.waitForSelector('.unit-price');
    const edit = await page.$('.edit-button');
    edit.click();
    await page.waitForSelector('.edit-form');
    await page.waitForSelector('.edit-name-input');
    const inputNewName = await form.$('.edit-name-input');
    const inputNewPrice = await form.$('.edit-price-input');
    const oldName = await page.evaluate((el) => el.value, inputNewName);
    if (oldName !== 'test') { throw new Error('error'); }
    const oldPrice = await page.evaluate((el) => el.value, inputNewPrice);
    if (oldPrice !== '20') { throw new Error('error'); }
  });
});
