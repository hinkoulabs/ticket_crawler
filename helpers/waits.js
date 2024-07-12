// Function to wait for an element to be available on the page
export const waitForElement = async (page, selector, timeout = 30000) => {
    try {
        await page.waitForSelector(selector, { timeout });
        return true;
    } catch (error) {
        console.error(`Element ${selector} not found: ${error}`);
        return false;
    }
};

export const randomDelay = (min, max) => {
    const maxValue = max || min;
    return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (maxValue - min + 1)) + min));
};

export const elementExists = async (page, selector) => {
    const element = await page.$(selector);
    return element !== null;
};

export const waitForNavigation = async (page) => {
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
}