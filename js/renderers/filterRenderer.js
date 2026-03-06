import { setFilters, STATE } from "../core/stateManager.js";
import { getTodayISO, getLast30Days } from "../core/dateEngine.js";

export function renderFilters() {

const container = document.getElementById("filter-bar");

const accList = (STATE.meta && STATE.meta.accList)
? STATE.meta.accList
: [];

const accOptions = `
<option value="">All Accounts</option>
${accList.map(acc => `<option value="${acc}">${acc}</option>`).join("")}
`;

/* -------- Month Options -------- */

const monthNames = [
"Jan","Feb","Mar","Apr","May","Jun",
"Jul","Aug","Sep","Oct","Nov","Dec"
];

const startMonth = new Date(2025,10,1); // Nov 2025
const today = new Date();

let monthOptions = `<option value="">All</option>`;

let cursor = new Date(startMonth);

while(cursor <= today){

const year = cursor.getFullYear();
const month = cursor.getMonth();

const monthNum = String(month+1).padStart(2,"0");

const label = `${monthNames[month]} ${year}`;

monthOptions += `<option value="${year}-${monthNum}">${label}</option>`;

cursor.setMonth(cursor.getMonth()+1);
}

/* -------- UI -------- */

container.innerHTML = `

<div class="filter-group">
<label>Account</label>
<select id="acc-select" style="min-width:200px;">
${accOptions}
</select>
</div>

<div class="filter-group">
<label>Month</label>
<select id="month-select" style="min-width:160px;">
${monthOptions}
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

<div class="filter-group quick-buttons">

<button id="btn-7">Last 7 Days</button>
<button id="btn-30">Last 30 Days</button>
<button id="btn-this-month">This Month</button>
<button id="btn-last-month">Last Month</button>

</div>

<div class="filter-actions">
<button id="clear-filters">Clear</button>
</div>

`;

const accSelect = document.getElementById("acc-select");
const monthSelect = document.getElementById("month-select");
const startInput = document.getElementById("start-date");
const endInput = document.getElementById("end-date");

/* -------- Default = Last 30 Days -------- */

const last30 = getLast30Days();

startInput.value = last30.start;
endInput.value = last30.end;

/* -------- Filter Update -------- */

function update(){

const selectedAcc = accSelect.value;

setFilters({
acc: selectedAcc ? [selectedAcc] : [],
startDate: startInput.value || null,
endDate: endInput.value || null
});

}

/* -------- Month Change -------- */

monthSelect.addEventListener("change",()=>{

const val = monthSelect.value;

if(!val){
update();
return;
}

const [year,month] = val.split("-");

const firstDay = `${year}-${month}-01`;

const lastDayDate = new Date(year, month, 0);
const lastDay = lastDayDate.toISOString().split("T")[0];

startInput.value = firstDay;
endInput.value = lastDay;

update();

});

/* -------- Quick Buttons -------- */

document.getElementById("btn-7").onclick = ()=>{

const today = new Date();
const past = new Date();

past.setDate(today.getDate()-7);

startInput.value = past.toISOString().split("T")[0];
endInput.value = today.toISOString().split("T")[0];

update();

};

document.getElementById("btn-30").onclick = ()=>{

const last30 = getLast30Days();

startInput.value = last30.start;
endInput.value = last30.end;

update();

};

document.getElementById("btn-this-month").onclick = ()=>{

const today = new Date();

const firstDay = new Date(today.getFullYear(), today.getMonth(),1);

startInput.value = firstDay.toISOString().split("T")[0];
endInput.value = today.toISOString().split("T")[0];

update();

};

document.getElementById("btn-last-month").onclick = ()=>{

const today = new Date();

const firstDay = new Date(today.getFullYear(), today.getMonth()-1,1);
const lastDay = new Date(today.getFullYear(), today.getMonth(),0);

startInput.value = firstDay.toISOString().split("T")[0];
endInput.value = lastDay.toISOString().split("T")[0];

update();

};

/* -------- Standard Filters -------- */

accSelect.addEventListener("change",update);
startInput.addEventListener("change",update);
endInput.addEventListener("change",update);

/* -------- Clear Button -------- */

document.getElementById("clear-filters").addEventListener("click",()=>{

accSelect.value="";
monthSelect.value="";

const last30 = getLast30Days();

startInput.value = last30.start;
endInput.value = last30.end;

setFilters({
acc:[],
startDate:last30.start,
endDate:last30.end
});

});

/* -------- Initial Load -------- */

setFilters({
acc:[],
startDate:last30.start,
endDate:last30.end
});

}
