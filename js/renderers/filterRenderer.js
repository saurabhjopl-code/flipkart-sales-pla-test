import { setFilters } from "../core/stateManager.js";
import { getLast30Days, getTodayISO } from "../core/dateEngine.js";

export function renderFilters() {

    const { start, end } = getLast30Days();

    const container = document.getElementById("filter-bar");
    container.innerHTML = `
        <label>ACC:</label>
        <input type="text" id="acc-input" placeholder="Comma separated ACC" />

        <label>Start Date:</label>
        <input type="date" id="start-date" max="${getTodayISO()}" value="${start}" />

        <label>End Date:</label>
        <input type="date" id="end-date" max="${getTodayISO()}" value="${end}" />
    `;

    document.getElementById("start-date").addEventListener("change", update);
    document.getElementById("end-date").addEventListener("change", update);
    document.getElementById("acc-input").addEventListener("input", update);

    function update() {
        const accVal = document.getElementById("acc-input").value;
        const accList = accVal ? accVal.split(",").map(a => a.trim()) : [];

        setFilters({
            acc: accList,
            startDate: document.getElementById("start-date").value,
            endDate: document.getElementById("end-date").value
        });
    }
}
