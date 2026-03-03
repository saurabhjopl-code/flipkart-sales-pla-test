import { renderHome } from "../binders/homeBinder.js";
import { renderAdsPage } from "../binders/adsBinder.js";
import { setActivePage } from "../core/stateManager.js";

export function renderSidebar() {

    const sidebar = document.getElementById("sidebar");

    sidebar.innerHTML = `
        <div id="nav-home">Home</div>
        <div id="nav-ads">Ads</div>
        <div>GMV</div>
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
}
