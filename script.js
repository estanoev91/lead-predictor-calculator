const revenueInput = document.getElementById("revenue");
const avgOrderInput = document.getElementById("avgOrder");
const leadRateInput = document.getElementById("leadRate");
const prospectRateInput = document.getElementById("prospectRate");
const currencySelect = document.getElementById("currency");

const customersValue = document.getElementById("customersValue");
const leadsValue = document.getElementById("leadsValue");
const prospectsValue = document.getElementById("prospectsValue");

const leadRateValue = document.getElementById("leadRateValue");
const prospectRateValue = document.getElementById("prospectRateValue");
const leadPercentLabel = document.getElementById("leadPercentLabel");
const customerPercentLabel = document.getElementById("customerPercentLabel");

const prospectsBar = document.getElementById("prospectsBar");
const leadsBar = document.getElementById("leadsBar");
const customersBar = document.getElementById("customersBar");

const chart = document.getElementById("chart");

function safeNumber(value, fallback = 1) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function formatNumber(value) {
  return Math.ceil(value).toLocaleString("en-US");
}

function calculate() {
  const revenue = safeNumber(revenueInput.value);
  const avgOrder = safeNumber(avgOrderInput.value);
  const leadRate = safeNumber(leadRateInput.value);
  const prospectRate = safeNumber(prospectRateInput.value);

  // Formula 01: Customers = Revenue / Average Order Value
  const customers = revenue / avgOrder;

  // Formula 02: Leads = Customers * 100 / Lead Response Rate
  const leads = customers * 100 / leadRate;

  // Formula 03: Prospects = Leads * 100 / Prospect Response Rate
  const prospects = leads * 100 / prospectRate;

  customersValue.textContent = formatNumber(customers);
  leadsValue.textContent = formatNumber(leads);
  prospectsValue.textContent = formatNumber(prospects);

  leadRateValue.textContent = `${leadRate.toFixed(2)}%`;
  prospectRateValue.textContent = `${prospectRate.toFixed(2)}%`;
  leadPercentLabel.textContent = `${prospectRate.toFixed(0)}%`;
  customerPercentLabel.textContent = `${Math.round((customers / prospects) * 100)}%`;

  prospectsBar.style.width = "100%";
  leadsBar.style.width = `${Math.min((leads / prospects) * 100, 100)}%`;
  customersBar.style.width = `${Math.min((customers / prospects) * 100, 100)}%`;

  renderChart(prospects, leads, customers);
}

function renderChart(prospects, leads, customers) {
  const max = prospects;
  const rows = 6;
  chart.innerHTML = "";

  for (let index = 1; index <= rows; index++) {
    const factor = index / rows;
    const rowProspects = prospects * factor;
    const rowLeads = leads * factor;
    const rowCustomers = customers * factor;

    const row = document.createElement("div");
    row.className = "row";

    const label = document.createElement("span");
    label.className = "month";
    label.textContent = index;

    const stack = document.createElement("div");
    stack.className = "stack";

    const prospectBar = document.createElement("div");
    prospectBar.className = "bar prospects";
    prospectBar.style.width = `${(rowProspects / max) * 100}%`;

    const leadBar = document.createElement("div");
    leadBar.className = "bar leads";
    leadBar.style.width = `${(rowLeads / max) * 100}%`;

    const customerBar = document.createElement("div");
    customerBar.className = "bar customers";
    customerBar.style.width = `${(rowCustomers / max) * 100}%`;

    stack.append(prospectBar, leadBar, customerBar);
    row.append(label, stack);
    chart.append(row);
  }

  const axis = document.createElement("div");
  axis.className = "x-axis";
  const values = [0, 20, 40, 60, 80, 100, 120];

  values.forEach((value) => {
    const point = document.createElement("span");
    point.textContent = `${value} people`;
    axis.append(point);
  });

  chart.append(axis);
}

function updateCurrency() {
  const symbol = currencySelect.value;
  document.getElementById("revenueCurrency").textContent = symbol;
  document.getElementById("orderCurrency").textContent = symbol;
}

[
  revenueInput,
  avgOrderInput,
  leadRateInput,
  prospectRateInput
].forEach((element) => element.addEventListener("input", calculate));

currencySelect.addEventListener("change", updateCurrency);

updateCurrency();
calculate();
