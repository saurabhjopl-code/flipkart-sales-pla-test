import { getCtrSummary } from "../engines/reports/ctrSummaryEngine.js";

function formatINR(n){
return "₹ " + Number(n||0).toLocaleString("en-IN");
}

export function renderCtrPage(){

const container = document.getElementById("app-content");

const s = getCtrSummary();

container.innerHTML = `

<div class="section">

<div class="section-title">CTR - Order Performance</div>

<div class="kpi-row">

<div class="kpi-card">
<div class="kpi-label">Sale Value</div>
<div class="kpi-value">${formatINR(s.saleValue)}</div>
</div>

<div class="kpi-card">
<div class="kpi-label">Cancel Value</div>
<div class="kpi-value">${formatINR(s.cancelValue)}</div>
</div>

<div class="kpi-card">
<div class="kpi-label">Return Value</div>
<div class="kpi-value">${formatINR(s.returnValue)}</div>
</div>

<div class="kpi-card">
<div class="kpi-label">Net Value</div>
<div class="kpi-value">${formatINR(s.netValue)}</div>
</div>

</div>

<div class="kpi-row">

<div class="kpi-card">
<div class="kpi-label">Sale Orders</div>
<div class="kpi-value">${s.saleOrders}</div>
</div>

<div class="kpi-card">
<div class="kpi-label">Cancel Orders</div>
<div class="kpi-value">${s.cancelOrders}</div>
</div>

<div class="kpi-card">
<div class="kpi-label">Return Orders</div>
<div class="kpi-value">${s.returnOrders}</div>
</div>

<div class="kpi-card">
<div class="kpi-label">Net Orders</div>
<div class="kpi-value">${s.netOrders}</div>
</div>

</div>

</div>

`;

}
