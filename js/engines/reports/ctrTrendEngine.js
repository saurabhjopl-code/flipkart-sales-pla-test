import { STATE } from "../../core/stateManager.js";

export function getCtrTrend(){

const rows = STATE.rawData.CTR || [];

const accFilter = STATE.ui.acc;
const startDate = STATE.ui.startDate;
const endDate = STATE.ui.endDate;

const map = {};

rows.forEach(r=>{

const acc = r["ACC"];
const date = r["Order Date"];

if(!date) return;

/* ACCOUNT FILTER */

if(accFilter && accFilter !== "All Accounts"){
if(acc !== accFilter) return;
}

/* DATE FILTER */

const d = new Date(date.split("/").reverse().join("-"));

if(startDate){
const sd = new Date(startDate);
if(d < sd) return;
}

if(endDate){
const ed = new Date(endDate);
if(d > ed) return;
}

const type = (r["Event Type"] || "").trim();
const value = Number(r["Price before discount"] || 0);

if(!map[date]){
map[date] = {
sales:0,
cancel:0,
return:0
};
}

if(type === "Sale") map[date].sales += value;
if(type === "Cancel") map[date].cancel += value;
if(type === "Return") map[date].return += value;

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
