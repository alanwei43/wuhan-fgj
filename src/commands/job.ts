import { Options } from "yargs";
import { CronJob } from "cron";
import { fetchData } from "../ke-xiaoqu";
import { Logger } from "../utils/Logger";

export const command = "job";
export const desc = "定时作业";
export const builder: { [key: string]: Options } = {
    "mongodb": {
        default: "mongodb://mongo:123456@localhost:27017", // mongodb://[username:password@]host1[:port1][,...hostN[:portN]]][/[database][?options]]
        type: "string",
        describe: "MongoDB数据库链接",
        requiresArg: true
    }
};
export const handler = function (argv: { mongodb: string }) {
    const logger = new Logger("job");

    new CronJob("* * * 1 * *", () => {
        xiaoQuJob(logger, argv.mongodb);
    }, null, true, "Asia/Shanghai").start();
    logger.debug("定时作业设置完成");

    xiaoQuJob(logger, argv.mongodb);
}

function xiaoQuJob(logger: Logger, mongodb: string) {
    logger.debug("开始设置定时作业");
    ["bj", "tj", "wh"].reduce((prev, next) => {
        return prev.then(() => {
            logger.debug(`${next} 开始`);
            return fetchData(mongodb, next);
        });
    }, Promise.resolve());
}