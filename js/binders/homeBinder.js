import { getGMVSummary } from "../engines/summary/gmvSummaryEngine.js";
import { getCDRSummary } from "../engines/summary/adsSummaryEngine.js";
import { getCTRSummary } from "../engines/summary/ctrSummaryEngine.js";
import { renderHomeDashboard } from "../renderers/summaryRenderer.js";
import { createBarChart } from "../engines/charts/barChartEngine.js";
import { applyFilters } from "../core/filterEngine.js";
import { parseDDMMYYYY } from "../core/dateEngine.js";

export function renderHome() {

    const gmv = getGMVSummary();
    const cdr = getCDRSummary();
    const ctr = getCTRSummary();

    renderHomeDashboard(gmv, cdr, ctr);

    // GMV Trend
    const gmvData = applyFilters("GMV");
    const gmvGrouped = {};

    gmvData.forEach(row => {
        const date = row["Order Date"];
        const amount = Number(row["Final Sale Amount"] || 0);
        if (!gmvGrouped[date]) gmvGrouped[date] = 0;
        gmvGrouped[date] += amount;
    });

    const gmvDates = Object.keys(gmvGrouped)
        .sort((a,b) => parseDDMMYYYY(a) - parseDDMMYYYY(b));

    createBarChart("gmv-chart", gmvDates, gmvDates.map(d => gmvGrouped[d]));

    // CDR Trend
    const cdrData = applyFilters("CDR");
    const cdrGrouped = {};

    cdrData.forEach(row => {
        const date = row["Date"];
        const spend = Number(row["Ad Spend"] || 0);
        if (!cdrGrouped[date]) cdrGrouped[date] = 0;
        cdrGrouped[date] += spend;
    });

    const cdrDates = Object.keys(cdrGrouped)
        .sort((a,b) => parseDDMMYYYY(a) - parseDDMMYYYY(b));

    createBarChart("cdr-chart", cdrDates, cdrDates.map(d => cdrGrouped[d]));

    // CTR Trend (Net Units)
    const ctrData = applyFilters("CTR");
    const ctrGrouped = {};

    ctrData.forEach(row => {
        const date = row["Order Date"];
        const type = row["Event Type"];
        const qty = Number(row["Item Quantity"] || 0);

        if (!ctrGrouped[date]) ctrGrouped[date] = 0;

        if (type === "Sale") ctrGrouped[date] += qty;
        if (type === "Cancel") ctrGrouped[date] -= qty;
        if (type === "Return") ctrGrouped[date] -= qty;
    });

    const ctrDates = Object.keys(ctrGrouped)
        .sort((a,b) => parseDDMMYYYY(a) - parseDDMMYYYY(b));

    createBarChart("ctr-chart", ctrDates, ctrDates.map(d => ctrGrouped[d]));
}
