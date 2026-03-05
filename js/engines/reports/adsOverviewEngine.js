import { applyFilters } from "../../core/filterEngine.js";

export function getAdsOverview(){

const data = applyFilters("CDR");
const gmvData = applyFilters("GMV");

let spend = 0;
let views = 0;
let clicks = 0;
let units = 0;
let revenue = 0;

const campaignMap = {};

data.forEach(row=>{

const campaign = row["campaign_name"] || "Unknown";

/* correct column names */

const adSpend = Number(row["ad_spend"] || 0);
const v = Number(row["views"] || 0);
const c = Number(row["clicks"] || 0);
const u = Number(row["total_converted_units"] || 0);
const rev = Number(row["total_revenue_(rs.)"] || 0);

/* totals */

spend += adSpend;
views += v;
clicks += c;
units += u;
revenue += rev;

/* campaign aggregation */

if(!campaignMap[campaign]){

campaignMap[campaign] = {
campaign,
spend:0,
views:0,
clicks:0,
units:0,
revenue:0
};

}

campaignMap[campaign].spend += adSpend;
campaignMap[campaign].views += v;
campaignMap[campaign].clicks += c;
campaignMap[campaign].units += u;
campaignMap[campaign].revenue += rev;

});

/* GMV FINAL SALE */

let finalRevenue = 0;

gmvData.forEach(r=>{
finalRevenue += Number(r["Final Sale Amount"] || 0);
});

/* KPIs */

const roi = spend ? revenue/spend : 0;
const ctr = views ? (clicks/views)*100 : 0;
const cvr = clicks ? (units/clicks)*100 : 0;

const fixedAds = finalRevenue * 0.03;
const diff = spend - fixedAds;

return {

summary:{
spend,
roi,
views,
clicks,
ctr,
units,
cvr,
revenue,
fixedAds,
diff
},

campaigns:Object.values(campaignMap)

};

}
