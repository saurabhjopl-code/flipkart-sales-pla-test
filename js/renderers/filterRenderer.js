import { setFilters, STATE } from "../core/stateManager.js";
import { getTodayISO } from "../core/dateEngine.js";

export function renderFilters() {

    const container = document.getElementById("filter-bar");

    // SAFE FALLBACK
    const accList = (STATE.meta && STATE.meta.accList) 
        ? STATE.meta.accList 
        : [];

    const accOptions = accList
        .map(acc => `<option value="${acc}">${acc}</option>`)
        .join("");

    container.innerHTML = `
        <div class="filter-group">
            <label>Accounts</label>
            <select id="acc-select" multiple size="4" style="min-width:200px;">
                ${accOptions}
            </select>
        </div>

        <div class="filter-group">
            <label>Start Date</label>
            <input type="date" id="start-date" max="${getTodayISO()}" />
        </div>

        <div class="filter-group">
            <label>End Date</label>
            <input type="date" id="end-date" max="${getTodayISO()}" />
        </div>

        <div class="filter-actions">
            <button id="clear-filters">Clear</button>
        </div>
    `;

    function update() {
        const selected = Array.from(
            document.getElementById("acc-select").selectedOptions
        ).map(opt => opt.value);

        setFilters({
            acc: selected,
            startDate: document.getElementById("start-date").value || null,
            endDate: document.getElementById("end-date").value || null
        });
    }

    document.getElementById("acc-select").addEventListener("change", update);
    document.getElementById("start-date").addEventListener("change", update);
    document.getElementById("end-date").addEventListener("change", update);

    document.getElementById("clear-filters").addEventListener("click", () => {
        document.getElementById("acc-select").selectedIndex = -1;
        document.getElementById("start-date").value = "";
        document.getElementById("end-date").value = "";

        setFilters({
            acc: [],
            startDate: null,
            endDate: null
        });
    });

    // Default state
    setFilters({
        acc: [],
        startDate: null,
        endDate: null
    });
}
