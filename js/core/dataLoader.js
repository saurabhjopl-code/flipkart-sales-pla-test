import { STATE } from "./stateManager.js";
import { startProgress, finishProgress } from "./progressEngine.js";

async function loadCSV(url) {
    const response = await fetch(url);
    const text = await response.text();

    const rows = text.split("\n").map(r => r.split(","));
    const headers = rows.shift();

    return rows.map(row => {
        let obj = {};
        headers.forEach((h, i) => obj[h.trim()] = row[i]);
        return obj;
    });
}

export async function loadAllData() {
    startProgress();

    STATE.rawData.CDR = await loadCSV("CDR_URL");
    STATE.rawData.CFR = await loadCSV("CFR_URL");
    STATE.rawData.PPR = await loadCSV("PPR_URL");
    STATE.rawData.CKR = await loadCSV("CKR_URL");
    STATE.rawData.GMV = await loadCSV("GMV_URL");
    STATE.rawData.CTR = await loadCSV("CTR_URL");

    finishProgress();
}
