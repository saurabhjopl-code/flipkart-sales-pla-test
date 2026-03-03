import { STATE, setMeta } from "./stateManager.js";
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
            val = val.replace(/,/g, "");
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

function buildACCList() {

    const accSet = new Set();

    Object.values(STATE.rawData).forEach(sheet => {
        sheet.forEach(row => {
            if (row.ACC && row.ACC !== "") {
                accSet.add(row.ACC.trim());
            }
        });
    });

    const accList = Array.from(accSet).sort();

    setMeta({ accList });

    console.log("ACC Loaded:", accList); // Debug check
}

export async function loadAllData() {

    startProgress();

    for (let key in API_CONFIG) {
        STATE.rawData[key] = await loadCSV(API_CONFIG[key]);
    }

    buildACCList();   // ensure meta is built AFTER data load

    finishProgress();
}
