import cheerio from "cheerio";
import fetch from "node-fetch";

export function parseHtml(url: string): Promise<{ $: cheerio.Root, html: string }> {
    return fetch(url).then(response => response.text()).then(html => ({ $: cheerio.load(html), html: html }));
}
