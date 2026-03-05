import { STATE } from "../core/stateManager.js";
import { getSmartFunnel } from "../engines/reports/smartFunnelEngine.js";
import { getBrandProfitability } from "../engines/reports/brandProfitabilityEngine.js";

function percent(v) {
    return (v * 100).toFixed(2) + "%";
}

function formatINR(n) {
    return "₹ " + Number(n || 0).toLocaleString("en-IN");
}

export function renderSmartPage() {

    const container = document.getElementById("app-content");

    if (!STATE.ui.smartSubPage) STATE.ui.smartSubPage = "funnel";

    container.innerHTML = `
        <div class="section">
            <div class="section-title">Smart Reports</div>

            <div class="ads-tabs">
                <div class="ads-tab ${STATE.ui.smartSubPage === "funnel" ? "active" : ""}" data-tab="funnel">Ads vs Sales Funnel</div>
                <div class="ads-tab ${STATE.ui.smartSubPage === "brand" ? "active" : ""}" data-tab="brand">Brand Profitability</div>
            </div>

            <div id="smart-sub-content"></div>
        </div>
    `;

    document.querySelectorAll(".ads-tab").forEach(tab => {
        tab.onclick = () => {
            STATE.ui.smartSubPage = tab.dataset.tab;
            renderSmartPage();
        };
    });

    if (STATE.ui.smartSubPage === "funnel") renderFunnel();
    if (STATE.ui.smartSubPage === "brand") renderBrand();
}

function renderFunnel() {

    const container = document.getElementById("smart-sub-content");

    const f = getSmartFunnel();

    container.innerHTML = `
        <div class="kpi-row">

            <div class="kpi-card">
                <div class="kpi-label">Ad Views</div>
                <div class="kpi-value">${f.views}</div>
            </div>

            <div class="kpi-card">
                <div class="kpi-label">Clicks (${percent(f.ctrRate)})</div>
                <div class="kpi-value">${f.clicks}</div>
            </div>

            <div class="kpi-card">
                <div class="kpi-label">Ad Units (${percent(f.adCVR)})</div>
                <div class="kpi-value">${f.adUnits}</div>
            </div>

            <div class="kpi-card">
                <div class="kpi-label">Gross Orders</div>
                <div class="kpi-value">${f.grossUnits}</div>
            </div>

            <div class="kpi-card">
                <div class="kpi-label">Final Sales</div>
                <div class="kpi-value">${f.finalUnits}</div>
            </div>

        </div>

        <div class="chart-card">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>Stage</th>
                        <th>Units</th>
                    </tr>
                </thead>

                <tbody>
                    <tr><td>Ad Views</td><td>${f.views}</td></tr>
                    <tr><td>Ad Clicks</td><td>${f.clicks}</td></tr>
                    <tr><td>Ad Orders</td><td>${f.adUnits}</td></tr>
                    <tr><td>Gross Orders</td><td>${f.grossUnits}</td></tr>
                    <tr><td>Final Sales</td><td>${f.finalUnits}</td></tr>
                </tbody>
            </table>
        </div>
    `;
}

function renderBrand() {

    const container = document.getElementById("smart-sub-content");

    const brands = getBrandProfitability();

    container.innerHTML = `
        <div class="chart-card">
            <table class="modern-table">

                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Final Revenue</th>
                        <th>Ad Revenue</th>
                        <th>Organic Revenue</th>
                        <th>Ad Share</th>
                        <th>Cancel %</th>
                        <th>Return %</th>
                    </tr>
                </thead>

                <tbody>
                    ${brands.map(b => `
                        <tr>
                            <td>${b.brand}</td>
                            <td>${formatINR(b.finalRevenue)}</td>
                            <td>${formatINR(b.adRevenue)}</td>
                            <td>${formatINR(b.organicRevenue)}</td>
                            <td>${percent(b.adShare)}</td>
                            <td>${percent(b.cancelRate)}</td>
                            <td>${percent(b.returnRate)}</td>
                        </tr>
                    `).join("")}
                </tbody>

            </table>
        </div>
    `;
}
