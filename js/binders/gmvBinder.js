import { STATE } from "../core/stateManager.js";
import { getGmvOverview } from "../engines/reports/gmvOverviewEngine.js";
import { getGMVSummary } from "../engines/summary/gmvSummaryEngine.js";
import { renderLineChart } from "../engines/charts/chartFactory.js";

function inr(n){
    return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function pct(v){
    return (v*100).toFixed(2) + "%";
}

function compare(curr,prev){
    if(!prev) return {val:0,label:""};
    const diff=((curr-prev)/prev)*100;
    const arrow=diff>=0?"▲":"▼";
    return {
        val:diff,
        label:`${arrow} ${Math.abs(diff).toFixed(1)}% (From previous period)`
    };
}

export function renderGmvPage(){

    const container=document.getElementById("app-content");

    if(!STATE.ui.gmvChartMode) STATE.ui.gmvChartMode="revenue";

    const todayData=getGMVSummary();

    const previousFilters={...STATE.filters};

    const start=new Date(previousFilters.startDate);
    const end=new Date(previousFilters.endDate);
    const diff=end-start;

    const prevEnd=new Date(start);
    prevEnd.setDate(prevEnd.getDate()-1);

    const prevStart=new Date(prevEnd);
    prevStart.setTime(prevEnd.getTime()-diff);

    STATE.filters.startDate=prevStart.toISOString().split("T")[0];
    STATE.filters.endDate=prevEnd.toISOString().split("T")[0];

    const prevData=getGMVSummary();

    STATE.filters=previousFilters;

    const grossCompare=compare(todayData.gmv,prevData.gmv);
    const cancelCompare=compare(todayData.cancelAmount,prevData.cancelAmount);
    const afterCancel=todayData.gmv-todayData.cancelAmount;
    const prevAfterCancel=prevData.gmv-prevData.cancelAmount;
    const afterCancelCompare=compare(afterCancel,prevAfterCancel);
    const returnCompare=compare(todayData.returnAmount,prevData.returnAmount);
    const netCompare=compare(todayData.finalAmount,prevData.finalAmount);

    container.innerHTML=`

    <div class="section">

    <div class="section-title">GMV Performance Summary</div>

    <div class="kpi-row">

    <div class="kpi-card">
    <div class="kpi-label">Gross Sales</div>
    <div class="kpi-value">${inr(todayData.gmv)} (${todayData.grossUnits} units)</div>
    <div class="kpi-compare">${grossCompare.label}</div>
    </div>

    <div class="kpi-card">
    <div class="kpi-label">Cancellations</div>
    <div class="kpi-value">${inr(todayData.cancelAmount)} (${todayData.cancelUnits} units)</div>
    <div class="kpi-compare">${cancelCompare.label}</div>
    </div>

    <div class="kpi-card">
    <div class="kpi-label">Sales After Cancellations</div>
    <div class="kpi-value">${inr(afterCancel)} (${todayData.grossUnits-todayData.cancelUnits} units)</div>
    <div class="kpi-compare">${afterCancelCompare.label}</div>
    </div>

    <div class="kpi-card">
    <div class="kpi-label">Returns</div>
    <div class="kpi-value">${inr(todayData.returnAmount)} (${todayData.returnUnits} units)</div>
    <div class="kpi-compare">${returnCompare.label}</div>
    </div>

    <div class="kpi-card">
    <div class="kpi-label">Net Sales</div>
    <div class="kpi-value">${inr(todayData.finalAmount)} (${todayData.finalUnits} units)</div>
    <div class="kpi-compare">${netCompare.label}</div>
    </div>

    </div>

    <div class="chart-toggle">

        <button id="revBtn" class="toggle-btn ${STATE.ui.gmvChartMode==="revenue"?"active":""}">Revenue</button>
        <button id="unitBtn" class="toggle-btn ${STATE.ui.gmvChartMode==="units"?"active":""}">Units</button>

    </div>

    <div class="chart-card">
        <canvas id="gmvChart"></canvas>
    </div>

    </div>
    `;

    document.getElementById("revBtn").onclick=()=>{
        STATE.ui.gmvChartMode="revenue";
        renderGmvPage();
    };

    document.getElementById("unitBtn").onclick=()=>{
        STATE.ui.gmvChartMode="units";
        renderGmvPage();
    };

    const overview=getGmvOverview();

    const labels=overview.chartData.labels;

    let datasets;

    if(STATE.ui.gmvChartMode==="revenue"){

        datasets=[

        {
            label:"GMV",
            data:overview.chartData.datasets[0].data,
            borderColor:"#2563eb",
            tension:0.3
        },

        {
            label:"Cancellations",
            data:labels.map(()=>todayData.cancelAmount),
            borderColor:"#dc2626",
            tension:0.3
        },

        {
            label:"Returns",
            data:labels.map(()=>todayData.returnAmount),
            borderColor:"#f59e0b",
            tension:0.3
        },

        {
            label:"Net Sales",
            data:overview.chartData.datasets[1].data,
            borderColor:"#16a34a",
            tension:0.3
        }

        ];

    }else{

        datasets=[

        {
            label:"Gross Units",
            data:labels.map(()=>todayData.grossUnits),
            borderColor:"#2563eb",
            tension:0.3
        },

        {
            label:"Cancel Units",
            data:labels.map(()=>todayData.cancelUnits),
            borderColor:"#dc2626",
            tension:0.3
        },

        {
            label:"Return Units",
            data:labels.map(()=>todayData.returnUnits),
            borderColor:"#f59e0b",
            tension:0.3
        },

        {
            label:"Net Units",
            data:labels.map(()=>todayData.finalUnits),
            borderColor:"#16a34a",
            tension:0.3
        }

        ];

    }

    renderLineChart("gmvChart",labels,datasets);
}
