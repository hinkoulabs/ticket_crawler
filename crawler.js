import puppeteer from 'puppeteer-extra';
import {KnownDevices} from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { clickButton, clickButtonByText, clickLinkByText } from './helpers/clicks.js'
import { clearCookies } from './helpers/cookies.js'
import { waitForElement, randomDelay, waitForNavigation} from './helpers/waits.js'
import { nextOrHandleCaptcha } from './helpers/captchas.js'
import { typeText } from './helpers/forms.js'
import credentials from './credentials.js';

console.log('creds:', credentials)

puppeteer.use(StealthPlugin());

// Custom user-agent string
const userAgentString = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

//const url = 'https://auth.ticketmaster.com/as/authorization.oauth2?redirect_uri=https%3A%2F%2Fam.ticketmaster.com%2Fnyyreg%2Fam-sso%3Fdeeplink%3DaHR0cHM6Ly9hbS50aWNrZXRtYXN0ZXIuY29tL255eXJlZy8%3D&response_type=code&lang=en-us&integratorId=NAM&placementId=homepage&visualPresets=nyyreg&hideLeftPanel=true&client_id=adf2ade8eecd.web.nyyreg-nyyankees.us&scope=openid%20profile%20phone%20email%20tm'
const url = 'https://am.ticketmaster.com/nyyreg/';

// Proxy configuration (optional)
const useProxy = process.env.USE_PROXY === 'true';
const proxyUsername = process.env.PROXY_USERNAME || 'your-username';
const proxyPassword = process.env.PROXY_PASSWORD || 'your-password';
const proxyServer = process.env.PROXY_SERVER || 'gate.smartproxy.com:7000'

// Path to the regular Chrome browser
const chromePath = {
    win32: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    linux: '/usr/bin/google-chrome'
}[process.platform];

// Function to launch browser with a proxy
const launchBrowser = async (proxy) => {
    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--disable-extensions',
        '--window-size=800,1400',
        `--user-agent=${userAgentString}`
    ];

    if (proxy) {
        args.push(`--proxy-server=${proxy}`);
    }

    return puppeteer.launch({
        headless: false,
        executablePath: chromePath,
        args,
        defaultViewport: null
    });
};

const SELECTORS = {
    signInBtn: '#signInBtn',
    acceptCookiesBtn: '#onetrust-accept-btn-handler',
    login: {
        email: 'input[name="email"]',
        password: 'input[name="password"]',
        submitBtn: 'button[name="sign-in"]' 
    }
}

// Function to perform the task
const performTask = async (page) => {
    if (useProxy) {
        await page.authenticate({
            username: proxyUsername,
            password: proxyPassword
        });
    }

    await page.setRequestInterception(true);

    page.on('request', request => {
        const requestOptions = request.resourceType() === 'image' ? 'abort' : 'continue';
        request.continue({
            headers: {
                ...request.headers(),
                'User-Agent': userAgentString
            }
        }, requestOptions);
    });

    await clearCookies(page);

    await page.emulate(KnownDevices['iPhone 13'])

    await page.setRequestInterception(true); 

    await page.goto(url, { waitUntil: 'networkidle2' });

    await randomDelay(1000, 2000);

    await waitForElement(page, SELECTORS.signInBtn)

    await clickButton(page, SELECTORS.signInBtn)

    // pass cookies request
    await waitForElement(page, SELECTORS.acceptCookiesBtn)
    await clickButton(page, SELECTORS.acceptCookiesBtn)

    await randomDelay(1000, 2000);

    await nextOrHandleCaptcha(page, {func: 'querySelector', args: SELECTORS.login.email})

    // login steps
    await typeText(page, SELECTORS.login.email, credentials.email);
    await typeText(page, SELECTORS.login.password, credentials.password);

    await randomDelay(1000, 2000);

    await clickButton(page, SELECTORS.login.submitBtn);

    const manageTicketBtnText = "Manage My Tickets";

    await nextOrHandleCaptcha(
        page, 
        {func: 'queryByText', args: { tag: 'button', value: manageTicketBtnText  }},
        {
            // loadCallback: () => waitForNavigation(page)
        }
    )

    // go to tickets
    await clickButtonByText(manageTicketBtnText);

    const viewEventDetailsLinkText = "View Event Details";

    await nextOrHandleCaptcha(page, {func: 'queryByText', args: { tag: 'a', value: viewEventDetailsLinkText  }})

    // go to even details
    await clickLinkByText(viewEventDetailsLinkText);

    await waitForNavigation(page)

    // view barcode
    await clickElementByTestId("main-event-tickets")

    await randomDelay(5000);

    await page.screenshot({ path: 'screenshot.png' });
};

// main function to orchestrate the process
(async () => {
    let browser;
    try {
        const proxy = useProxy ? proxyServer : null;
        browser = await launchBrowser(proxy);
        const page = await browser.newPage();

        const taskSuccess = await performTask(page);

        if (taskSuccess) {
            console.log('Task completed successfully.');
        }

    } catch (error) {
        console.error(`Error: ${error}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();