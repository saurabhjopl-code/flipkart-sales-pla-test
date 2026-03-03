import { getGMVSummary } from "../engines/summary/gmvSummaryEngine.js";
import { getCDRSummary } from "../engines/summary/adsSummaryEngine.js";
import { applyFilters } from "../core/filterEngine.js";
import { renderFullDashboard } from "../renderers/summaryRenderer.js";
import { parseDDMMYYYY } from "../core/dateEngine.js";

export function renderHome() {

    const gmvData = applyFilters("GMV");
    const adsData = applyFilters("CDR");

    const gmv = getGMVSummary();
    const ads = getCDRSummary();

    // Traffic from CDR
    let views=0, clicks=0, units=0;
    adsData.forEach(r=>{
        views+=Number(r["Views"]||0);
        clicks+=Number(r["Clicks"]||0);
        units+=Number(r["Total converted units"]||0);
    });

    const traffic = {
        views,
        clicks,
        units,
        ctr: views?clicks/views:0,
        cr: clicks?units/clicks:0
    };

    // GMV Chart grouping
    const gmvGrouped={};
    gmvData.forEach(r=>{
        const d=r["Order Date"];
        if(!gmvGrouped[d]) gmvGrouped[d]={gmv:0,cancel:0,return:0,net:0};
        gmvGrouped[d].gmv+=Number(r["GMV"]||0);
        gmvGrouped[d].cancel+=Number(r["Cancellation Units"]||0);
        gmvGrouped[d].return+=Number(r["Return Units"]||0);
        gmvGrouped[d].net+=Number(r["Final Sale Amount"]||0);
    });

    const gmvDates=Object.keys(gmvGrouped).sort((a,b)=>parseDDMMYYYY(a)-parseDDMMYYYY(b));

    const chartData={
        gmv:{
            labels:gmvDates,
            datasets:[
                {label:"GMV",data:gmvDates.map(d=>gmvGrouped[d].gmv),borderColor:"blue"},
                {label:"Cancel Units",data:gmvDates.map(d=>gmvGrouped[d].cancel),borderColor:"red"},
                {label:"Return Units",data:gmvDates.map(d=>gmvGrouped[d].return),borderColor:"orange"},
                {label:"Net Revenue",data:gmvDates.map(d=>gmvGrouped[d].net),borderColor:"green"}
            ]
        },
        ads:{
            labels:gmvDates,
            datasets:[
                {label:"Ad Spend",data:gmvDates.map(()=>0),borderColor:"purple"}
            ]
        },
        traffic:{
            labels:gmvDates,
            datasets:[
                {label:"Views",data:gmvDates.map(()=>0),borderColor:"blue"}
            ]
        }
    };

    renderFullDashboard(gmv,ads,traffic,chartData);
}
