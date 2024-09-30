const { Builder, By } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const userAgentArray = require("./userAgent");
const url = "https://sh6ewzoig.play.gamezop.com";
const staticRandomNumber = 27000;
const { exec } = require('child_process');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callPython = (x, y) => {
    exec(`python3 mouse_click.py ${x} ${y}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Output: ${stdout}`);
    });
}

async function elementExists(driver, selector) {
    try {
        return await driver.executeScript(`return document.querySelector('${selector}') !== null;`);
    } catch (error) {
        console.error("elementExists error:", error);
    }
}

async function clickElement(driver, selector) {
    try {
        const exists = await elementExists(driver, selector);
        if (exists) {
            const divDimensions = await driver.executeScript(`
                const div = document.querySelector('${selector}');
                return {
                    width: div.clientWidth,
                    height: div.clientHeight,
                    rect: div.getBoundingClientRect()
                };
            `);

            // Calculate random coordinates within the div
            const randomX = Math.floor(Math.random() * divDimensions.width);
            const randomY = Math.floor(Math.random() * divDimensions.height);

            // Calculate the absolute position
            const absoluteX = divDimensions.rect.left + randomX;
            const absoluteY = divDimensions.rect.top + randomY;

            callPython(absoluteX, absoluteY)

            // Simulate mouse movement and click
            await driver.executeScript(`
                const mouseMoveEvent = new MouseEvent('mousemove', {
                    clientX: ${absoluteX},
                    clientY: ${absoluteY},
                    bubbles: true,
                    cancelable: true
                });
                const mouseClickEvent = new MouseEvent('click', {
                    clientX: ${absoluteX},
                    clientY: ${absoluteY},
                    bubbles: true,
                    cancelable: true
                });
                const div = document.querySelector('${selector}');
                div.dispatchEvent(mouseMoveEvent);
                div.dispatchEvent(mouseClickEvent);
            `);

            console.log(`Clicked element: ${selector}`);
            await delay(1000 + Math.random() * staticRandomNumber);
        } else {
            console.error(`Element not found: ${selector}`);
        }
    } catch (error) {
    }
}

async function clickElementWithMouse(driver, selector) {
    try {
        const exists = await elementExists(driver, selector);
        if (exists) {
            const divDimensions = await driver.executeScript(`
                const div = document.querySelector('${selector}');
                return {
                    width: div.clientWidth,
                    height: div.clientHeight,
                    rect: div.getBoundingClientRect()
                };
            `);

            // Scroll to the card element
            await driver.executeScript(`document.querySelector('${selector}').scrollIntoView();`);

            // Wait for a brief moment to ensure the element is in view
            await new Promise(resolve => setTimeout(resolve, 500));

            // Calculate random coordinates within the div
            const randomX = Math.floor(Math.random() * divDimensions.width);
            const randomY = Math.floor(Math.random() * divDimensions.height);

            // Calculate the absolute position
            const absoluteX = divDimensions.rect.left + randomX;
            const absoluteY = divDimensions.rect.top + randomY;

            callPython(absoluteX, absoluteY)

            // Simulate mouse movement and click
            await driver.executeScript(`
                const mouseMoveEvent = new MouseEvent('mousemove', {
                    clientX: ${absoluteX},
                    clientY: ${absoluteY},
                    bubbles: true,
                    cancelable: true
                });
                const mouseClickEvent = new MouseEvent('click', {
                    clientX: ${absoluteX},
                    clientY: ${absoluteY},
                    bubbles: true,
                    cancelable: true
                });
                const div = document.querySelector('${selector}');
                div.dispatchEvent(mouseMoveEvent);
                div.dispatchEvent(mouseClickEvent);
            `);

            console.log(`Clicked element: ${selector}`);
            await delay(6000 + (Math.random() * staticRandomNumber));
        } else {
            console.error(`Element not found: ${selector}`);
        }
    } catch (error) {
    }
}

