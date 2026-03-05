import { STATE } from "../../core/stateManager.js";

export function getCtrTrend(){

const rows = STATE.rawData.CTR || [];
const filters = STATE.filters || {};

const map = {};

rows.forEach(r=>{

const acc = r["ACC"] || "";
const date = r["Order Date"] || "";

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

const type = (r["Event Type"] || "").trim();
const value = Number(r["Price before discount"] || 0);

if(!date) return;

if(!map[date]){
map[date] = {
sales:0,
cancel:0,
return:0
};
}

if(type === "Sale"){
map[date].sales += value;
}

if(type === "Cancel"){
map[date].cancel += value;
}

if(type === "Return"){
map[date].return += value;
}

});

const labels = Object.keys(map).sort((a,b)=>{

const da = new Date(a.split("/").reverse().join("-"));
const db = new Date(b.split("/").reverse().join("-"));

return da - db;

});

const sales = [];
const cancel = [];
const ret = [];
const net = [];

labels.forEach(d=>{

const s = map[d].sales;
const c = map[d].cancel;
const r = map[d].return;

sales.push(s);
cancel.push(c);
ret.push(r);
net.push(s - c - r);

});

return {
labels,
sales,
cancel,
return:ret,
net
};

}
