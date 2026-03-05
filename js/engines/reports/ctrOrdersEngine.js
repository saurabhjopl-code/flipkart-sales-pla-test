import { STATE } from "../../core/stateManager.js";

export function getCtrOrders(){

const rows = STATE.rawData.CTR || [];
const filters = STATE.filters || {};

const data = [];

rows.forEach(row => {

const acc = row["ACC"] || "";
const date = row["Order Date"] || "";

/* ACCOUNT FILTER */
if(filters.acc && filters.acc !== "All Accounts"){
if(acc !== filters.acc) return;
}

/* DATE FILTER */
if(filters.startDate){
if(new Date(date.split("/").reverse().join("-")) < new Date(filters.startDate)) return;
}

if(filters.endDate){
if(new Date(date.split("/").reverse().join("-")) > new Date(filters.endDate)) return;
}

const sku = row["SKU"] || "";
const type = row["Event Type"] || "";
const fulfilment = row["Fulfilment Type"] || "";
const price = Number(row["Price before discount"] || 0);

data.push({
date,
sku,
type,
fulfilment,
price
});

});

data.sort((a,b)=>{

const d1 = new Date(a.date.split("/").reverse().join("-"));
const d2 = new Date(b.date.split("/").reverse().join("-"));

return d2 - d1;

});

return data.slice(0,200);

}
