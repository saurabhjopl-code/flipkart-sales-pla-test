import { STATE } from "../core/stateManager.js";
import { getSmartFunnel } from "../engines/reports/smartFunnelEngine.js";
import { getBrandProfitability } from "../engines/reports/brandProfitabilityEngine.js";
import { getCampaignEfficiency } from "../engines/reports/campaignEfficiencyEngine.js";
import { getInventoryRisk } from "../engines/reports/inventoryRiskEngine.js";

function percent(v){return (v*100).toFixed(2)+"%";}
function formatINR(n){return "₹ "+Number(n||0).toLocaleString("en-IN");}

export function renderSmartPage(){

const container=document.getElementById("app-content");

if(!STATE.ui.smartSubPage) STATE.ui.smartSubPage="funnel";

container.innerHTML=`

<div class="section">

<div class="section-title">Smart Reports</div>

<div class="ads-tabs">

<div class="ads-tab ${STATE.ui.smartSubPage==="funnel"?"active":""}" data-tab="funnel">
Ads vs Sales Funnel
</div>

<div class="ads-tab ${STATE.ui.smartSubPage==="brand"?"active":""}" data-tab="brand">
Brand Profitability
</div>

<div class="ads-tab ${STATE.ui.smartSubPage==="campaign"?"active":""}" data-tab="campaign">
Campaign Efficiency
</div>

<div class="ads-tab ${STATE.ui.smartSubPage==="risk"?"active":""}" data-tab="risk">
Inventory Risk
</div>

</div>

<div id="smart-sub-content"></div>

</div>
`;

document.querySelectorAll(".ads-tab").forEach(tab=>{
tab.onclick=()=>{
STATE.ui.smartSubPage=tab.dataset.tab;
renderSmartPage();
};
});

if(STATE.ui.smartSubPage==="funnel") renderFunnel();
if(STATE.ui.smartSubPage==="brand") renderBrand();
if(STATE.ui.smartSubPage==="campaign") renderCampaign();
if(STATE.ui.smartSubPage==="risk") renderRisk();

}

function renderFunnel(){

const c=document.getElementById("smart-sub-content");
const f=getSmartFunnel();

c.innerHTML=`
<div class="kpi-row">

<div class="kpi-card"><div class="kpi-label">Views</div><div class="kpi-value">${f.views}</div></div>
<div class="kpi-card"><div class="kpi-label">Clicks</div><div class="kpi-value">${f.clicks}</div></div>
<div class="kpi-card"><div class="kpi-label">Ad Units</div><div class="kpi-value">${f.adUnits}</div></div>
<div class="kpi-card"><div class="kpi-label">Gross Orders</div><div class="kpi-value">${f.grossUnits}</div></div>
<div class="kpi-card"><div class="kpi-label">Final Sales</div><div class="kpi-value">${f.finalUnits}</div></div>

</div>
`;
}

function renderBrand(){

const c=document.getElementById("smart-sub-content");
const brands=getBrandProfitability();

c.innerHTML=`
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

${brands.map(b=>`
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

function renderCampaign(){

const c=document.getElementById("smart-sub-content");
const rows=getCampaignEfficiency();

c.innerHTML=`
<div class="chart-card">

<table class="modern-table">

<thead>
<tr>
<th>Campaign</th>
<th>Spend</th>
<th>Ad Revenue</th>
<th>Final Revenue</th>
<th>ROI</th>
<th>Net ROI</th>
<th>CTR</th>
<th>CVR</th>
</tr>
</thead>

<tbody>

${rows.map(r=>`
<tr>
<td>${r.campaign}</td>
<td>${formatINR(r.spend)}</td>
<td>${formatINR(r.adRevenue)}</td>
<td>${formatINR(r.finalRevenue)}</td>
<td>${r.roi.toFixed(2)}</td>
<td>${r.netROI.toFixed(2)}</td>
<td>${percent(r.ctr)}</td>
<td>${percent(r.cvr)}</td>
</tr>
`).join("")}

</tbody>

</table>

</div>
`;
}

function renderRisk(){

const c=document.getElementById("smart-sub-content");
const rows=getInventoryRisk();

c.innerHTML=`
<div class="chart-card">

<table class="modern-table">

<thead>
<tr>
<th>SKU</th>
<th>Orders</th>
<th>Final Units</th>
<th>Cancel Units</th>
<th>Return Units</th>
<th>Cancel %</th>
<th>Return %</th>
<th>Risk Score</th>
</tr>
</thead>

<tbody>

${rows.map(r=>`
<tr>
<td>${r.sku}</td>
<td>${r.orders}</td>
<td>${r.finalUnits}</td>
<td>${r.cancelUnits}</td>
<td>${r.returnUnits}</td>
<td>${percent(r.cancelRate)}</td>
<td>${percent(r.returnRate)}</td>
<td>${r.riskScore}</td>
</tr>
`).join("")}

</tbody>

</table>

</div>
`;
}



import Chart from "chart.js/auto";

function renderFunnelChart(data){

const ctx=document.getElementById("salesFunnelChart");

new Chart(ctx,{
type:"bar",
data:{
labels:[
"Impressions",
"Clicks",
"Ad Units",
"Orders",
"Final Sales"
],
datasets:[{
data:[
data.views,
data.clicks,
data.adUnits,
data.grossUnits,
data.finalUnits
],
backgroundColor:[
"#f5b7b1",
"#f9e79f",
"#aed6f1",
"#a3e4d7",
"#abebc6"
]
}]
},
options:{
indexAxis:"y",
plugins:{legend:{display:false}}
}
});
}
