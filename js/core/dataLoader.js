import { STATE } from "./stateManager.js";
import { startProgress, finishProgress } from "./progressEngine.js";
import { API_CONFIG } from "../config/apiConfig.js";

function parseCSV(text) {
    const rows = text.trim().split(/\r?\n/);
    const headers = rows[0].split(",").map(h => h.trim());

    return rows.slice(1).map(row => {
        const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        const obj = {};

        headers.forEach((h, i) => {
            let val = values[i] || "";
            val = val.replace(/^"|"$/g, "").trim();
            obj[h] = val;
        });

        return obj;
    });
}

async function loadCSV(url) {
    const response = await fetch(url);
    const text = await response.text();
    return parseCSV(text);
}

export async function loadAllData() {
    startProgress();

    for (let key in API_CONFIG) {
        STATE.rawData[key] = await loadCSV(API_CONFIG[key]);
    }

    finishProgress();
}
