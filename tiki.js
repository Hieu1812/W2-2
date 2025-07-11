import axios from 'axios'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient;
async function apicrawl(link, stararr) {
    const regex = /-p(\d+)\.html\?spid=(\d+)/;
    const match = link.match(regex);
    let pdid = match[1];
    let spid = match[2];
    let star = "";
    stararr.forEach(element => {
        star += '|' + element;
    });
    const rescount = await axios.get(`https://tiki.vn/api/v2/reviews?product_id=${pdid}`)
    const pd = await axios.get(`https://tiki.vn/api/v2/products/${pdid}?spid=${spid}`);
    const reviews_count = rescount.data.reviews_count;
    const el = reviews_count / 10
    for (let i = 0; i < el.toFixed(0); i++) {
        const res = await axios.get(`https://tiki.vn/api/v2/reviews?limit=10&include=comments,contribute_info&sort=stars${star}&page=${i + 1}&spid=${spid}&product_id=${pdid}`);
        const data = res.data.data;
        for (let el of data) {
            await todb(el, pd.data);
            console.log("them thanh cong");
        }
    }

};

apicrawl("https://tiki.vn/dien-thoai-samsung-galaxy-a06-4gb-128gb-hang-chinh-hang-p276250848.html?spid=276251223", [5, 4]);

async function todb(data, pd) {
    // Ensure product exists
    await prisma.product.upsert({
        where: { id: String(data.product_id) },
        update: {},
        create: {
            id: String(data.product_id),
            name: pd.name
        }
    });


    let reviewAt = data.timeline.review_created_date;
    reviewAt = reviewAt.replace(' ', 'T') + 'Z';

    await prisma.reviewCrawl.create({
        data: {
            system_product_id: String(data.product_id),
            source: "tiki",
            source_review_id: String(data.id),
            source_customer_id: String(data.created_by.id),
            score: data.rating,
            type: data.is_photo ? "photo" : "text",
            content: data.content,
            customer_name: data.created_by.full_name,
            customer_avatar: ava(data.created_by.avatar_url),
            review_url: null,
            review_at: reviewAt
        }
    });
    for (let i = 0; i < data.images.length; i++) {
        await prisma.review_crawl_meta.create({
            data: {
                review_id: String(data.id),
                link: null,
                type: data.is_photo == true ? 1 : 2,
                source_link: data.images[i].full_path
            }
        })
    }
}

function ava(check) {
    if (check == "//tiki.vn/assets/img/avatar.png") {
        return "no avatar";
    } else {
        return check;
    }
}