async function clickRandomTwoCardsAndSelectButton(driver) {
    try {
        // Select all card elements
        const cardSelector = '.style_inner_cat_group__E_iG_ .style_card_holder__rwIrg';
        const cards = await driver.executeScript(`return Array.from(document.querySelectorAll('${cardSelector}')).map(card => card.outerHTML);`);

        if (cards.length < 2) {
            console.error("Not enough cards to click.");
            return;
        }

        // Randomly select two unique indices
        const randomIndices = [];
        while (randomIndices.length < 2) {
            const randomIndex = Math.floor(Math.random() * cards.length);
            if (!randomIndices.includes(randomIndex)) {
                randomIndices.push(randomIndex);
            }
        }

        // Click on the selected cards
        for (const index of randomIndices) {
            const cardSelectorToClick = `${cardSelector}:nth-child(${index + 1})`;
            await clickElementWithMouse(driver, cardSelectorToClick);
        }

        // Selector for the "Select any 2 Games" button
        const selectButtonSelector = 'button.style_btn__PifLx';

        // Click the "Select any 2 Games" button
        await clickElementWithMouse(driver, selectButtonSelector);
        await delay(5000 + (Math.random() * staticRandomNumber));
        await clickElement(driver, ".skip");
        await clickElement(driver, "#dismiss-button");
        await clickElement(driver, "#close-ad-button");
        await clickElement(driver, "#close_button");
    } catch (error) {
    }
}

async function homePageNavclickRandomButton(driver) {
    try {
        const cardSelector = '.style_nav_list__7i1tB';
        const cards = await driver.executeScript(`return Array.from(document.querySelectorAll('${cardSelector}')).map(card => card.outerHTML);`);

        if (cards.length < 1) {
            console.error("Home Nav:- Not enough cards to click.", cards.length);
            return;
        }

        const selectButtonSelector = `.style_nav_list__7i1tB:nth-child(${parseInt(Math.random() * cards.length) + 1})`;
        await clickElementWithMouse(driver, selectButtonSelector);
        // await goBackPage(driver)

        await clickElement(driver, ".skip");
        await clickElement(driver, "#dismiss-button");
        await clickElement(driver, "#close-ad-button");
        await clickElement(driver, "#close_button");
    } catch (error) {
    }
}

async function homeCardclickRandomButton(driver) {
    try {
        const cardSelector = '[class^="style_card_wrap"]';
        const cards = await driver.executeScript(`return Array.from(document.querySelectorAll('${cardSelector}')).map(card => card.outerHTML);`);

        if (cards.length < 1) {
            console.error("Card:- Not enough cards to click.", cards.length);
            return;
        }

        const selectButtonSelector = `.style_card_wrap__dwUPg:nth-child(${parseInt(Math.random() * cards.length) + 1})`;
        await clickElementWithMouse(driver, selectButtonSelector);
        await goBackPage(driver)
    } catch (error) {
    }
}

async function clickRandomPositionInDiv(driver, divId, isClass = true) {
    try {
        // Get the dimensions of the div
        const divSelector = isClass ? `[class^="${divId}"]` : `#${divId}`;
        const exists = await elementExists(driver, divSelector);
        if (exists) {
            const divDimensions = await driver.executeScript(`
                const div = document.querySelector('${divSelector}');
                return {
                    width: div.clientWidth,
                    height: div.clientHeight,
                    rect: div.getBoundingClientRect()
                };
            `);

            // Calculate random coordinates within the div
            const randomX = Math.floor(Math.random() * divDimensions.width);
            const randomY = Math.floor(Math.random() * divDimensions.height);

            // Calculate the absolute position
            const absoluteX = divDimensions.rect.left + randomX;
            const absoluteY = divDimensions.rect.top + randomY;

            callPython(absoluteX, absoluteY)

            // Simulate mouse movement and click
            await driver.executeScript(`
                const mouseMoveEvent = new MouseEvent('mousemove', {
                    clientX: ${absoluteX},
                    clientY: ${absoluteY},
                    bubbles: true,
                    cancelable: true
                });
                const mouseClickEvent = new MouseEvent('click', {
                    clientX: ${absoluteX},
                    clientY: ${absoluteY},
                    bubbles: true,
                    cancelable: true
                });
                const div = document.querySelector('${divSelector}');
                div.dispatchEvent(mouseMoveEvent);
                div.dispatchEvent(mouseClickEvent);
            `);

            console.log(`Clicked at position: (${absoluteX}, ${absoluteY})`);
            console.log(`Clicked On position: ${divSelector}`);
            await delay(1000 + Math.random() * staticRandomNumber); // Optional delay
        } else {
            console.error(`Element not found: ${divSelector}`);
        }
    } catch (error) {
    }
}

