import { waitForElement } from './waits.js'

const findElementByTextStr = `
    function findElementByText(document, tag, text) {
        const elements = Array.from(document.querySelectorAll(tag));
        return elements.find(a => a.textContent.trim() === text);
    }
`;

export const clickButtonByText = async (page, buttonText) => {
    await page.evaluate((buttonText, findElementByTextStr) => {   
        eval(findElementByTextStr);     
        const button = findElementByText(document, 'button', buttonText)
        if (button) {
            button.click();
            return true;
        }

        console.error(`Button with text "${buttonText}" not found.`);
        return false;
    }, buttonText, findElementByTextStr);
};

export const clickLinkByText = async (page, linkText) => {
    return await page.evaluate((linkText, findElementByTextStr) => {
        eval(findElementByTextStr);  
        const link = findElementByText(document, 'a', linkText)
        if (link) {
            link.click();
            return true;
        }

        console.error(`Link with text "${linkText}" not found.`);
        return false;
    }, linkText, findElementByTextStr);
};

export const clickButton = async (page, selector) => {
    if (await waitForElement(page, selector)) {
        try {
            await page.evaluate((selector) => {
                const button = document.querySelector(selector);
                if (button) {
                    button.click();
                }
            }, selector);
            console.log("Clicked", selector);
        } catch (error) {
            console.error(`Failed to click button ${selector}:`, error);
        }
    } else {
        console.error(`Button ${selector} not found.`);
    }
};