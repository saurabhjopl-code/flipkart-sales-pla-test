import { getSmartFunnel } from "../engines/reports/smartFunnelEngine.js";

function percent(v) {
    return (v * 100).toFixed(2) + "%";
}

export function renderSmartPage() {

    const container = document.getElementById("app-content");

    const f = getSmartFunnel();

    container.innerHTML = `
    
    <div class="section">
    
        <div class="section-title">Ads vs Sales Funnel</div>

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

            <div class="kpi-card">
                <div class="kpi-label">Cancel Units (${percent(f.cancelRate)})</div>
                <div class="kpi-value">${f.cancelUnits}</div>
            </div>

            <div class="kpi-card">
                <div class="kpi-label">Return Units (${percent(f.returnRate)})</div>
                <div class="kpi-value">${f.returnUnits}</div>
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

                    <tr>
                        <td>Ad Views</td>
                        <td>${f.views}</td>
                    </tr>

                    <tr>
                        <td>Ad Clicks</td>
                        <td>${f.clicks}</td>
                    </tr>

                    <tr>
                        <td>Ad Orders</td>
                        <td>${f.adUnits}</td>
                    </tr>

                    <tr>
                        <td>Gross Orders</td>
                        <td>${f.grossUnits}</td>
                    </tr>

                    <tr>
                        <td>Final Sales</td>
                        <td>${f.finalUnits}</td>
                    </tr>

                </tbody>

            </table>

        </div>

    </div>
    `;
}
