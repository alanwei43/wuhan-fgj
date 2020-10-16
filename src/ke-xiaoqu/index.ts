import { EventEmitter } from "events";
import { parseHtml } from "../Utils";
export interface XiaoQuInfo {
    link: string
    name: string
    totalPrice: number
    priceDesc: string
    totalOnSaleCount: number
    district: string
    bizCircle: string
    rentCount: number
    buildYear: number
}

function getPageUrl(city: string, page: number): string {
    return `https://${city}.ke.com/xiaoqu/pg${page}/`;
}

function fetchPage(city: string, page: number): Promise<Array<XiaoQuInfo>> {
    const url = getPageUrl(city, page);

    return parseHtml(url).then(({ $, html }) => {
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
                buildYear: parseInt((/(\d+)年建成/.exec($ele.find(".positionInfo").text()) || [])[1])
            }
        });
        return list;
    });
}

export function fetchAllPages(city: string): Promise<{ hub: EventEmitter, start: () => Promise<XiaoQuInfo[]> }> {
    const url = getPageUrl(city, 1);

    return parseHtml(url).then(({ $ }) => {
        const { totalPage }: { totalPage: number } = JSON.parse($(".house-lst-page-box").attr("page-data"));
        const pageNumbers: number[] = [];
        for (let index = 0; index < totalPage; index++) {
            pageNumbers.push(index + 1);
        }
        return pageNumbers;
    }).then(pageNumbers => {
        const totalPages = pageNumbers[pageNumbers.length - 1];
        const hub = new EventEmitter();
        function start() {
            return pageNumbers.reduce((prev, pageNum) => prev.then(allList => {
                hub.emit("load", {
                    totalPages: totalPages,
                    page: pageNum,
                    all: allList
                });
                return fetchPage(city, pageNum).then(curList => {
                    hub.emit("success", {
                        totalPages: totalPages,
                        page: pageNum,
                        list: curList
                    });
                    return allList.concat(curList);
                });
            }), Promise.resolve([]))
        }
        return { hub, start }
    });
}