import { waitForElement } from './waits.js'

export const typeText = async (page, selector, text) => {
    if (await waitForElement(page, selector)) {
        await page.type(selector, text, { delay: 100 });
    } else {
        console.error(`Input field ${selector} not found.`);
    }
};