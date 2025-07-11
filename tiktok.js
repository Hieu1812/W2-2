import Tiktok from '@tobyg74/tiktok-api-dl'
import { PrismaClient } from '@prisma/client';
const videoUrl = "https://www.tiktok.com/@kikvikpik/video/7524720643112258838?is_from_webapp=1&sender_device=pc&web_id=7506193949943776784";

Tiktok.Downloader(videoUrl, { version: "v1" })
    .then((result) => {
        todb(result.result);
        console.log(result.result);
    })
    .catch((err) => {
        console.log(err);
    });

async function todb(data) {
    const prisma = new PrismaClient;
    await prisma.product.upsert({
        where: { id: data.id },
        update: {},
        create: {
            id: data.id,
            name: "tiktok"
        }
    });

    await prisma.reviewCrawl.create({
        data: {
            system_product_id: data.id,
            source: "Tiktok",
            source_review_id: data.id,
            source_customer_id: data.author.uid,
            score: null,
            type: data.type,
            content: data.desc,
            customer_name: data.author.nickname,
            customer_avatar: data.author.avatarMedium[0],
            review_url: null,
            review_at: unixtoiso(data.createTime)
        }
    });
    await prisma.review_crawl_meta.create({
        data: {
            review_id: data.id,
            link: null,
            type: data.type == 'video' ? 2 : 1,
            source_link: data.video.playAddr[0]
        }
    })
}

function unixtoiso(time) {
    const nhans = time * 1000;
    const date = new Date(nhans);
    return date.toISOString();

}