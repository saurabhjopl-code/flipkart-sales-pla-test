import { renderHeader } from "../renderers/headerRenderer.js";
import { renderSidebar } from "../renderers/sidebarRenderer.js";
import { renderFilters } from "../renderers/filterRenderer.js";
import { loadAllData } from "../core/dataLoader.js";
import { subscribe } from "../core/stateManager.js";

function renderApp() {
    document.getElementById("app-content").innerHTML =
        "<h2>System Ready</h2><p>Reports will render here.</p>";
}

async function init() {
    renderHeader();
    renderSidebar();
    renderFilters();

    await loadAllData();

    renderApp();

    subscribe(() => {
        renderApp();
    });
}

init();
