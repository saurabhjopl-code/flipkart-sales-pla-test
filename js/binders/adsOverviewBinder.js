import { getAdsOverview } from "../engines/reports/adsOverviewEngine.js";
import { renderAdsOverview } from "../renderers/adsOverviewRenderer.js";

export function renderAdsOverviewPage(){

const data = getAdsOverview();

renderAdsOverview(data);

}
