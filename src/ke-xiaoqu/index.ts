import { EventEmitter } from "events";
import { DataStorage } from "../storage";
import { MongoDbImpl } from "../storage/MongoDbImpl";
import { parseHtml } from "../utils";
import { Logger } from "../utils/Logger";

export interface XiaoQuInfo {
    id: string
    city: string
    name: string
    totalPrice: number
    priceDesc: string
    totalOnSaleCount: number
    district: string
    bizCircle: string
    rentCount: number
    buildYear: number
}

function fetchPage(url: string): Promise<Array<XiaoQuInfo>> {

    return parseHtml(url).then(({ $, html }) => {
        const list = Array.from($(".xiaoquListItem")).map(ele => {
            const $ele = $(ele);
            const $title = $ele.find(".title a");
            const link = $title.attr("href");

            return {
                id: link,
                no: link.replace(/xiaoqu\/(\d+)/, "$1"),
                city: link.replace(/\/\/(\w+)\.ke\.com/, "$1"),
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

function fetchAllPages(city: string, getPageUrl: (city: string, page: number) => string): Promise<{ hub: EventEmitter, start: () => Promise<XiaoQuInfo[]> }> {
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
                const url = getPageUrl(city, pageNum);
                hub.emit("load", {
                    totalPages: totalPages,
                    page: pageNum,
                    all: allList,
                    url: url,
                });
                return fetchPage(url).then(curList => {
                    hub.emit("success", {
                        totalPages: totalPages,
                        page: pageNum,
                        list: curList,
                        url: url,
                    });
                    return allList.concat(curList);
                }).catch(err => {
                    hub.emit("fail", {
                        totalPages: totalPages,
                        page: pageNum,
                        error: err,
                        url: url,
                    });
                    return allList;
                });
            }), Promise.resolve([])).then(list => {
                hub.emit("finish");
                return list;
            });
        }
        return { hub, start }
    });
}

export function fetchData(mongodb: string, cityCode: string) {
    const logger = new Logger("beike");
    const storage: DataStorage = new MongoDbImpl({
        uri: mongodb,
        db: "beike"
    });

    const urls = [
        (city: string, page: number) => `https://${city}.ke.com/xiaoqu/pg${page}su1cro52/`,
        (city: string, page: number) => `https://${city}.ke.com/xiaoqu/pg${page}cro21/`,
        (city: string, page: number) => `https://${city}.ke.com/xiaoqu/pg${page}/`,
        (city: string, page: number) => `https://${city}.ke.com/xiaoqu/pg${page}cro22/`
    ];

    return urls.reduce((prev, next) => {
        return prev.then(() => {
            return fetchAllPages(cityCode, next).then(({ hub, start }) => {
                return new Promise((resolve) => {
                    hub.on("success", ({ list, url }: { url: string, list: Array<XiaoQuInfo> }) => {
                        logger.debug(`${url} : ${list.length}`);
                        storage.add("xiaoqu", list);
                    });
                    hub.on("fail", ({ url }) => {
                        logger.debug(`fail: ${url}`);
                    });
                    hub.on("finish", () => {
                        logger.debug(`${cityCode} finished`);
                        resolve();
                    });
                    start();
                });
            });
        });
    }, Promise.resolve());
}