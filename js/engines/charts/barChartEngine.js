export function createBarChart(containerId, labels, values) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    const max = Math.max(...values, 1);

    labels.forEach((label, i) => {
        const barWrapper = document.createElement("div");
        barWrapper.style.marginBottom = "6px";

        const bar = document.createElement("div");
        bar.style.height = "20px";
        bar.style.width = (values[i] / max) * 100 + "%";
        bar.style.background = "#4f46e5";

        const text = document.createElement("small");
        text.innerText = label + " : " + values[i];

        barWrapper.appendChild(text);
        barWrapper.appendChild(bar);

        container.appendChild(barWrapper);
    });
}
