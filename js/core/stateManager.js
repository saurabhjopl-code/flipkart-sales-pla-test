export const STATE = {
    rawData: {
        CDR: [],
        CFR: [],
        PPR: [],
        CKR: [],
        GMV: [],
        CTR: []
    },
    filters: {
        acc: [],
        startDate: null,
        endDate: null
    },
    listeners: []
};

export function setFilters(newFilters) {
    STATE.filters = { ...STATE.filters, ...newFilters };
    notify();
}

export function subscribe(listener) {
    STATE.listeners.push(listener);
}

function notify() {
    STATE.listeners.forEach(fn => fn());
}
meta: {
    accList: []
},
