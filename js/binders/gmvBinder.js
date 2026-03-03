import { getGmvOverview } from "../engines/reports/gmvOverviewEngine.js";
import { renderLineChart } from "../engines/charts/chartFactory.js";

function formatINR(num) {
    return "₹ " + Number(num || 0).toLocaleString("en-IN");
}

function percent(val) {
    return (val * 100).toFixed(2) + "%";
}

export function renderGmvPage() {

    const container = document.getElementById("app-content");
    const data = getGmvOverview();

    const cancelRate = data.grossUnits ? data.cancelUnits / data.grossUnits : 0;
    const returnRate = data.grossUnits ? data.returnUnits / data.grossUnits : 0;

    container.innerHTML = `
        <div class="section">
            <div class="section-title">GMV Overview</div>

            <div class="kpi-row">
                <div class="kpi-card"><div class="kpi-label">Gross Units</div><div class="kpi-value">${data.grossUnits}</div></div>
                <div class="kpi-card"><div class="kpi-label">GMV</div><div class="kpi-value">${formatINR(data.gmv)}</div></div>
                <div class="kpi-card"><div class="kpi-label">Cancel Units (${percent(cancelRate)})</div><div class="kpi-value">${data.cancelUnits}</div></div>
                <div class="kpi-card"><div class="kpi-label">Return Units (${percent(returnRate)})</div><div class="kpi-value">${data.returnUnits}</div></div>
                <div class="kpi-card"><div class="kpi-label">Final Units</div><div class="kpi-value">${data.finalUnits}</div></div>
                <div class="kpi-card"><div class="kpi-label">Final Revenue</div><div class="kpi-value">${formatINR(data.finalRevenue)}</div></div>
            </div>

            <div class="chart-card">
                <canvas id="gmvOverviewChart"></canvas>
            </div>
        </div>
    `;

    renderLineChart("gmvOverviewChart", data.chartData.labels, data.chartData.datasets);
}
