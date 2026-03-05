import { STATE } from "../../core/stateManager.js";

export function getCtrSummary(){

const rows = STATE.rawData.CTR || [];
const filters = STATE.filters || {};

let saleValue = 0;
let cancelValue = 0;
let returnValue = 0;

let saleOrders = 0;
let cancelOrders = 0;
let returnOrders = 0;

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
