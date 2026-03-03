import { getGMVSummary } from "../engines/summary/gmvSummaryEngine.js";
import { renderGMVSummary } from "../renderers/summaryRenderer.js";
import { createBarChart } from "../engines/charts/barChartEngine.js";
import { applyFilters } from "../core/filterEngine.js";
import { parseDDMMYYYY } from "../core/dateEngine.js";

export function renderHome() {

    const summary = getGMVSummary();
    renderGMVSummary(summary);

    const data = applyFilters("GMV");

    const grouped = {};

    data.forEach(row => {
        const date = row["Order Date"];
        const amount = Number(row["Final Sale Amount"] || 0);

        if (!grouped[date]) grouped[date] = 0;
        grouped[date] += amount;
    });

    const sortedDates = Object.keys(grouped)
        .sort((a,b) => parseDDMMYYYY(a) - parseDDMMYYYY(b));

    const labels = sortedDates;
    const values = sortedDates.map(d => grouped[d]);

    createBarChart("gmv-chart", labels, values);
}
