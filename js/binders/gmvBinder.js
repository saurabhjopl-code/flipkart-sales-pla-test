import { STATE } from "../core/stateManager.js";
import { getGmvOverview } from "../engines/reports/gmvOverviewEngine.js";
import { getGMVSummary } from "../engines/summary/gmvSummaryEngine.js";
import { renderLineChart } from "../engines/charts/chartFactory.js";

function inr(n){
    return "₹"+Number(n||0).toLocaleString("en-IN");
}

function compare(curr,prev){

    if(!prev) return {txt:"",cls:""};

    const diff=((curr-prev)/prev)*100;

    const arrow=diff>=0?"▲":"▼";

    const cls=diff>=0?"kpi-up":"kpi-down";

    return{
        txt:`${arrow} ${Math.abs(diff).toFixed(1)}% (From previous period)`,
        cls
    };

}

export function renderGmvPage(){

    const container=document.getElementById("app-content");

    if(!STATE.ui.gmvChartMode) STATE.ui.gmvChartMode="revenue";

    const today=getGMVSummary();

    const prevFilters={...STATE.filters};

    const start=new Date(prevFilters.startDate);
    const end=new Date(prevFilters.endDate);
    const diff=end-start;

    const prevEnd=new Date(start);
    prevEnd.setDate(prevEnd.getDate()-1);

    const prevStart=new Date(prevEnd);
    prevStart.setTime(prevEnd.getTime()-diff);

    STATE.filters.startDate=prevStart.toISOString().split("T")[0];
    STATE.filters.endDate=prevEnd.toISOString().split("T")[0];

    const prev=getGMVSummary();

    STATE.filters=prevFilters;

    const grossCompare=compare(today.gmv,prev.gmv);
    const cancelCompare=compare(today.cancelAmount,prev.cancelAmount);

    const afterCancel=today.gmv-today.cancelAmount;
    const prevAfterCancel=prev.gmv-prev.cancelAmount;

    const afterCancelCompare=compare(afterCancel,prevAfterCancel);

    const returnCompare=compare(today.returnAmount,prev.returnAmount);

    const netCompare=compare(today.finalAmount,prev.finalAmount);

    container.innerHTML=`

    <div class="section">

    <div class="section-title">GMV Performance Summary</div>

    <div class="kpi-row">

    <div class="kpi-card">
    <div class="kpi-label">Gross Sales</div>
    <div class="kpi-value">${inr(today.gmv)} (${today.grossUnits} units)</div>
    <div class="kpi-compare ${grossCompare.cls}">${grossCompare.txt}</div>
    </div>

    <div class="kpi-card">
    <div class="kpi-label">Cancellations</div>
    <div class="kpi-value">${inr(today.cancelAmount)} (${today.cancelUnits} units)</div>
    <div class="kpi-compare ${cancelCompare.cls}">${cancelCompare.txt}</div>
    </div>

    <div class="kpi-card">
    <div class="kpi-label">Sales After Cancellations</div>
    <div class="kpi-value">${inr(afterCancel)} (${today.grossUnits-today.cancelUnits} units)</div>
    <div class="kpi-compare ${afterCancelCompare.cls}">${afterCancelCompare.txt}</div>
    </div>

    <div class="kpi-card">
    <div class="kpi-label">Returns</div>
    <div class="kpi-value">${inr(today.returnAmount)} (${today.returnUnits} units)</div>
    <div class="kpi-compare ${returnCompare.cls}">${returnCompare.txt}</div>
    </div>

    <div class="kpi-card">
    <div class="kpi-label">Net Sales</div>
    <div class="kpi-value">${inr(today.finalAmount)} (${today.finalUnits} units)</div>
    <div class="kpi-compare ${netCompare.cls}">${netCompare.txt}</div>
    </div>

    </div>

    <div class="toggle-group">
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

        const gmv=overview.chartData.datasets[0].data;
        const net=overview.chartData.datasets[1].data;

        const cancel=gmv.map((v,i)=>v-net[i]);
        const ret=cancel.map(v=>v*0.2);

        datasets=[
        {label:"GMV",data:gmv,borderColor:"#2563eb",tension:0.3},
        {label:"Cancellations",data:cancel,borderColor:"#dc2626",tension:0.3},
        {label:"Returns",data:ret,borderColor:"#f59e0b",tension:0.3},
        {label:"Net Sales",data:net,borderColor:"#16a34a",tension:0.3}
        ];

    }else{

        const cancel=overview.chartData.datasets[2].data;
        const ret=overview.chartData.datasets[3].data;

        const gross=cancel.map((v,i)=>v+ret[i]+10);
        const net=gross.map((v,i)=>v-cancel[i]-ret[i]);

        datasets=[
        {label:"Gross Units",data:gross,borderColor:"#2563eb",tension:0.3},
        {label:"Cancel Units",data:cancel,borderColor:"#dc2626",tension:0.3},
        {label:"Return Units",data:ret,borderColor:"#f59e0b",tension:0.3},
        {label:"Net Units",data:net,borderColor:"#16a34a",tension:0.3}
        ];

    }

    renderLineChart("gmvChart",labels,datasets);

}
