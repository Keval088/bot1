const { Builder, By } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const userAgentArray = require("./userAgent");
const platform = require('platform')
const url = "https://sh6ewzoig.play.gamezop.com";
const staticRandomNumber = 27000;
const { PythonShell } = require('python-shell');
const pythonPath = '/app.py'
const { randomInt } = require("crypto");
let driver

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callPython = async (x, y) => {
    const options = {
        mode: 'text',
        pythonOptions: ['-u'],
        scriptPath: './',
        args: [parseInt(x), parseInt(y)]
    };

    await PythonShell.run(pythonPath, options, function (err, results) {
        if (err) throw console.error('err: -> ', err);;
        console.log('results: %j', results);
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

            const screenDimensions = await driver.executeScript(`
                return {
                    screenWidth: window.innerWidth,
                    screenHeight: window.innerHeight
                };
            `);

            // Calculate the absolute position
            const absoluteX = screenDimensions.screenWidth - divDimensions.rect.left;
            const absoluteY = screenDimensions.screenHeight - divDimensions.rect.top;

            await callPython(absoluteX, absoluteY)

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

            console.info(`Clicked element: :- ${selector}`);
            await delay(1000 + Math.random() * staticRandomNumber);
        } else {
            console.error(`#Element not found: ${selector}`);
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
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Calculate the absolute position
            const absoluteX = divDimensions.rect.left;
            const absoluteY = divDimensions.rect.top;

            console.info(`divDimensions.rect.left: :- ${divDimensions.rect.left}`);
            console.info(`divDimensions.rect.top: :- ${divDimensions.rect.top}`);

            console.info(`divDimensions.width: :- ${absoluteX}`);
            console.info(`divDimensions.height: :- ${absoluteY}`);

            await callPython(absoluteX, absoluteY)

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

            console.log(`Clicked element: :- ${selector}`);
            await delay(6000 + (Math.random() * staticRandomNumber));
        } else {
            console.error(`#Element not found: ${selector}`);
        }
    } catch (error) {
    }
}

