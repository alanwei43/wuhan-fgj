import { parseHtml } from "../Utils";
import path from "path";
import fs from "fs";

export function download() {
    const filePath = path.resolve(path.join("data", `ke-xiaoqu-${new Date().toISOString().split("T")[0]}.json`))
    const url = `https://wh.ke.com/xiaoqu/pg1/`;
    parseHtml(url).then(({ $, html }) => {
        const list = Array.from($(".xiaoquListItem")).map(ele => {
            const $ele = $(ele);
            const $title = $ele.find(".title a");

            return {
                link: $title.attr("href"),
                name: $title.text(),
                totalPrice: parseFloat($ele.find(".totalPrice").text()),
                priceDesc: $ele.find(".priceDesc").text(),
                totalOnSaleCount: parseInt($ele.find(".totalSellCount span").text()) || null,
                district: $ele.find(".district").text(),
                bizCircle: $ele.find(".bizcircle").text(),
                rentCount: parseInt($ele.find(".houseInfo a").eq(1).text()),
                buildYear: (/(\d+)年建成/.exec($ele.find(".positionInfo").text()) || [])[1]
            }
        });

        fs.writeFileSync(filePath, JSON.stringify(list, null, "\t"), { encoding: "utf8" });
    });
}