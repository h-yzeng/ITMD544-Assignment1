const billInput = document.getElementById("bill");
const customTipInput = document.getElementById("custom-tip");
const peopleInput = document.getElementById("people");
const tipButtons = document.querySelectorAll(".tip-btn");

const tipAmountEl = document.getElementById("tip-amount");
const totalEl = document.getElementById("total");
const perPersonEl = document.getElementById("per-person");

let selectedTip = 0;

// Handle preset tip button clicks
tipButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tipButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedTip = parseInt(btn.dataset.tip);
    customTipInput.value = "";
    calculate();
  });
});

// Handle custom tip input
customTipInput.addEventListener("input", () => {
  tipButtons.forEach((b) => b.classList.remove("active"));
  selectedTip = parseFloat(customTipInput.value) || 0;
  calculate();
});

// Recalculate when bill or people changes
billInput.addEventListener("input", calculate);
peopleInput.addEventListener("input", calculate);

function calculate() {
  const bill = parseFloat(billInput.value) || 0;
  const people = parseInt(peopleInput.value) || 1;

  const tip = bill * (selectedTip / 100);
  const total = bill + tip;
  const perPerson = total / people;

  tipAmountEl.textContent = "$" + tip.toFixed(2);
  totalEl.textContent = "$" + total.toFixed(2);
  perPersonEl.textContent = "$" + perPerson.toFixed(2);
}

// Reset everything
document.getElementById("reset-btn").addEventListener("click", () => {
  billInput.value = "";
  customTipInput.value = "";
  peopleInput.value = "1";
  tipButtons.forEach((b) => b.classList.remove("active"));
  selectedTip = 0;
  tipAmountEl.textContent = "$0.00";
  totalEl.textContent = "$0.00";
  perPersonEl.textContent = "$0.00";
});
