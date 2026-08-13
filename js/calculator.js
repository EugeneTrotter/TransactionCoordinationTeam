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
  var homePriceValueLabel = document.getElementById("homePriceValue");

  var avgHomePrice = parseFloat(homePriceInput.value) || 0;
  var annualClosings = parseFloat(closingsInput.value) || 0;
  var reinvestPct = parseFloat(reinvestInput.value) || 0;

  // Keep the reinvestment percentage inside a sane 0–100 range even
  // if someone types outside the bounds
  if (reinvestPct < 0) reinvestPct = 0;
  if (reinvestPct > 100) reinvestPct = 100;

  homePriceValueLabel.textContent = formatDollars(avgHomePrice);

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

  netEl.classList.remove("negative", "message");
  if (netIncrease < 0) {
    // Reframe rather than show a discouraging negative dollar figure
    netEl.textContent = "The Time Is Worth The Money";
    netEl.classList.add("message");
  } else {
    netEl.textContent = formatSignedDollars(netIncrease);
  }
  netEl.classList.add("positive");
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
