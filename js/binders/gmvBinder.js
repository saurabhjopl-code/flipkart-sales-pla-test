import { STATE } from "../core/stateManager.js";
import { getGmvOverview } from "../engines/reports/gmvOverviewEngine.js";
import { getGMVSummary } from "../engines/summary/gmvSummaryEngine.js";
import { getGmvBrandReport } from "../engines/reports/gmvBrandReportEngine.js";
import { getGmvCategoryReport } from "../engines/reports/gmvCategoryReportEngine.js";
import { getGmvFulfillmentReport } from "../engines/reports/gmvFulfillmentReportEngine.js";
import { getGmvLocationReport } from "../engines/reports/gmvLocationReportEngine.js";
import { renderLineChart } from "../engines/charts/chartFactory.js";

function formatINR(num){
    return "₹ " + Number(num || 0).toLocaleString("en-IN");
}

function percent(val){
    return (val * 100).toFixed(2) + "%";
}

export function renderGmvPage(){

    const container=document.getElementById("app-content");

    if(!STATE.ui.gmvSubPage) STATE.ui.gmvSubPage="overview";
    if(!STATE.ui.gmvChartMode) STATE.ui.gmvChartMode="revenue";

    container.innerHTML=`

        <div class="section">

            <div class="section-title">GMV Reports</div>

            <div class="ads-tabs">

                <div class="ads-tab ${STATE.ui.gmvSubPage==="overview"?"active":""}" data-tab="overview">Overview</div>
                <div class="ads-tab ${STATE.ui.gmvSubPage==="brand"?"active":""}" data-tab="brand">Brand</div>
                <div class="ads-tab ${STATE.ui.gmvSubPage==="category"?"active":""}" data-tab="category">Category</div>
                <div class="ads-tab ${STATE.ui.gmvSubPage==="fulfillment"?"active":""}" data-tab="fulfillment">Fulfillment</div>
                <div class="ads-tab ${STATE.ui.gmvSubPage==="location"?"active":""}" data-tab="location">Location</div>

            </div>

            <div id="gmv-sub-content"></div>

        </div>

    `;

    document.querySelectorAll(".ads-tab").forEach(tab=>{
        tab.onclick=()=>{
            STATE.ui.gmvSubPage=tab.dataset.tab;
            renderGmvPage();
        };
    });

    if(STATE.ui.gmvSubPage==="overview") renderOverview();
    if(STATE.ui.gmvSubPage==="brand") renderBrand();
    if(STATE.ui.gmvSubPage==="category") renderCategory();
    if(STATE.ui.gmvSubPage==="fulfillment") renderFulfillment();
    if(STATE.ui.gmvSubPage==="location") renderLocation();
}

function renderOverview(){

    const container=document.getElementById("gmv-sub-content");

    const overview=getGmvOverview();
    const summary=getGMVSummary();

    const cancelRate = overview.grossUnits ? overview.cancelUnits / overview.grossUnits : 0;
    const returnRate = overview.grossUnits ? overview.returnUnits / overview.grossUnits : 0;

    container.innerHTML=`

        <div class="kpi-row">

            <div class="kpi-card">
                <div class="kpi-label">Gross Units</div>
                <div class="kpi-value">${overview.grossUnits}</div>
            </div>

            <div class="kpi-card">
                <div class="kpi-label">GMV</div>
                <div class="kpi-value">${formatINR(overview.gmv)}</div>
            </div>

            <div class="kpi-card">
                <div class="kpi-label">Cancel Units (${percent(cancelRate)})</div>
                <div class="kpi-value">${overview.cancelUnits}</div>
            </div>

            <div class="kpi-card">
                <div class="kpi-label">Return Units (${percent(returnRate)})</div>
                <div class="kpi-value">${overview.returnUnits}</div>
            </div>

            <div class="kpi-card">
                <div class="kpi-label">Final Units</div>
                <div class="kpi-value">${overview.finalUnits}</div>
            </div>

            <div class="kpi-card">
                <div class="kpi-label">Net Revenue</div>
                <div class="kpi-value">${formatINR(overview.finalRevenue)}</div>
            </div>

        </div>

        <div class="toggle-group">

            <button id="revenueToggle" class="toggle-btn ${STATE.ui.gmvChartMode==="revenue"?"active":""}">
                Revenue
            </button>

            <button id="unitsToggle" class="toggle-btn ${STATE.ui.gmvChartMode==="units"?"active":""}">
                Units
            </button>

        </div>

        <div class="chart-card">
            <canvas id="gmvOverviewChart"></canvas>
        </div>

    `;

    document.getElementById("revenueToggle").onclick=()=>{
        STATE.ui.gmvChartMode="revenue";
        renderOverview();
    };

    document.getElementById("unitsToggle").onclick=()=>{
        STATE.ui.gmvChartMode="units";
        renderOverview();
    };

    const labels=overview.chartData.labels;

    let datasets=[];

    if(STATE.ui.gmvChartMode==="units"){

        datasets=[

            {
                label:"Gross Units",
                data:labels.map(()=>overview.grossUnits),
                borderColor:"#2563eb",
                tension:0.3
            },

            {
                label:"Cancel Units",
                data:labels.map(()=>overview.cancelUnits),
                borderColor:"#dc2626",
                tension:0.3
            },

            {
                label:"Return Units",
                data:labels.map(()=>overview.returnUnits),
                borderColor:"#f59e0b",
                tension:0.3
            },

            {
                label:"Final Units",
                data:labels.map(()=>overview.finalUnits),
                borderColor:"#16a34a",
                tension:0.3
            }

        ];

    }else{

        datasets=[

            {
                label:"GMV",
                data:overview.chartData.datasets[0].data,
                borderColor:"#2563eb",
                tension:0.3
            },

            {
                label:"Cancel Amount",
                data:labels.map(()=>summary.cancelAmount),
                borderColor:"#dc2626",
                tension:0.3
            },

            {
                label:"Return Amount",
                data:labels.map(()=>summary.returnAmount),
                borderColor:"#f59e0b",
                tension:0.3
            },

            {
                label:"Net Revenue",
                data:overview.chartData.datasets[1].data,
                borderColor:"#16a34a",
                tension:0.3
            }

        ];

    }

    renderLineChart("gmvOverviewChart",labels,datasets);
}

function renderBrand(){

    const rows=getGmvBrandReport();
    renderTable(rows,"brand");
}

function renderCategory(){

    const rows=getGmvCategoryReport();
    renderTable(rows,"category");
}

function renderFulfillment(){

    const rows=getGmvFulfillmentReport();
    renderTable(rows,"fulfillment");
}

function renderLocation(){

    const rows=getGmvLocationReport();
    renderTable(rows,"location");
}

function renderTable(rows,type){

    const container=document.getElementById("gmv-sub-content");

    let header="";
    let nameField="";

    if(type==="brand"){ header="Brand"; nameField="brand"; }
    if(type==="category"){ header="Category / Vertical"; nameField="category"; }
    if(type==="fulfillment"){ header="Fulfillment"; nameField="fulfillment"; }
    if(type==="location"){ header="Location"; nameField="location"; }

    container.innerHTML=`

        <div class="chart-card">

            <table class="modern-table">

                <thead>
                    <tr>
                        <th>${header}</th>
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

                    ${rows.map(r=>`

                        <tr>
                            <td>${r[nameField]}</td>
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
