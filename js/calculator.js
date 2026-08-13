// ============================================================
// TRANSACTION COORDINATION ROI CALCULATOR
// Locked assumptions live here as constants — edit these if your
// fee, commission rate, or time-saved figures ever change.
// ============================================================

var TC_FEE = 400; // dollars per closing
var COMMISSION_RATE = 0.03; // 3% of home sale price
var HOURS_SAVED_PER_CLOSING = 15;
var WORKING_WEEKS = 50;
var BASELINE_WEEKLY_HOURS = 40;

function formatDollars(amount) {
  var rounded = Math.round(amount);
  var sign = rounded < 0 ? "-" : "";
  var abs = Math.abs(rounded);
  return sign + "$" + abs.toLocaleString("en-US");
}

function formatSignedDollars(amount) {
  var rounded = Math.round(amount);
  var sign = rounded > 0 ? "+" : rounded < 0 ? "-" : "";
  var abs = Math.abs(rounded);
  return sign + "$" + abs.toLocaleString("en-US");
}

function runCalculator() {
  var homePriceInput = document.getElementById("homePrice");
  var closingsInput = document.getElementById("annualClosings");
  var reinvestInput = document.getElementById("reinvestPct");
  var reinvestValueLabel = document.getElementById("reinvestValue");

  var avgHomePrice = parseFloat(homePriceInput.value) || 0;
  var annualClosings = parseFloat(closingsInput.value) || 0;
  var reinvestPct = parseFloat(reinvestInput.value) || 0;

  reinvestValueLabel.textContent = reinvestPct + "%";

  // Commission per closing
  var commissionPerClosing = avgHomePrice * COMMISSION_RATE;

  // Current baseline earnings (before working with a TC)
  var currentAnnualGross = annualClosings * commissionPerClosing;

  // Time reclaimed by handing off transaction coordination
  var totalHoursReclaimed = annualClosings * HOURS_SAVED_PER_CLOSING;
  var reinvestedHours = totalHoursReclaimed * (reinvestPct / 100);
  var hoursActuallySaved = totalHoursReclaimed - reinvestedHours; // yearly figure

  // Reinvested time converts to additional closings at the agent's
  // current rate of production
  var currentClosingProductivity =
    annualClosings / (BASELINE_WEEKLY_HOURS * WORKING_WEEKS);
  var additionalClosings = reinvestedHours * currentClosingProductivity;
  var projectedAnnualClosings = annualClosings + additionalClosings;

  // TC fee applies to every closing in the projected total
  var totalTCCost = projectedAnnualClosings * TC_FEE;
  var projectedEarnings =
    projectedAnnualClosings * commissionPerClosing - totalTCCost;

  var netIncrease = projectedEarnings - currentAnnualGross;

  // ---- Render the 3 required outputs ----
  var earningsEl = document.getElementById("outProjectedEarnings");
  var hoursEl = document.getElementById("outYearlyHours");
  var netEl = document.getElementById("outNetIncrease");

  earningsEl.textContent = formatDollars(projectedEarnings);

  hoursEl.textContent = Math.round(hoursActuallySaved).toLocaleString("en-US") + " hrs";

  netEl.textContent = formatSignedDollars(netIncrease);
  netEl.classList.remove("positive", "negative");
  netEl.classList.add(netIncrease >= 0 ? "positive" : "negative");
}

document.addEventListener("DOMContentLoaded", function () {
  var calcForm = document.getElementById("roiCalculator");
  if (!calcForm) return;

  var inputs = calcForm.querySelectorAll("input");
  inputs.forEach(function (input) {
    input.addEventListener("input", runCalculator);
  });

  runCalculator();
});
