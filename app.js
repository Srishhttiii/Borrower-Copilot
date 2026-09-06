const form = document.querySelector("#borrower-form");
const collateralField = document.querySelector("#collateralField");
const emptyText = "Complete the questions above";

function readInput() {
  return Object.fromEntries(new FormData(form).entries());
}

function setForm(values) {
  clearForm(false);
  Object.entries(values).forEach(([key, value]) => {
    const node = form.elements[key];
    if (node) node.value = value;
  });
  render();
}

function clearForm(shouldRender = true) {
  Array.from(form.elements).forEach((node) => {
    if (!node.name) return;
    node.value = "";
  });
  if (shouldRender) render();
}

function text(id, value) {
  document.querySelector(`#${id}`).textContent = value;
}

function pct(value) {
  return `${value.toFixed(1)}%`;
}

function hasMinimumInputs(input) {
  return Boolean(
    input.employment &&
    input.income &&
    input.existingEmi !== "" &&
    input.expenses &&
    input.purpose &&
    input.amountWanted &&
    input.tenure
  );
}

function renderEmpty() {
  collateralField.style.display = "none";
  text("confidence-line", "Fill the details above to get the verdict, loan amount, rate band, EMI ceiling and negotiation card.");
  text("verdict", emptyText);
  text("verdictWhy", "The result will appear after the must-have fields are filled.");
  text("lenderAmount", "--");
  text("lenderWhy", "Estimated lender sanction will show here.");
  text("safeAmount", "--");
  text("safeWhy", "Borrower-safe capacity will show here.");
  text("rateBand", "--");
  text("rateWhy", "Fair rate range will show here.");
  text("aprBand", "--");
  text("aprWhy", "All-in APR range will show here.");
  text("emiCeiling", "--");
  text("emiWhy", "Monthly ceiling will show here.");
  document.querySelector("#tenureTable").innerHTML = `
    <div class="tenure-row tenure-head">
      <span>Tenure</span>
      <span>Safe principal</span>
      <span>Monthly outflow</span>
    </div>
    <div class="tenure-row">
      <span>--</span>
      <strong>--</strong>
      <span>Fill the borrower questions to compare monthly outflow.</span>
    </div>
  `;
  text("cardTitle", "Negotiation Card");
  text("cardVerdict", "A borrower-ready card will appear here after the questions are complete.");
  text("cardAsk", "--");
  text("cardCap", "--");
  text("cardRate", "--");
  text("cardApr", "--");
  text("stressCase", "The stress case will show what happens if income drops or rate rises.");
}

function render() {
  const input = readInput();
  if (!hasMinimumInputs(input)) {
    renderEmpty();
    return;
  }

  const result = assess(input);
  const name = input.name || "Borrower";
  const needsCollateral = !result.product.unsecured;
  collateralField.style.display = needsCollateral ? "grid" : "none";

  text("confidence-line", `${result.confidence} confidence. Ranges widen when credit score, collateral or savings are unknown.`);
  text("verdict", result.verdict);
  text("verdictWhy", result.explanations.verdict);
  text("lenderAmount", money(result.lenderLikely));
  text("lenderWhy", result.explanations.lender);
  text("safeAmount", money(result.safeAmount));
  text("safeWhy", result.explanations.safe);
  text("rateBand", `${pct(result.band[0])} - ${pct(result.band[1])}`);
  text("rateWhy", result.explanations.rate);
  text("aprBand", `${pct(result.apr[0])} - ${pct(result.apr[1])}`);
  text("aprWhy", result.explanations.apr);
  text("emiCeiling", money(result.emiCeiling));
  text("emiWhy", result.explanations.emi);

  document.querySelector("#tenureTable").innerHTML = `
    <div class="tenure-row tenure-head">
      <span>Tenure</span>
      <span>Safe principal</span>
      <span>Monthly outflow</span>
    </div>
  ` + result.rows.map((row) => `
    <div class="tenure-row">
      <span>${row.months} months</span>
      <strong>${money(row.safe)}</strong>
      <span>EMI on shown amount: ${money(row.emiWanted)}</span>
    </div>
  `).join("");

  const ask = Math.min(Number(input.amountWanted) || 0, result.safeAmount);
  text("cardTitle", `${name}: ${result.verdict} on ${result.product.label.toLowerCase()}`);
  text("cardVerdict", `Lender may sanction around ${money(result.lenderLikely)}, but borrower-safe capacity is ${money(result.safeAmount)}.`);
  text("cardAsk", money(ask));
  text("cardCap", `${money(result.emiCeiling)} EMI`);
  text("cardRate", `${pct(result.band[0])} - ${pct(result.band[1])}`);
  text("cardApr", `${pct(result.apr[0])} - ${pct(result.apr[1])}`);
  text("stressCase", `Stress case: if income drops 20% or rate rises to ${pct(result.stress.rate)}, safe EMI room falls to ${money(result.stress.ceiling)} and safe principal is about ${money(result.stress.amount)}.`);
}

form.addEventListener("input", render);
document.querySelectorAll("[data-demo]").forEach((button) => {
  button.addEventListener("click", () => setForm(DEMOS[button.dataset.demo]));
});
document.querySelector("#reset").addEventListener("click", () => clearForm());

clearForm();
