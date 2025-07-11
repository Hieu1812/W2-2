import puppeteer from 'puppeteer';

async function scrapeDynamicPage(url, stararr) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle2' });

    const name = await page.evaluate(() => {
        const el = document.querySelector('.sc-c0f8c612-0.dEurho');
        return el.textContent;
    });

    await autoScroll(page, '.customer-reviews__pagination');
    const star = await page.$$('.filter-review__item  ');
    for (let i = 0; i < stararr.length; i++) {
        const starElement = star[stararr[i] - 1];
        await starElement.click();
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    const reviews = [];

    let hasNext = true;
    while (hasNext) {
        const elements = await page.$$('.customer-reviews__inner > .sc-4b1322bd-5.hcsJQG.review-comment');
        for (const handle of elements) {
            const popup = await page.$('.btn-close')
            if (popup){
                await popup.click();
            } else {
                 const customername = await handle.$eval('.review-comment__user-name', el => el.textContent.trim());


            const showMoreBtn = await handle.$('.show-more-content');
            if (showMoreBtn) {
                await showMoreBtn.click();
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            const reviewcontent = await handle.$eval('.review-comment__content', el => el.textContent.trim().replace("Thu gọn", ""));

            const createdat = await handle.$eval('.review-comment__created-date > span', el => el.textContent.trim());
            let customerava;
            if (await handle.$('.sc-9162b613-0.erIzSq.has-character')) {
                customerava = "no ava";
            } else {
                customerava = await handle.$eval('.sc-9162b613-0.erIzSq > img', el => el.src).catch(() => null);
            }

            let type;
            if (await handle.$('.review-comment__images')) {
                type = "images";
            } else if (await handle.$('.review-comment__videos')) {
                type = "video";
            } else {
                type = "text";
            }

            reviews.push({ customername, customerava, type, reviewcontent, createdat });
            }
           
        }

        const nextbt = await page.$('.btn.next');
        if (nextbt) {
            const isDisabled = await page.$('.customer-reviews__empty');
            if (!isDisabled) {
                await nextbt.click();
                await new Promise(resolve => setTimeout(resolve, 1200));
            } else {
                hasNext = false;
            }
        } else {
            hasNext = false;
        }
    }

    await browser.close();
    return reviews;
}


let link = "https://tiki.vn/dien-thoai-samsung-galaxy-a06-4gb-128gb-hang-chinh-hang-p276250848.html"

const abc = (async () => {
    const data = await scrapeDynamicPage(link,[5,4]);
    console.log(data)
})();

async function autoScroll(page, selector) {
    await page.evaluate(async (selector) => {
        let check = false;
        while (!check) {
            window.scrollBy(0, 100);
            await new Promise(resolve => setTimeout(resolve, 200));
            const element = document.querySelector(selector);
            if (element) {
                check = true;
            }
        }
    }, selector);
}
