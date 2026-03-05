import { applyFilters } from "../../core/filterEngine.js";

export function getSmartFunnel() {

    const cdr = applyFilters("CDR");
    const ctr = applyFilters("CTR");
    const gmv = applyFilters("GMV");

    let views = 0;
    let clicks = 0;
    let adUnits = 0;

    let grossUnits = 0;

    let finalUnits = 0;
    let cancelUnits = 0;
    let returnUnits = 0;

    // Ads data
    cdr.forEach(r => {

        views += Number(r["Views"] || 0);
        clicks += Number(r["Clicks"] || 0);
        adUnits += Number(r["Total converted units"] || 0);

    });

    // Orders
    ctr.forEach(r => {

        if (r["Event Type"] === "sale") {
            grossUnits += Number(r["Item Quantity"] || 0);
        }

    });

    // Final sales
    gmv.forEach(r => {

        finalUnits += Number(r["Final Sale Units"] || 0);
        cancelUnits += Number(r["Cancellation Units"] || 0);
        returnUnits += Number(r["Return Units"] || 0);

    });

    const ctrRate = views ? clicks / views : 0;
    const adCVR = clicks ? adUnits / clicks : 0;

    const cancelRate = grossUnits ? cancelUnits / grossUnits : 0;
    const returnRate = grossUnits ? returnUnits / grossUnits : 0;

    const orderLoss = grossUnits - finalUnits;

    return {
        views,
        clicks,
        adUnits,
        grossUnits,
        finalUnits,
        cancelUnits,
        returnUnits,
        ctrRate,
        adCVR,
        cancelRate,
        returnRate,
        orderLoss
    };
}
