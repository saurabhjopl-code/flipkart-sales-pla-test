export function renderGMVSummary(summary) {
    const container = document.getElementById("app-content");

    container.innerHTML = `
        <h2>GMV Summary</h2>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-bottom:20px;">
            <div><strong>Gross Units:</strong> ${summary.grossUnits}</div>
            <div><strong>Cancel Units:</strong> ${summary.cancelUnits}</div>
            <div><strong>Return Units:</strong> ${summary.returnUnits}</div>
            <div><strong>Final Units:</strong> ${summary.finalUnits}</div>

            <div><strong>GMV:</strong> ₹${summary.gmv}</div>
            <div><strong>Cancel Amount:</strong> ₹${summary.cancelAmount}</div>
            <div><strong>Return Amount:</strong> ₹${summary.returnAmount}</div>
            <div><strong>Final Amount:</strong> ₹${summary.finalAmount}</div>
        </div>

        <h3>Last 30 Days Final Sale Trend</h3>
        <div id="gmv-chart"></div>
    `;
}
