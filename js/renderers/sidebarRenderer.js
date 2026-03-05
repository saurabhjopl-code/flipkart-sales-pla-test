import { renderHome } from "../binders/homeBinder.js";
import { renderAdsPage } from "../binders/adsBinder.js";
import { renderGmvPage } from "../binders/gmvBinder.js";
import { setActivePage } from "../core/stateManager.js";
import { renderSmartPage } from "../binders/smartBinder.js";

export function renderSidebar() {

    const sidebar = document.getElementById("sidebar");

    sidebar.innerHTML = `
        <div id="nav-home">Home</div>
        <div id="nav-ads">Ads</div>
        <div id="nav-gmv">GMV</div>
        <div>CTR</div>
        <div>Smart Reports</div>
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

    document.getElementById("nav-smart").onclick = () => {
    setActivePage("smart");
    renderSmartPage();
};
}
