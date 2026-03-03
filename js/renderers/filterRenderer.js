import { setFilters } from "../core/stateManager.js";
import { getLast30Days, getTodayISO } from "../core/dateEngine.js";

export function renderFilters() {

    const { start, end } = getLast30Days();

    const container = document.getElementById("filter-bar");

    container.innerHTML = `
        <div>
            <label>ACC</label><br/>
            <input type="text" id="acc-input" placeholder="Comma separated ACC" />
        </div>

        <div>
            <label>Start Date</label><br/>
            <input type="date" id="start-date" max="${getTodayISO()}" value="${start}" />
        </div>

        <div>
            <label>End Date</label><br/>
            <input type="date" id="end-date" max="${getTodayISO()}" value="${end}" />
        </div>
    `;

    function update() {
        const accVal = document.getElementById("acc-input").value;
        const accList = accVal ? accVal.split(",").map(a => a.trim()) : [];

        setFilters({
            acc: accList,
            startDate: document.getElementById("start-date").value,
            endDate: document.getElementById("end-date").value
        });
    }

    document.getElementById("acc-input").addEventListener("input", update);
    document.getElementById("start-date").addEventListener("change", update);
    document.getElementById("end-date").addEventListener("change", update);
}
