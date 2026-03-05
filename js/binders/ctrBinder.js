import { getCtrSummary } from "../engines/reports/ctrSummaryEngine.js";
import { getCtrFulfilment } from "../engines/reports/ctrFulfilmentEngine.js";
import { getCtrOrders } from "../engines/reports/ctrOrdersEngine.js";

function formatINR(n){
return "₹ " + Number(n||0).toLocaleString("en-IN");
}

function percent(v){
return (v*100).toFixed(2) + "%";
}

export function renderCtrPage(){

const container = document.getElementById("app-content");

const s = getCtrSummary();
const fulfilment = getCtrFulfilment();
const orders = getCtrOrders();

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

<div class="chart-card">

<div class="section-title" style="margin-bottom:10px">
Fulfilment Analysis
</div>

<table class="modern-table">

<thead>
<tr>
<th>Fulfilment</th>
<th>Sale Value</th>
<th>Cancel Value</th>
<th>Return Value</th>
<th>Net Value</th>
<th>Cancel %</th>
<th>Return %</th>
</tr>
</thead>

<tbody>

${fulfilment.map(r=>`

<tr>
<td>${r.fulfilment}</td>
<td>${formatINR(r.saleValue)}</td>
<td>${formatINR(r.cancelValue)}</td>
<td>${formatINR(r.returnValue)}</td>
<td>${formatINR(r.netValue)}</td>
<td>${percent(r.cancelRate)}</td>
<td>${percent(r.returnRate)}</td>
</tr>

`).join("")}

</tbody>

</table>

</div>

<div class="chart-card">

<div class="section-title" style="margin-bottom:10px">
Order Events
</div>

<table class="modern-table">

<thead>
<tr>
<th>Date</th>
<th>SKU</th>
<th>Event</th>
<th>Fulfilment</th>
<th>Price</th>
</tr>
</thead>

<tbody>

${orders.map(r=>`

<tr>
<td>${r.date}</td>
<td>${r.sku}</td>
<td>${r.type}</td>
<td>${r.fulfilment}</td>
<td>${formatINR(r.price)}</td>
</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

}
