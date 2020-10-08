import { updateToLocal } from "./Utils";
import express from "express";

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

app.listen(PORT, () => {
    console.log(`web server listen ${PORT}`);
})