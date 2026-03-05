import { STATE } from "../../core/stateManager.js";

export function getInsights(){

const insights=[];

const ctr=STATE.data.ctr || [];
const ads=STATE.data.cfr || [];
const campaigns=STATE.data.cdr || [];

let skuStats={};

ctr.forEach(r=>{

const sku=r.sku;

if(!skuStats[sku]){
skuStats[sku]={sales:0,cancel:0,return:0};
}

if(r.event_type==="SALE") skuStats[sku].sales+=Number(r.item_quantity||0);
if(r.event_type==="CANCEL") skuStats[sku].cancel+=Number(r.item_quantity||0);
if(r.event_type==="RETURN") skuStats[sku].return+=Number(r.item_quantity||0);

});

Object.keys(skuStats).forEach(sku=>{

const s=skuStats[sku];

const cancelRate=s.cancel/(s.sales||1);
const returnRate=s.return/(s.sales||1);

if(cancelRate>0.25){
insights.push({
type:"alert",
text:`High cancel rate for SKU ${sku} (${(cancelRate*100).toFixed(1)}%)`
});
}

if(returnRate>0.25){
insights.push({
type:"alert",
text:`High return rate for SKU ${sku} (${(returnRate*100).toFixed(1)}%)`
});
}

});

campaigns.forEach(c=>{

const spend=Number(c.ad_spend||0);
const revenue=Number(c.total_revenue_rs||0);
const clicks=Number(c.clicks||0);
const views=Number(c.views||0);

const ctrRate=clicks/(views||1);
const roi=revenue/(spend||1);

if(spend>5000 && revenue===0){
insights.push({
type:"alert",
text:`Campaign "${c.campaign_name}" spending without revenue`
});
}

if(ctrRate<0.005){
insights.push({
type:"warning",
text:`Low CTR campaign "${c.campaign_name}"`
});
}

if(roi>8){
insights.push({
type:"opportunity",
text:`Scale campaign "${c.campaign_name}" ROI ${roi.toFixed(1)}`
});
}

});

return insights;

}
