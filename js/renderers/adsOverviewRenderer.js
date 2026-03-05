export function renderAdsOverview(data){

const container = document.getElementById("ads-sub-content");

const diffColor = data.diff > 0 ? "red" : "green";

container.innerHTML = `

<h2 class="report-title">Ads Efficiency & Budget Control</h2>

<div class="summary-grid">

<div class="summary-box">
<div class="summary-title">Ads Spend</div>
<div class="summary-value">₹ ${data.spend.toLocaleString()}</div>
</div>

<div class="summary-box">
<div class="summary-title">Units Sold</div>
<div class="summary-value">${data.units.toLocaleString()}</div>
</div>

<div class="summary-box">
<div class="summary-title">Revenue</div>
<div class="summary-value">₹ ${data.revenue.toLocaleString()}</div>
</div>

<div class="summary-box">
<div class="summary-title">ROI</div>
<div class="summary-value">${data.roi.toFixed(2)}</div>
</div>

<div class="summary-box">
<div class="summary-title">Fixed Ads (3%)</div>
<div class="summary-value">₹ ${data.fixedAds.toLocaleString()}</div>
</div>

<div class="summary-box">
<div class="summary-title">Ads Amount Diff</div>
<div class="summary-value" style="color:${diffColor}">
₹ ${data.diff.toLocaleString()}
</div>
</div>

</div>

`;

}
