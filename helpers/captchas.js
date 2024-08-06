import { elementExists, randomDelay, waitForElement } from './waits.js'

const handlePressAndHold = async (page, selector, clickShift, delay) => {
    if (!await elementExists(page, selector)) {
        return;
    }

    const captchaFrameElement = await page.$(selector);

    // click the left corner of the element
    const boundingBox = await captchaFrameElement.boundingBox();

    console.log('captсha-box', boundingBox)

    const x = boundingBox.x + (clickShift?.x || 0);
    const y = boundingBox.y + (clickShift?.y || 0);

    await page.mouse.move(x, y);
    await page.mouse.down();
    await randomDelay(delay);
    await page.mouse.up();
};

const SELECTORS = {
    captcha: "#px-captcha"
}

export const handlePressAndHoldCaptcha = async (page) => {
    await handlePressAndHold(
        page,
        SELECTORS.captcha,
        {
            x: 100,
            y: 50
        },
        10000
    )
}

export const nextOrHandleCaptcha = async (page, finder, options) => {
    // wait for captcha or next elements
    await page.waitForFunction(
        (props) => {
            const findElement = () => {
                if (props.finder.func === 'querySelector') {
                    return document.querySelector(props.finder.args);
                }else{
                    const elements = Array.from(document.querySelectorAll(props.finder.args.tag));
                    return elements.find(a => a.textContent.trim() === props.finder.args.value);
                }
            }
            
            return document.querySelector(props.selectors.captcha) || findElement()
        }, 
        {}, 
        { selectors: SELECTORS, finder: finder }
    );

    let elementVisible = false;

    while (!elementVisible) {
        await handlePressAndHoldCaptcha(page);

        if (options?.loadCallback) {
            options.loadCallback()
        }

        elementVisible = await page.evaluate((finder) => {
            const findElement = (finder) => {
                if (finder.func === 'querySelector') {
                    return document.querySelector(finder.args);
                }else{
                    const elements = Array.from(document.querySelectorAll(finder.args.tag));
                    return elements.find(a => a.textContent.trim() === finder.args.value);
                }
            }

            return !!findElement(finder);
        }, finder);
    }
}