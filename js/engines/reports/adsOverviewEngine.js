import { applyFilters } from "../../core/filterEngine.js";

export function getAdsOverview(){

const adsData = applyFilters("CDR");
const gmvData = applyFilters("GMV");

let spend = 0;
let units = 0;
let revenue = 0;

/* Ads data */

adsData.forEach(row => {

spend += Number(row["Ad Spend"] || 0);
units += Number(row["Total Converted Units"] || 0);
revenue += Number(row["Total Revenue (Rs.)"] || 0);

});

/* GMV Net Revenue */

let finalRevenue = 0;

gmvData.forEach(row => {

finalRevenue += Number(row["Final Sale Amount"] || 0);

});

/* Fixed Ads Budget (3%) */

const fixedAds = finalRevenue * 0.03;

/* Difference */

const diff = spend - fixedAds;

/* ROI */

const roi = spend ? revenue / spend : 0;

return {
spend,
units,
revenue,
roi,
fixedAds,
diff
};

}
