export function renderHomeDashboard(gmv, cdr, ctr) {
    const container = document.getElementById("app-content");

    container.innerHTML = `
        <h2>Core Business KPIs</h2>

        <div class="summary-grid">

            <div class="card">
                <h3>GMV</h3>
                <p>Final Units: ${gmv.finalUnits}</p>
                <p>Final Revenue: ₹${gmv.finalAmount}</p>
                <p>Cancel Units: ${gmv.cancelUnits}</p>
                <p>Return Units: ${gmv.returnUnits}</p>
            </div>

            <div class="card">
                <h3>Ads (CDR)</h3>
                <p>Spend: ₹${cdr.spend.toFixed(2)}</p>
                <p>Revenue: ₹${cdr.revenue.toFixed(2)}</p>
                <p>ROI: ${cdr.roi.toFixed(2)}</p>
                <p>Clicks: ${cdr.clicks}</p>
            </div>

            <div class="card">
                <h3>CTR</h3>
                <p>Net Units: ${ctr.netUnits}</p>
                <p>Net Revenue: ₹${ctr.netRevenue.toFixed(2)}</p>
                <p>Cancel Units: ${ctr.cancelUnits}</p>
                <p>Return Units: ${ctr.returnUnits}</p>
            </div>

        </div>

        <h2 style="margin-top:30px;">Last 30 Days Trends</h2>

        <div class="chart-grid">
            <div>
                <h4>GMV Trend</h4>
                <div id="gmv-chart"></div>
            </div>
            <div>
                <h4>Ads Spend Trend</h4>
                <div id="cdr-chart"></div>
            </div>
            <div>
                <h4>CTR Net Units Trend</h4>
                <div id="ctr-chart"></div>
            </div>
        </div>
    `;
}
