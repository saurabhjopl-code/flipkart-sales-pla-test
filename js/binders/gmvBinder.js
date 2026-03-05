import { STATE } from "../core/stateManager.js";
import { getGmvOverview } from "../engines/reports/gmvOverviewEngine.js";
import { getGmvBrandReport } from "../engines/reports/gmvBrandReportEngine.js";
import { getGmvCategoryReport } from "../engines/reports/gmvCategoryReportEngine.js";
import { renderLineChart } from "../engines/charts/chartFactory.js";

function formatINR(num) {
    return "₹ " + Number(num || 0).toLocaleString("en-IN");
}

function percent(val) {
    return (val * 100).toFixed(2) + "%";
}

export function renderGmvPage() {

    const container = document.getElementById("app-content");

    if (!STATE.ui.gmvSubPage) STATE.ui.gmvSubPage = "overview";

    container.innerHTML = `
        <div class="section">
            <div class="section-title">GMV Reports</div>

            <div class="ads-tabs">
                <div class="ads-tab ${STATE.ui.gmvSubPage === "overview" ? "active" : ""}" data-tab="overview">Overview</div>
                <div class="ads-tab ${STATE.ui.gmvSubPage === "brand" ? "active" : ""}" data-tab="brand">Brand</div>
                <div class="ads-tab ${STATE.ui.gmvSubPage === "category" ? "active" : ""}" data-tab="category">Category</div>
            </div>

            <div id="gmv-sub-content"></div>
        </div>
    `;

    document.querySelectorAll(".ads-tab").forEach(tab => {
        tab.onclick = () => {
            STATE.ui.gmvSubPage = tab.dataset.tab;
            renderGmvPage();
        };
    });

    if (STATE.ui.gmvSubPage === "overview") renderOverview();
    if (STATE.ui.gmvSubPage === "brand") renderBrand();
    if (STATE.ui.gmvSubPage === "category") renderCategory();
}

function renderOverview() {

    const container = document.getElementById("gmv-sub-content");
    const data = getGmvOverview();

    const cancelRate = data.grossUnits ? data.cancelUnits / data.grossUnits : 0;
    const returnRate = data.grossUnits ? data.returnUnits / data.grossUnits : 0;

    container.innerHTML = `
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
    `;

    renderLineChart("gmvOverviewChart", data.chartData.labels, data.chartData.datasets);
}

function renderBrand() {

    const container = document.getElementById("gmv-sub-content");
    const brands = getGmvBrandReport();

    container.innerHTML = `
        <div class="chart-card">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Final Revenue</th>
                        <th>Gross Units</th>
                        <th>Cancel Units</th>
                        <th>Return Units</th>
                        <th>Cancel %</th>
                        <th>Return %</th>
                    </tr>
                </thead>
                <tbody>
                    ${brands.map(b => `
                        <tr>
                            <td>${b.brand}</td>
                            <td>${formatINR(b.finalRevenue)}</td>
                            <td>${b.grossUnits}</td>
                            <td>${b.cancelUnits}</td>
                            <td>${b.returnUnits}</td>
                            <td>${percent(b.cancelRate)}</td>
                            <td>${percent(b.returnRate)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function renderCategory() {

    const container = document.getElementById("gmv-sub-content");
    const rows = getGmvCategoryReport();

    container.innerHTML = `
        <div class="chart-card">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Vertical</th>
                        <th>Final Revenue</th>
                        <th>Gross Units</th>
                        <th>Final Units</th>
                        <th>Cancel Units</th>
                        <th>Return Units</th>
                        <th>Cancel %</th>
                        <th>Return %</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(r => `
                        <tr>
                            <td>${r.category}</td>
                            <td>${r.vertical}</td>
                            <td>${formatINR(r.finalRevenue)}</td>
                            <td>${r.grossUnits}</td>
                            <td>${r.finalUnits}</td>
                            <td>${r.cancelUnits}</td>
                            <td>${r.returnUnits}</td>
                            <td>${percent(r.cancelRate)}</td>
                            <td>${percent(r.returnRate)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}