async function scrollPage(driver) {
    try {
        console.log("Scrolling page");
        await driver.executeScript(`
            window.scrollBy(0, window.innerHeight * Math.random());
        `);
        await delay(1000 + Math.random() * staticRandomNumber);
    } catch (error) {
        console.error("scrollPage error:", error);
    }
}

function generateRandomScreenSize(category) {
    let width, height;

    if (category.includes('mobile')) {
        width = randomInt(320, 480);
        height = randomInt(568, 800);
    } else if (category.includes('tablet')) {
        width = randomInt(600, 800);
        height = randomInt(800, 1200);
    } else {
        width = randomInt(1024, 1920);
        height = randomInt(768, 1080);
    }

    return { width, height };
}

async function createDriver() {
    try {
        const randomUserAgent = userAgentArray[Math.floor(Math.random() * userAgentArray.length)];
        // Set the path to your Firefox binary
        const firefoxBinaryPath = '/home/horizon/snap/firefox/common/.cache/mozilla/firefox/a7ey2oxf.default'; // Update this path
        const { width, height } = generateRandomScreenSize(randomUserAgent);
        const options = new firefox.Options().setBinary(firefoxBinaryPath).setPreference('general.useragent.override', randomUserAgent);
        const driver = new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
        await driver.manage().window().setRect({ width, height });
        return driver
    } catch (error) {
        console.error("createDriver error:", error);
    }
}

async function performMouseMovements(driver) {
    try {
        console.log("Performing mouse movements");
        const screenWidth = await driver.executeScript('return window.innerWidth');
        const screenHeight = await driver.executeScript('return window.innerHeight');

        function getRandomPosition() {
            return {
                x: Math.floor(Math.random() * screenWidth),
                y: Math.floor(Math.random() * screenHeight)
            };
        }

        for (let i = 0; i < Math.floor(Math.random() * 5) + 3; i++) { // Random number of movements
            const { x, y } = getRandomPosition();

            // Simulate mouse move
            await driver.executeScript(`
                const event = new MouseEvent('mousemove', { clientX: ${x}, clientY: ${y}, bubbles: true });
                document.dispatchEvent(event);
            `);

            // Optionally simulate a click
            if (Math.random() > 0.7) { // Adjust probability
                await driver.executeScript(`
                    const clickEvent = new MouseEvent('click', { clientX: ${x}, clientY: ${y}, bubbles: true });
                    document.dispatchEvent(clickEvent);
                `);
            }

            await delay(500 + Math.random() * 1500);
        }
    } catch (error) {
    }
}

async function performRandomActions(driver) {
    console.log("Performing random actions");
    const adSelectors = [
        '.adsbygoogle',
        '[class^="style_top_ad_container"]'
    ];

    try {
        const selector = adSelectors[Math.floor(Math.random() * adSelectors.length)];
        const exists = await elementExists(driver, selector);
        if (exists) {
            const adElement = await driver.findElement(By.css(selector));
            await driver.switchTo().frame(adElement);

            const link = await driver.findElement(By.tagName('a'));
            if (link) {
                await link.click();
                console.log("Click Ads", selector);
                await goBackPage(driver);
            }
        } else {
            console.error("Random Id not found ", selector);
        }
    } catch (error) {
    }
}

