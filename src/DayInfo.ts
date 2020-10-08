import cheerio from "cheerio";

export class DayInfo {

    public day: number;
    public residentials: Array<{ district: string, area: number, count: number }>

    constructor(html: string) {
        const $ = cheerio.load(html);

        const dayMatch: Array<string> = /(\d+)年(\d+)月(\d+)日.+/.exec($(".article h2").text());
        if (dayMatch && dayMatch.length === 4) {
            const dayParts = [dayMatch[1], dayMatch[2].padStart(2, "0"), dayMatch[3].padStart(2, "0")];
            this.day = parseInt(dayParts.join(""));
        }

        this.residentials = this.getResidentials($);
    }

    private getResidentials($: cheerio.Root): Array<{ district: string, area: number, count: number }> {
        return Array.from($(".TRS_UEDITOR table tbody tr"))
            .filter((ele, index) => index >= 2 && index <= 16)
            .map(ele => $(ele))
            .map($ele => ({
                district: $ele.find("td").eq(0).text(),
                count: parseFloat($ele.find("td").eq(1).text()),
                area: parseFloat($ele.find("td").eq(2).text()),
            }));
    }
}