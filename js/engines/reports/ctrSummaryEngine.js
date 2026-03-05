import { STATE } from "../../core/stateManager.js";

export function getCtrSummary(){

const rows = STATE.rawData.CTR || [];

const accFilter = STATE.ui.acc;
const startDate = STATE.ui.startDate;
const endDate = STATE.ui.endDate;

let saleValue = 0;
let cancelValue = 0;
let returnValue = 0;

let saleOrders = 0;
let cancelOrders = 0;
let returnOrders = 0;

rows.forEach(row=>{

const acc = row["ACC"];
const date = row["Order Date"];

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

const type = (row["Event Type"] || "").toLowerCase();
const price = Number(row["Price before discount"] || 0);

if(type === "sale"){
saleValue += price;
saleOrders++;
}

if(type === "cancel"){
cancelValue += price;
cancelOrders++;
}

if(type === "return"){
returnValue += price;
returnOrders++;
}

});

const netValue = saleValue - cancelValue - returnValue;
const netOrders = saleOrders - cancelOrders - returnOrders;

return {
saleValue,
cancelValue,
returnValue,
netValue,
saleOrders,
cancelOrders,
returnOrders,
netOrders
};

}
