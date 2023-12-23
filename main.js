#!/usr/bin/env node

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { executablePath } = require('puppeteer');
const chalk = require('chalk');
const config = require('./config');
puppeteer.use(StealthPlugin());

async function main() {
  // initialize the browser
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
  });
  try {
    // create new page
    const page = await browser.newPage();
    // open the gmail sign-in page
    await page.goto(
      'https://accounts.google.com/v3/signin/identifier?authuser=0&continue=https%3A%2F%2Fmyaccount.google.com%2F%3Futm_source%3Dsign_in_no_continue%26pli%3D1&ec=GAlAwAE&hl=en_GB&service=accountsettings&flowName=GlifWebSignIn&flowEntry=AddSession&dsh=S956608363%3A1703274987518478&theme=glif'
    );
    // fill in the gmail address
    await page.focus('input[name="identifier"]');
    await page.type('input[name="identifier"]', config.gmail);
    // click next button to check the gmail address
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    //await page.click('#identifierNext');

    // fill in the password
    await page.waitForTimeout(5000);
    await page.focus('input[type="password"]');
    await page.type('input[type="password"]', config.password);
    // click next button to sign in
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    //await page.click('#passwordNext');

    // go to gmail inbox
    await page.waitForTimeout(3000);
    await page.goto('https://mail.google.com/mail/u/0/#inbox');

    console.log(chalk.green.bold(`[*] Signed-In successfully.`));

    for (let i = 0; i < config.times; i++) {
      // create new message
      await page.waitForTimeout(2000);
      await page.goto('https://mail.google.com/mail/u/0/#inbox?compose=new');
      // type the receiver email
      await page.waitForTimeout(5000);
      await page.focus('input.agP');
      await page.type('input.agP', config.sendTo);
      // type the message
      await page.focus('input[name="subjectbox"]');
      await page.type('input[name="subjectbox"]', config.message);

      // click send
      await page.waitForTimeout(1000);
      await page.keyboard.down('Control');
      await page.keyboard.press('Enter');
      await page.keyboard.up('Control');

      console.log(chalk.green.bold(`[+] Message number [${i + 1}] is sent.`));
    }
    // wait 10 seconds before closing the brwoser
    await page.waitForTimeout(3000);
    console.log(chalk.blue.bold(`[.] Program finished the requirement.`));
  } finally {
    await browser.close();
  }
}

main();
