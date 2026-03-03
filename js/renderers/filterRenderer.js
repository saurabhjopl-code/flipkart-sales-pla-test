import { setFilters, STATE } from "../core/stateManager.js";
import { getTodayISO } from "../core/dateEngine.js";

export function renderFilters() {

    const container = document.getElementById("filter-bar");

    const accList = (STATE.meta && STATE.meta.accList)
        ? STATE.meta.accList
        : [];

    const accOptions = `
        <option value="">All Accounts</option>
        ${accList.map(acc => `<option value="${acc}">${acc}</option>`).join("")}
    `;

    container.innerHTML = `
        <div class="filter-group">
            <label>Account</label>
            <select id="acc-select" style="min-width:220px;">
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

        const selectedAcc = document.getElementById("acc-select").value;

        setFilters({
            acc: selectedAcc ? [selectedAcc] : [],
            startDate: document.getElementById("start-date").value || null,
            endDate: document.getElementById("end-date").value || null
        });
    }

    document.getElementById("acc-select").addEventListener("change", update);
    document.getElementById("start-date").addEventListener("change", update);
    document.getElementById("end-date").addEventListener("change", update);

    document.getElementById("clear-filters").addEventListener("click", () => {

        document.getElementById("acc-select").value = "";
        document.getElementById("start-date").value = "";
        document.getElementById("end-date").value = "";

        setFilters({
            acc: [],
            startDate: null,
            endDate: null
        });
    });

    // Default: All accounts
    setFilters({
        acc: [],
        startDate: null,
        endDate: null
    });
}
