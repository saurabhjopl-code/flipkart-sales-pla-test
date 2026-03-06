import { applyFilters } from "../../core/filterEngine.js";

export function getAdsOverview() {

    const data = applyFilters("CDR");

    let spend = 0;
    let views = 0;
    let clicks = 0;
    let units = 0;
    let revenue = 0;

    const campaignMap = {};

    data.forEach(row => {

        const campaign = row["Campaign Name"] || "Unknown";

        const s = Number(row["Ad Spend"] || 0);
        const v = Number(row["Views"] || 0);
        const c = Number(row["Clicks"] || 0);
        const u = Number(row["Total Converted Units"] || 0);
        const r = Number(row["Total Revenue (Rs.)"] || 0);

        spend += s;
        views += v;
        clicks += c;
        units += u;
        revenue += r;

        if (!campaignMap[campaign]) {
            campaignMap[campaign] = {
                campaign,
                spend: 0,
                views: 0,
                clicks: 0,
                units: 0,
                revenue: 0
            };
        }

        campaignMap[campaign].spend += s;
        campaignMap[campaign].views += v;
        campaignMap[campaign].clicks += c;
        campaignMap[campaign].units += u;
        campaignMap[campaign].revenue += r;

    });

    const campaigns = Object.values(campaignMap);

    const roi = spend > 0 ? revenue / spend : 0;
    const ctr = views > 0 ? (clicks / views) * 100 : 0;
    const cvr = clicks > 0 ? (units / clicks) * 100 : 0;

    return {
        spend,
        views,
        clicks,
        units,
        revenue,
        roi,
        ctr,
        cvr,
        campaigns
    };
}
