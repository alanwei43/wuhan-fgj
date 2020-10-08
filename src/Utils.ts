import cheerio from "cheerio";
import fetch from "node-fetch";
import { PageQuery } from "./PageQuery";
import { DayInfo } from "./DayInfo";
import fs from "fs";
import path from "path";

export function parseHtml(url: string): Promise<{ $: cheerio.Root, html: string }> {
    return fetch(url).then(response => response.text()).then(html => ({ $: cheerio.load(html), html: html }));
}

export function updateToLocal(): Promise<string> {
    return new Promise((resolve, reject) => {
        const filePath = path.resolve(path.join("data", `${new Date().toISOString().split("T")[0]}.json`));
        if (fs.existsSync(filePath)) {
            resolve(filePath);
            return;
        }

        new PageQuery().getList().then(iterator => {
            const all: Promise<Array<DayInfo>> = Array.from(iterator()).reduce((prev, next) => prev.then(items => next.then(response => items.concat(response))), Promise.resolve([]));

            all.then(respones => respones.map(r => ({
                day: r.day,
                residentials: r.residentials
            }))).then(response => {
                new Date().toString()
                fs.writeFileSync(filePath, JSON.stringify(response, null, "\t"), {
                    encoding: "utf-8"
                });
                resolve(filePath);
            }).catch(err => reject(err));
        }).catch(err => reject(err));

    });
}