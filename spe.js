import puppeteer from 'puppeteer';

async function scrapeDynamicPage(url) {
    // let xoayRes = await fetch('');
    // let proxyText = await xoayRes.text();
    // console.log('Proxy API response:', proxyText);
    // let proxyArr = proxyText.trim().split(':');
    // let ip_port = proxyArr.slice(0, 2).join(':');
    // let proxyUser = proxyArr[2];
    // let proxyPass = proxyArr[3];

    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    // await page.authenticate({
    //     username: "khljtiNj3Kd",
    //     password: "fdkm3nbjg45d"
    // });

    await page.goto(url, { waitUntil: 'networkidle2' });

    const name = await page.evaluate(() => {
        const pg = document.querySelector('.vR6K3w');
        return pg ? pg.textContent : '';
    });
    await autoScroll(page, '.shopee-page-controller.product-ratings__page-controller');
    const element = await page.$$('.shopee-product-comment-list');
    const review = [];
    for (const handle of element) {
        const customername = await handle.$eval('.InK5kS', el => el.textContent);
        const reviewat = await handle.$eval('.XYk98l', el => el.textContent.trim().substring(0, 16));
        const reviewcontent = await handle.$eval('.YNedDV', el => el.textContent.trim());
        review.push({ customername, reviewat, reviewcontent });
    }
    await browser.close();
    return name;
}

let link = "https://shopee.vn/Qu%C3%A0-t%E1%BA%B7ng-kh%C3%B4ng-b%C3%A1n-N%C6%B0%E1%BB%9Bc-T%E1%BA%A9y-Trang-M%E1%BA%AFt-v%C3%A0-M%C3%B4i-Chuy%C3%AAn-D%E1%BB%A5ng-2-l%E1%BB%9Bp-Maybelline-New-York-Eye-Lip-Makeup-Remover-40ml-i.37252407.23472028242"

const abc = (async () => {
    let data = await scrapeDynamicPage(link);
    console.log(data);
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
