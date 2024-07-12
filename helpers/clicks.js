import { waitForElement } from './waits.js'
import { findElementByText } from './finds.js'

export const clickButtonByText = async (page, buttonText) => {
    await page.evaluate(() => {
        const button = findElementByText(document, 'button', buttonText)
        if (button) {
            button.click();
            return true;
        }

        console.error(`Button with text "${buttonText}" not found.`);
        return false;
    });
};

export const clickLinkByText = async (page, linkText) => {
    const linkClicked = await page.evaluate(() => {
        const link = findElementByText(document, 'a', linkText)
        if (link) {
            link.click();
            return true;
        }

        console.error(`Link with text "${linkText}" not found.`);
        return false;
    });
    return linkClicked;
};

export const clickElementByTestId = async (page, testId) => {
    try {
        await page.click(`[data-testid="${testId}"]`);
        return true;
    } catch (error) {
        console.error(`Element with data-testid "${testId}" not found: ${error}`);
        return false;
    }
};

export const clickButton = async (page, selector) => {
    if (await waitForElement(page, selector)) {
        await page.click(selector);
        console.log("clicked", selector)
    } else {
        console.error(`Button ${selector} not found.`);
    }
};