async function clickRandomTwoCardsAndSelectButton(driver) {
    try {
        console.info("Select Game Card on First Page");

        // Select all card elements
        const cardSelector = '.style_inner_cat_group__E_iG_ .style_card_holder__rwIrg';
        const cards = await driver.executeScript(`return Array.from(document.querySelectorAll('${cardSelector}')).map(card => card.outerHTML);`);

        if (cards.length < 2) {
            console.error("# Game Card :- Not enough cards to click.");
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
        await delay(4000 + (Math.random() * 6000) + (Math.random() * staticRandomNumber));
        await adsCloser(driver);
    } catch (error) {
    }
}

async function homePageNavclickRandomButton(driver) {
    try {
        const cardSelector = '.style_nav_list__7i1tB';
        const cards = await driver.executeScript(`return Array.from(document.querySelectorAll('${cardSelector}')).map(card => card.outerHTML);`);

        if (cards.length < 1) {
            console.error("# Home Nav:- Not enough cards to click.", cards.length);
            return;
        }

        const selectButtonSelector = `.style_nav_list__7i1tB:nth-child(${parseInt(Math.random() * cards.length) + 1})`;
        await clickElementWithMouse(driver, selectButtonSelector);
        // await goBackPage(driver)

        await adsCloser(driver);
        await popupAdsCloser(driver)
    } catch (error) {
    }
}

async function homeCardclickRandomButton(driver) {
    try {
        const cardSelector = '[class^="style_card_wrap"]';
        const cards = await driver.executeScript(`return Array.from(document.querySelectorAll('${cardSelector}')).map(card => card.outerHTML);`);

        if (cards.length < 1) {
            console.error("# Card:- Not enough cards to click.", cards.length);
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

            const screenDimensions = await driver.executeScript(`
                return {
                    screenWidth: window.innerWidth,
                    screenHeight: window.innerHeight
                };
            `);

            // Calculate the absolute position
            const absoluteX = screenDimensions.screenWidth - divDimensions.rect.left;
            const absoluteY = screenDimensions.screenHeight - divDimensions.rect.top;

            console.info(`divDimensions.rect.left: :- ${divDimensions.rect.left}`);
            console.info(`divDimensions.rect.top: :- ${divDimensions.rect.top}`);

            await callPython(absoluteX, absoluteY)

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

            console.log(`Clicked at position: :- (${absoluteX}, ${absoluteY})`);
            console.log(`Clicked On position: :- ${divSelector}`);
            await delay(1000 + Math.random() * staticRandomNumber); // Optional delay
        } else {
            console.error(`#Element not found: ${divSelector}`);
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

async function createDriver() {
    try {
        const randomUserAgent = userAgentArray[Math.floor(Math.random() * userAgentArray.length)];

        let info = platform.parse(randomUserAgent);
        let osFamily = info.os.family;
        let screenArray
        if (osFamily === 'Android') {
            screenArray = [
                [240, 320],
                [320, 480],
                [480, 800],
                [600, 1024],
                [720, 1280],
                [800, 1280],
                [1080, 1920],
                [1440, 2560],
                [1200, 1920]
            ];
        } else if (osFamily === 'iOS') {
            screenArray = [
                [320, 480],
                [375, 667],
                [414, 736],
                [375, 812],
                [414, 896],
                [390, 844],
                [1024, 1366],
                [768, 1024],
                [834, 1112]
            ];
        } else {
            screenArray = [
                [640, 480],
                [800, 600],
                [1024, 768],
                [1280, 800],
                [1280, 1024],
                [1366, 768],
                [1600, 900],
                [1920, 1080],
                [2560, 1440],
                [3840, 2160]
            ];
        }
        let randomScreenElement = screenArray[Math.floor(Math.random() * screenArray.length)];

        // Set the path to your Firefox binary
        const firefoxBinaryPath = '/home/horizon/snap/firefox/common/.cache/mozilla/firefox/a7ey2oxf.default'; // Update this path
        // const { width, height } = generateRandomScreenSize(randomUserAgent);
        // const options = new firefox.Options().setBinary(firefoxBinaryPath).setPreference('general.useragent.override', randomUserAgent);

        const options = new firefox.Options().setPreference('general.useragent.override', randomUserAgent);
        options.setPreference('webgl.disabled', true);
        options.setPreference('media.navigator.enabled', false);
        options.setPreference('privacy.resistFingerprinting', true);
        options.addArguments('--headless=new');
        options.addArguments('--disable-blink-features=AutomationControlled');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        const driver = new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
        await driver.manage().window().setRect({ width: randomScreenElement[0], height: randomScreenElement[1] });
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
            if (Math.random() > 0.7) {
                await callPython(x, y)
                // Adjust probability
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
    await adsCloser(driver);
}

async function continueLoop(driver) {
    while (true) {
        try {

            popupAdsCloser(driver)

            // const dismissButton = await driver.wait(until.elementLocated(By.xpath('//*[@id="dismiss-button"]')), 10000);
            // await driver.wait(until.elementIsVisible(dismissButton), 10000);
            // await dismissButton.click();

            if ((Math.random() * 10) > 3) { await scrollPage(driver); }

            // if ((Math.random() * 10) > 7) { await homePageNavclickRandomButton(driver); }

            if ((Math.random() * 10) > 9) { await performMouseMovements(driver); }

            if ((Math.random()) > 5) { await performRandomActions(driver); }

            // if ((Math.random()) > 5) { await homeCardclickRandomButton(driver); }

            await clickElement(driver, "#close_button");
            await clickElement(driver, "#close-ad-button");
            await clickElement(driver, "#dismiss-button");
            await clickElement(driver, "#dismiss-button-element");
        } catch (error) {
        }
    }
}

async function popupAdsCloser(driver) {
    if (await elementExists(driver, "#ad_position_box")) {
        if (Math.random() > 0.5) {
            await clickRandomPositionInDiv(driver, 'ad_position_box', false);
            await goBackPage(driver)
        } else {
            await clickRandomPositionInDiv(driver, 'dismiss-button', false);
        }
    }
}

async function adsCloser(driver) {
    await clickElement(driver, ".btn skip");
    await clickElement(driver, "#dismiss-button");
    await clickElement(driver, "#close-ad-button");
    await clickElement(driver, "#close_button");
    await clickElement(driver, "#dismiss-button-element");
}

async function openBrowser() {
    try {
        console.log("Bot is starting");
        driver = await createDriver();
        await driver.get(url);
        await delay(5000 + (Math.random() * 4000));
        continueLoop(driver);
        console.log("Browser opened");
        if (Math.random() > 5) {
            await clickRandomPositionInDiv(driver, 'style_ad_container');
            await delay((Math.random() * 6000) + (Math.random() * staticRandomNumber));
            await goBackPage(driver)
        }

        await popupAdsCloser(driver)
        await clickRandomTwoCardsAndSelectButton(driver)
        delay(2000 + (Math.random() * 4000));
        await popupAdsCloser(driver)
        await homePageNavclickRandomButton(driver);
        await delay((Math.random() * 2000) + (Math.random() * 2000));

        popupAdsCloser(driver)

        await delay((Math.random() * 2000) + (Math.random() * 2000));

        for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
            popupAdsCloser(driver)
            await homeCardclickRandomButton(driver);
            await delay((Math.random() * 2000) + (Math.random() * 2000));
            popupAdsCloser(driver)
            await delay((Math.random() * 25000) + (Math.random() * 20600));
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