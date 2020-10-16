import { updateToLocal } from "./wh-fgj/index";
import { createTable, dropTable, insert, query } from "./ke-xiaoqu/TableXiaoQu";
import express from "express";
import { fetchAllPages } from "./ke-xiaoqu";
import { EventEmitter } from "events";

const PORT: number = parseInt(process.env.PORT) || 8083;

const app = express();

app.use(express.static("public"));

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

app.get("/api/ke-xiaoqu", async (req, res) => {
    // await dropTable();
    // await createTable();
    const all = await query()
    res.json(all);
})

// fetchAllPages("wh").then(({ hub, start }) => {
//     hub.on("load", ({ page, all }) => {
//         console.log("load: ", page, all.length);
//     });
//     hub.on("success", ({ list }) => {
//         insert(list);
//     });
//     start();
// });

app.listen(PORT, () => {
    console.log(`web server listen ${PORT}`);
});
