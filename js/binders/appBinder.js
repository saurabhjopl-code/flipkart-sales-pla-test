import { renderHeader } from "../renderers/headerRenderer.js";
import { renderSidebar } from "../renderers/sidebarRenderer.js";
import { renderFilters } from "../renderers/filterRenderer.js";
import { loadAllData } from "../core/dataLoader.js";
import { subscribe } from "../core/stateManager.js";
import { renderHome } from "./homeBinder.js";

async function init() {

    renderHeader();
    renderSidebar();
    renderFilters();

    await loadAllData();

    renderHome();

    subscribe(() => {
        renderHome();
    });
}

init();