async function goBackPage(driver) {
    await delay(4000 + Math.random() * staticRandomNumber);

    const handles = await driver.getAllWindowHandles();
    if (handles.length > 1) {
        await driver.switchTo().window(handles[handles.length - 1]).close();
        await driver.switchTo().window(handles[0]);
    } else {
        await driver.navigate().back();
    }

    await delay(4000 + Math.random() * staticRandomNumber);
    await clickElement(driver, ".skip");
    await clickElement(driver, "#dismiss-button");
    await clickElement(driver, "#close-ad-button");
    await clickElement(driver, "#close_button");
}

async function continueLoop(driver) {
    let count = 0
    const redomNo = Math.random() * 10;
    while (6 > count) {
        try {

            if (await elementExists(driver, "#ad_position_box")) {
                if (Math.random() > 0.5) {
                    await clickRandomPositionInDiv(driver, 'ad_position_box', false);
                    await goBackPage(driver)
                } else {
                    await clickRandomPositionInDiv(driver, 'dismiss-button', false);
                }
            }

            if ((Math.random() * 10) > 3) { await scrollPage(driver); }

            if ((Math.random() * 10) > 7) { await homePageNavclickRandomButton(driver); }

            if ((Math.random() * 10) > 9) { await performMouseMovements(driver); }

            if ((Math.random()) > 5) { await performRandomActions(driver); }

            if ((Math.random()) > 5) { await homeCardclickRandomButton(driver); }

            await clickElement(driver, "#close_button");
            await clickElement(driver, "#close-ad-button");
            await clickElement(driver, "#dismiss-button");

            if (redomNo > Math.random()) {
                break;
            }
            count += 1;
        } catch (error) {
        }
    }
}

async function openBrowser() {
    try {
        console.log("Bot is starting");
        const driver = await createDriver();
        await driver.get(url);
        await delay(5000 + (Math.random() * 4000));
        console.log("Browser opened");
        if (Math.random() > 5) {
            await clickRandomPositionInDiv(driver, 'style_ad_container');
        }

        if (await elementExists(driver, "#ad_position_box")) {
            if (Math.random() > 0.5) {
                await clickRandomPositionInDiv(driver, 'ad_position_box', false);
                await goBackPage(driver)
            } else {
                await clickRandomPositionInDiv(driver, 'dismiss-button', false);
            }
        }

        await clickRandomTwoCardsAndSelectButton(driver)
        await delay(2000 + (Math.random() * 4000));

        if (await elementExists(driver, "#ad_position_box")) {
            if (Math.random() > 0.5) {
                await clickRandomPositionInDiv(driver, 'ad_position_box', false);
                await goBackPage(driver)
            } else {
                await clickRandomPositionInDiv(driver, 'dismiss-button', false);
            }
        }

        continueLoop(driver);

        await homePageNavclickRandomButton(driver);
        await delay((Math.random() * 2000) + (Math.random() * 2000));

        if (await elementExists(driver, "#ad_position_box")) {
            if (Math.random() > 0.5) {
                await clickRandomPositionInDiv(driver, 'ad_position_box', false);
                await goBackPage(driver)
            } else {
                await clickRandomPositionInDiv(driver, 'dismiss-button', false);
            }
        }

        await delay((Math.random() * 50000) + (Math.random() * 12000));
        setTimeout(async () => {
            await driver.quit();
            console.log("Browser closed");
            shutdown();
        }, (Math.random() * 50000) + Math.random() * staticRandomNumber);
    } catch (err) {
        console.error("Browser Error:", err.message || err);
        shutdown();
    }
}

openBrowser();

function shutdown() {
    process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    shutdown();
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection:', promise, 'reason:', reason);
    shutdown();
});