import fetch from "node-fetch";
import { parseHtml } from "../Utils";
import { DayInfo } from "./DayInfo";

export class PageQuery {
    private _mainUrl: string = "http://fgj.wuhan.gov.cn/xxgk/xxgkml/sjfb/mrxjspfcjtjqk/";

    private getPages(): Promise<Array<{ page: number, link: string }>> {
        return parseHtml(this._mainUrl)
            .then(({ $, html }) => {
                const pageTotalCount = parseInt(/createPageHTML\((\d+)/.exec(html)[1]); //parseInt(html.replace(/createPageHTML\((\d+)/, "$1"));
                if (isNaN(pageTotalCount)) {
                    throw new Error("Error page number");
                }

                const pages = [];
                for (let index = 0; index < pageTotalCount; index++) {
                    pages.push({
                        page: index,
                        link: index === 0 ? this._mainUrl : `${this._mainUrl}/index_${index}.shtml`
                    });
                }
                return pages;
            });
    }

    private getMonthLinks(pageUrl: string): Promise<Array<{ title: string, link: string }>> {
        return parseHtml(pageUrl).then(({ $ }) => {
            return Array.from($(".info-list li a")).map(ele => ({
                title: $(ele).text(),
                link: ele.attribs.href
            }));
        });
    }

    private getSaleInfo(pageUrls: Array<string>): Promise<Array<DayInfo>> {
        return pageUrls.reduce((prev: Promise<Array<DayInfo>>, next: string) =>
            prev.then(items => fetch(next)
                .then(res => res.text())
                .then(html => {
                    items.push(new DayInfo(html));
                    return items;
                })
            ), Promise.resolve([]));
    }

    getList(): Promise<() => IterableIterator<Promise<Array<DayInfo>>>> {
        const monthInfo = this.getMonthLinks, salfeInfo = this.getSaleInfo;
        return this.getPages().then(pages => {
            return function* () {
                for (let item of pages) {
                    const p = monthInfo(item.link);
                    yield p.then(items => salfeInfo(items.map(item => item.link)));
                }
            };
        });
    }
}