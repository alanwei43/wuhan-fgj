import { Options } from "yargs";
import http from "http";
import express from "express";
import ws from "ws";
import bodyParser from "body-parser";
import { updateToLocal } from "../wh-fgj/index";

export const command = "web [port]";
export const desc = "启动web服务";
export const builder: { [key: string]: Options } = {
    port: {
        default: 8083,
        type: "number",
        describe: "端口号"
    },
    "enable-ws": {
        default: true,
        type: "boolean",
        requiresArg: false,
        describe: "是否开启Web Socket"
    },
    "ws-path": {
        default: "/ws",
        type: "string",
        requiresArg: false,
        describe: "Web Socket URL路径"
    }
};
export const handler = function (argv: { port: number, enableSocket: boolean, wsPath: string }) {

    const app = express();
    const server = http.createServer(app);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));

    if (argv.enableSocket) {
        const wss = new ws.Server({ server: server, path: argv.wsPath });
        wss.on("connection", connection => {
            connection.on("message", (message: string) => {
                console.log("客户端消息: " + message);
            });
            connection.on("close", () => {
                console.log("客户端关闭链接");
            });
        });
    }


    app.get("/api/get-data", (req, res) => {
        updateToLocal().then(dataFilePath => {
            res.sendFile(dataFilePath, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
        }).catch(err => {
            console.error(err);
            res.json({
                error: err.message
            });
        });
    });


    server.listen(argv.port, () => {
        console.log(`web server listen ${argv.port}`);
    });
}