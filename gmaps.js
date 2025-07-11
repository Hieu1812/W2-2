import puppeteer from "puppeteer";
import { PrismaClient } from "@prisma/client";
async function crawl(link) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36;vi-VN');
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'vi-VN,vi;q=0.9' });
    await page.goto(link, { waitUntil: 'networkidle2' });
    const pdname = await page.$eval('.DUwDvf.lfPIob', el => el.textContent.trim());
    const pdid = await page.$eval('.rogA2c > .Io6YTe.fontBodyMedium.kR99db.fdkmkc:nth-child(1)',el => el.textContent);
    await page.locator('div ::-p-text(Bài đánh giá)').click();
    await new Promise(r => setTimeout(r, 1500));
    const numbofrev = await page.$eval('.jANrlb > .fontBodySmall', el => el.textContent.split(" ")[0]);
    const review = [];

    await scrollPage(page, numbofrev);
    const element = await page.$$('.jftiEf.fontBodyMedium ');

    for (const handle of element) {
        const customername = await handle.$eval('.d4r55.fontTitleMedium', el => el.textContent.trim());
        const customerava = await handle.$eval('.NBa7we', el => el.src);
        const rating = await handle.$eval('.kvMYJc', el => el.getAttribute('aria-label').charAt(0));
        const seemore = await handle.$('.w8nwRe.kyuRq');
        if (seemore) {
            await seemore.click();
        }
        const content = await handle.$('.MyEned > .wiI7pd');
        let text = "";
        if (content) {
            text = await content.evaluate(el => el.textContent.trim());
        }
        const is_photo = await handle.$('.KtCyie');
        let type;
        if (is_photo) {
            type = 1;
        } else {
            type = 2;
        }
        const reviewid = await handle.$eval('.jftiEf.fontBodyMedium > div', el => el.getAttribute('data-review-id').toString());
        const customerid = await handle.$eval('.al6Kxe', el => el.getAttribute('data-href').toString().match(/contrib\/(\d+)/)[1]);

        const imgextract = await handle.$$eval('.Tya61d', (els) => {
            return els.map(el => {
                const style = window.getComputedStyle(el);
                const bgImage = style.backgroundImage.toString();
                const match = bgImage.match(/url\("([^"]+)"\)/);
                return match[1];
            }); 
        });

        review.push({ pdid, pdname, reviewid, customerid, customername, customerava, rating, text, type, imgextract });

    }
    for (const el of review) {
        await todb(el);
    }
    await browser.close();
    return review
}

const link = "https://www.google.com/maps/place/C%E1%BB%ADa+h%C3%A0ng+%C3%94+Mai+-+M%E1%BB%A9t+Trung+-+Thanh/@21.0176412,105.8087758,15.5z/data=!4m6!3m5!1s0x3135ab003dea62cb:0xfbaa647db6d0d952!8m2!3d21.0168354!4d105.8111767!16s%2Fg%2F11lmf_b5f8?entry=ttu&g_ep=EgoyMDI1MDcwNy4wIKXMDSoASAFQAw%3D%3D";

(async () => {
    (await crawl(link));
})();


async function scrollPage(page, numbofrev) {
    let numb = 0;
    while (numbofrev > numb) {
        await page.evaluate(`document.querySelector(".DxyBCb").scrollBy(0, 550)`);
        if (await page.$('.jftiEf.fontBodyMedium')) {
            numb += 1
            console.log(numb);
        }
        // const abc = await page.$(`.m6QErb.XiKgde > .jftiEf.fontBodyMedium:nth-child(26)`)
        // if (abc) {
        //     check = false;
        // }
        await new Promise(r => setTimeout(r, 500));
    }
}


async function todb(data) {
    const prisma = new PrismaClient;
    await prisma.product.upsert({
        where: { id: data.pdid },
        update: {},
        create: {
            id: data.pdid,
            name: data.pdname
        }
    });

    await prisma.reviewCrawl.create({
        data: {
            system_product_id: data.pdid,
            source: "Google Map",
            source_review_id: data.reviewid,
            source_customer_id: data.customerid,
            score: Number(data.rating),
            type: data.type == 1 ? "photo" : "text",
            content: data.text,
            customer_name: data.customername,
            customer_avatar: data.customerava,
            review_url: null,
            review_at: null
        }
    });
    for (let i = 0; i < data.imgextract.length; i++) {
        await prisma.review_crawl_meta.create({
            data: {
                review_id: data.reviewid,
                link: null,
                type: Number(data.type),
                source_link: data.imgextract[i]
            }
        })
    }
}
