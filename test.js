const puppeteer = require('puppeteer');
const userAgentArray = require('./userAgent');
const fs = require('fs/promises');
const app = require('express')();
const port = 54;
const options = ['A', 'B', 'C'];
const userAgents = userAgentArray;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function elementExists(page, selector) {
    return await page.evaluate((selector) => {
        return document.querySelector(selector) !== null;
    }, selector);
}

async function clickElement(page, selector) {
    try {
        const elementExists = await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (element) {
                element.click();
                return true;
            }
            return false;
        }, selector);

        if (elementExists) {
            console.log(`Clicked element with selector: ${selector}`);
            await delay(1000 + Math.random() * 1000);
        } else {
            console.log(`Element ${selector} not found.`);
        }
    } catch (error) {
        console.error(`Error clicking element: ${selector} - ${error.message}`);
    }
}

async function scrollPage(page) {
    try {
        await page.evaluate(() => {
            const height = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            const randomScroll = Math.random() * (height - viewportHeight);
            window.scrollTo(0, randomScroll);
        });
        await delay(2000 + Math.random() * 1000);
    } catch (error) {
        console.error('Error scrolling page:', error.message);
    }
}

async function answerQuestion(page, questionNumber, answer) {
    try {
        const questionSelector = `.question_${questionNumber}`;
        const optionSelector = `${questionSelector} .option_1_${answer}`;

        const questionExists = await elementExists(page, questionSelector);

        if (questionExists) {
            await clickElement(page, optionSelector);
            console.log(`Answered ${questionSelector} with option: ${answer}`);
        } else {
            console.log(`Question ${questionSelector} not found.`);
        }
    } catch (error) {
        console.error(`Error in answerQuestion: ${error.message}`);
    }
}

async function createBrowser() {
    const browser = await puppeteer.launch({ headless: false });
    const [page] = await browser.pages();
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(randomUserAgent);
    return { browser, page };
}

async function performMouseMovements(page) {
    try {
        const { width, height } = await page.evaluate(() => ({
            width: window.innerWidth,
            height: window.innerHeight
        }));

        function getRandomPosition() {
            return {
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height)
            };
        }

        for (let i = 0; i < 5; i++) {
            const { x, y } = getRandomPosition();

            await page.evaluate(({ x, y }) => {
                const event = new MouseEvent('mousemove', {
                    clientX: x,
                    clientY: y,
                    bubbles: true
                });
                document.dispatchEvent(event);
            }, { x, y });

            if (Math.random() > 0.5) {
                await page.evaluate(({ x, y }) => {
                    const clickEvent = new MouseEvent('click', {
                        clientX: x,
                        clientY: y,
                        bubbles: true
                    });
                    document.dispatchEvent(clickEvent);
                }, { x, y });
            }

            await delay(200 + Math.random() * 300);
        }
    } catch (error) {
        console.error('Error performing mouse movements and clicks:', error.message);
    }
}

async function performRandomActions(page) {
    const divs = await page.$$(
        '[id^="ads"], [id^="aswift_1"], [id^="ebDiv"], [id^="ns-"]'
    );
    if (divs.length >= 0) {
        await divs[0]?.click();
    }
    return
}

app.listen(port, async () => {
    try {
        setTimeout(async () => {
            const { browser, page } = await createBrowser();

            try {
                await page.goto('https://38.mark.qureka.com');
                // await page.goto('https://www.w3schools.com/js/js_output.asp');
                await delay(2000 + Math.random() * 3000);

                await scrollPage(page);

                await clickElement(page, '.fc-cta-consent');

                await delay(3000 + Math.random() * 2000);
                await scrollPage(page);

                await performMouseMovements(page);
                await performRandomActions(page);

                const randomAnswer1 = options[Math.floor(Math.random() * options.length)];
                await answerQuestion(page, 1, randomAnswer1);

                await clickElement(page, '.close-btn');
                await clickElement(page, '.skip');
                await scrollPage(page);

                await delay(5000 + Math.random() * 5000);
                await performMouseMovements(page);
                await performRandomActions(page);
                await scrollPage(page);

                const randomAnswer2 = options[Math.floor(Math.random() * options.length)];
                await answerQuestion(page, 2, randomAnswer2);

                await clickElement(page, '.close-btn');
                await clickElement(page, '.skip');
                await scrollPage(page);

                await delay(5000 + Math.random() * 5000);
                await performMouseMovements(page);
                await performRandomActions(page);

                console.log("================== Completed ==================");
            } catch (error) {
                console.error('Error during processing:', error.message);
            } finally {
                // await browser.close();
            }
        }, 5000);
    } catch (err) {
        console.error("Browser Error: ", err.message || err);
    }
});
