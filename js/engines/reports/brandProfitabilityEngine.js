import { applyFilters } from "../../core/filterEngine.js";

export function getBrandProfitability() {

    const gmv = applyFilters("GMV");
    const cfr = applyFilters("CFR");

    const map = {};

    // GMV aggregation
    gmv.forEach(r => {

        const brand = r["Brand"] || "Unknown";

        if (!map[brand]) {
            map[brand] = {
                brand,
                finalRevenue: 0,
                cancelUnits: 0,
                returnUnits: 0,
                grossUnits: 0,
                adRevenue: 0
            };
        }

        map[brand].finalRevenue += Number(r["Final Sale Amount"] || 0);
        map[brand].cancelUnits += Number(r["Cancellation Units"] || 0);
        map[brand].returnUnits += Number(r["Return Units"] || 0);
        map[brand].grossUnits += Number(r["Gross Units"] || 0);

    });

    // CFR ad revenue
    cfr.forEach(r => {

        const brand = r["Brand"] || "Unknown";

        if (!map[brand]) return;

        map[brand].adRevenue += Number(r["Total Revenue (Rs.)"] || 0);

    });

    const result = Object.values(map).map(b => {

        const organicRevenue = b.finalRevenue - b.adRevenue;

        const cancelRate = b.grossUnits ? b.cancelUnits / b.grossUnits : 0;
        const returnRate = b.grossUnits ? b.returnUnits / b.grossUnits : 0;

        const adShare = b.finalRevenue ? b.adRevenue / b.finalRevenue : 0;

        return {
            ...b,
            organicRevenue,
            cancelRate,
            returnRate,
            adShare
        };

    });

    result.sort((a,b)=>b.finalRevenue-a.finalRevenue);

    return result;
}
