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
    meta: {
        accList: []
    },
    listeners: []
};

export function setFilters(newFilters) {
    STATE.filters = { ...STATE.filters, ...newFilters };
    notify();
}

export function setMeta(newMeta) {
    STATE.meta = { ...STATE.meta, ...newMeta };
}

export function subscribe(listener) {
    STATE.listeners.push(listener);
}

function notify() {
    STATE.listeners.forEach(fn => fn());
}
