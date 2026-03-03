import { renderHeader } from "../renderers/headerRenderer.js";
import { renderSidebar } from "../renderers/sidebarRenderer.js";
import { renderFilters } from "../renderers/filterRenderer.js";
import { loadAllData } from "../core/dataLoader.js";
import { subscribe } from "../core/stateManager.js";
import { renderHome } from "./homeBinder.js";

async function init() {

    renderHeader();
    renderSidebar();

    // LOAD DATA FIRST
    await loadAllData();

    // THEN RENDER FILTERS (now accList is ready)
    renderFilters();

    // THEN RENDER HOME
    renderHome();

    // React to filter changes
    subscribe(() => {
    const active = document.querySelector(".sidebar div.active");
    if (active && active.id === "nav-ads") {
        renderAdsPage();
    } else {
        renderHome();
    }
});
}

init();
