import { STATE } from "../../core/stateManager.js";

export function getCtrOrders(){

const data =
STATE?.data?.ctr ||
STATE?.data?.CTR ||
STATE?.data?.ctrData ||
[];

const rows = data.map(row => {

const date = row["Order Date"] || "";
const sku = row["SKU"] || "";
const type = row["Event Type"] || "";
const fulfilment = row["Fulfilment Type"] || "";
const price = Number(row["Price before discount"] || 0);

return {
date,
sku,
type,
fulfilment,
price
};

});

rows.sort((a,b)=>{

const d1 = new Date(a.date.split("/").reverse().join("-"));
const d2 = new Date(b.date.split("/").reverse().join("-"));

return d2 - d1;

});

return rows.slice(0,200);

}
