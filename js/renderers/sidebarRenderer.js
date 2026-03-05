import { renderHome } from "../binders/homeBinder.js";
import { renderAdsPage } from "../binders/adsBinder.js";
import { renderGmvPage } from "../binders/gmvBinder.js";
import { renderCtrPage } from "../binders/ctrBinder.js";
import { renderSmartPage } from "../binders/smartBinder.js";

import { setActivePage } from "../core/stateManager.js";
import { getInsights } from "../engines/insights/insightsEngine.js";

export function renderSidebar() {

    const sidebar = document.getElementById("sidebar");

    sidebar.innerHTML = `
        <div id="nav-home">Home</div>
        <div id="nav-ads">Ads</div>
        <div id="nav-gmv">GMV</div>
        <div id="nav-ctr">CTR</div>
        <div id="nav-smart">Smart Reports</div>
    `;

    document.getElementById("nav-home").onclick = () => {
        setActivePage("home");
        renderHome();
    };

    document.getElementById("nav-ads").onclick = () => {
        setActivePage("ads");
        renderAdsPage();
    };

    document.getElementById("nav-gmv").onclick = () => {
        setActivePage("gmv");
        renderGmvPage();
    };

    document.getElementById("nav-ctr").onclick = () => {
        setActivePage("ctr");
        renderCtrPage();
    };

    document.getElementById("nav-smart").onclick = () => {
        setActivePage("smart");
        renderSmartPage();
    };

}
