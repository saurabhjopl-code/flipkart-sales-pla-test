import { renderHome } from "../binders/homeBinder.js";
import { renderAdsPage } from "../binders/adsBinder.js";

export function renderSidebar() {

    const sidebar = document.getElementById("sidebar");

    sidebar.innerHTML = `
        <div id="nav-home">Home</div>
        <div id="nav-gmv">GMV</div>
        <div id="nav-ctr">CTR</div>
        <div id="nav-ads">Ads</div>
        <div id="nav-smart">Smart Reports</div>
    `;

    document.getElementById("nav-home").onclick = renderHome;
    document.getElementById("nav-ads").onclick = renderAdsPage;
}
