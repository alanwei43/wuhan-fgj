export function query({ start, end, top }) {
    console.log("[query] ", arguments[0]);

    return getDataList().then(response => {
        let list = response;
        if (typeof start === "number" && !isNaN(start)) {
            list = list.filter(item => item.day >= start);
        }
        if (typeof end === "number" && !isNaN(end)) {
            list = list.filter(item => item.day <= end);
        }
        if (typeof top === "number" && !isNaN(end)) {
            list = list.slice(0, top);
        }
        return list;
    })
}
export function getDataList() {
    const key = new Date().toISOString().split("T")[0];
    const localData = localStorage.getItem(key);
    if (localData) {
        return Promise.resolve(JSON.parse(localData));
    }

    return fetch("/api/get-data").then(res => res.json()).then(data => {
        data.forEach(item => {
            // 加工数据
            item.residentials.forEach(res => {
                item.groups = item.groups || {};
                item.groups[res.district] = res;
            });
        });
        localStorage.setItem(key, JSON.stringify(data));
        return data;
    });
}