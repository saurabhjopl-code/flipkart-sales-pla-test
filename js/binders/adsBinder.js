import { getCampaignReport } from "../engines/reports/campaignReportEngine.js";

function formatINR(num) {
    return "₹ " + Number(num || 0).toLocaleString("en-IN");
}

function percent(val) {
    return (val * 100).toFixed(2) + "%";
}

export function renderAdsPage() {

    const container = document.getElementById("app-content");

    const campaigns = getCampaignReport();

    let totalSpend = 0;
    let totalRevenue = 0;
    let totalUnits = 0;
    let totalClicks = 0;
    let totalViews = 0;

    campaigns.forEach(c => {
        totalSpend += c.spend;
        totalRevenue += c.revenue;
        totalUnits += c.units;
        totalClicks += c.clicks;
        totalViews += c.views;
    });

    const overallROI = totalSpend ? totalRevenue / totalSpend : 0;
    const avgCPC = totalClicks ? totalSpend / totalClicks : 0;
    const avgCTR = totalViews ? totalClicks / totalViews : 0;

    container.innerHTML = `
        <div class="section">
            <div class="section-title">Campaign Performance</div>

            <div class="kpi-row">
                <div class="kpi-card"><div class="kpi-label">Total Spend</div><div class="kpi-value">${formatINR(totalSpend)}</div></div>
                <div class="kpi-card"><div class="kpi-label">Total Revenue</div><div class="kpi-value">${formatINR(totalRevenue)}</div></div>
                <div class="kpi-card"><div class="kpi-label">Total Units</div><div class="kpi-value">${totalUnits}</div></div>
                <div class="kpi-card"><div class="kpi-label">Overall ROI</div><div class="kpi-value">${overallROI.toFixed(2)}</div></div>
                <div class="kpi-card"><div class="kpi-label">Avg CPC</div><div class="kpi-value">${formatINR(avgCPC)}</div></div>
                <div class="kpi-card"><div class="kpi-label">Avg CTR</div><div class="kpi-value">${percent(avgCTR)}</div></div>
            </div>

            <div class="chart-card" style="overflow-x:auto;">
                <table class="modern-table">
                    <thead>
                        <tr>
                            <th>Campaign</th>
                            <th>Spend</th>
                            <th>Revenue</th>
                            <th>Units</th>
                            <th>ROI</th>
                            <th>Views</th>
                            <th>Clicks</th>
                            <th>CTR</th>
                            <th>CPC</th>
                            <th>CVR</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${campaigns.map(c => `
                            <tr>
                                <td>${c.name}</td>
                                <td>${formatINR(c.spend)}</td>
                                <td>${formatINR(c.revenue)}</td>
                                <td>${c.units}</td>
                                <td>${c.roi.toFixed(2)}</td>
                                <td>${c.views}</td>
                                <td>${c.clicks}</td>
                                <td>${percent(c.ctr)}</td>
                                <td>${formatINR(c.cpc)}</td>
                                <td>${percent(c.cvr)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
