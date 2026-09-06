const PRODUCTS = {
  personal: {
    label: "Personal loan",
    baseRate: [12.5, 19.5],
    tenureCap: 60,
    ltv: 1,
    processingFee: 0.025,
    unsecured: true,
    productive: false
  },
  business: {
    label: "Business loan",
    baseRate: [13.5, 22],
    tenureCap: 60,
    ltv: 0.7,
    processingFee: 0.03,
    unsecured: false,
    productive: true
  },
  twoWheeler: {
    label: "Two-wheeler loan",
    baseRate: [10.5, 17],
    tenureCap: 48,
    ltv: 0.85,
    processingFee: 0.02,
    unsecured: false,
    productive: true
  },
  gold: {
    label: "Gold loan",
    baseRate: [9.5, 16],
    tenureCap: 24,
    ltv: 0.75,
    processingFee: 0.012,
    unsecured: false,
    productive: false
  },
  lap: {
    label: "Loan against property",
    baseRate: [10.5, 15.5],
    tenureCap: 180,
    ltv: 0.55,
    processingFee: 0.015,
    unsecured: false,
    productive: true
  },
  home: {
    label: "Home loan",
    baseRate: [8.5, 11.5],
    tenureCap: 240,
    ltv: 0.8,
    processingFee: 0.01,
    unsecured: false,
    productive: false
  }
};

const DEMOS = {
  priya: {
    name: "Priya",
    age: 29,
    cityTier: "metro",
    employment: "salaried",
    income: 110000,
    otherIncome: 0,
    stability: "stable",
    variableShare: "low",
    existingEmi: 14000,
    expenses: 28000,
    savings: "some",
    creditScore: 780,
    bounces: "none",
    purpose: "personal",
    amountWanted: 800000,
    tenure: 36,
    collateral: 0,
    quotedRate: ""
  },
  ravi: {
    name: "Ravi",
    age: 42,
    cityTier: "tier2",
    employment: "self",
    income: 58000,
    otherIncome: 18000,
    stability: "mixed",
    variableShare: "medium",
    existingEmi: 0,
    expenses: 26000,
    savings: "unknown",
    creditScore: "",
    bounces: "none",
    purpose: "business",
    amountWanted: 1500000,
    tenure: 60,
    collateral: 4500000,
    quotedRate: ""
  },
  anita: {
    name: "Anita",
    age: 35,
    cityTier: "tier2",
    employment: "informal",
    income: 30000,
    otherIncome: 0,
    stability: "volatile",
    variableShare: "high",
    existingEmi: 35000,
    expenses: 22000,
    savings: "none",
    creditScore: "",
    bounces: "recent",
    purpose: "twoWheeler",
    amountWanted: 150000,
    tenure: 36,
    collateral: 150000,
    quotedRate: 30
  }
};

function money(value) {
  const rounded = Math.max(0, Math.round(value / 500) * 500);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(rounded);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function emiFor(principal, annualRate, months) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return principal * r * factor / (factor - 1);
}

function principalFor(emi, annualRate, months) {
  if (emi <= 0 || months <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return emi * months;
  const factor = Math.pow(1 + r, months);
  return emi * (factor - 1) / (r * factor);
}

function aprFromFee(principal, annualRate, months, feePct) {
  if (principal <= 0) return annualRate;
  const emi = emiFor(principal, annualRate, months);
  const net = principal * (1 - feePct);
  let low = 0;
  let high = 0.08;
  for (let i = 0; i < 70; i += 1) {
    const mid = (low + high) / 2;
    let pv = 0;
    for (let m = 1; m <= months; m += 1) pv += emi / Math.pow(1 + mid, m);
    if (pv > net) low = mid;
    else high = mid;
  }
  return (Math.pow(1 + (low + high) / 2, 12) - 1) * 100;
}

function scoreProfile(input) {
  const unknownScore = !input.creditScore;
  const score = unknownScore ? null : Number(input.creditScore);
  let risk = 0;
  const reasons = [];

  if (unknownScore) {
    risk += 1.3;
    reasons.push("credit score is unknown, so the range stays wider");
  } else if (score >= 760) {
    risk -= 1;
    reasons.push("strong credit score supports the lower end of the rate band");
  } else if (score >= 700) {
    risk += 0;
  } else if (score >= 650) {
    risk += 1.2;
    reasons.push("mid credit score raises rate and sanction risk");
  } else {
    risk += 2.5;
    reasons.push("low credit score makes unsecured borrowing risky");
  }

  if (input.employment === "self") risk += 0.8;
  if (input.employment === "informal") risk += 1.8;
  if (input.stability === "mixed") risk += 0.8;
  if (input.stability === "volatile") risk += 2;
  if (input.variableShare === "medium") risk += 0.4;
  if (input.variableShare === "high") risk += 1;
  if (input.bounces === "minor") risk += 1;
  if (input.bounces === "recent") risk += 2.7;
  if (input.savings === "none") risk += 1.3;
  if (input.savings === "good") risk -= 0.5;

  return { risk: clamp(risk, -1.5, 8), reasons, unknownScore };
}

function rateBandFor(input, product, risk) {
  const cityBump = input.cityTier === "metro" ? 0 : input.cityTier === "tier2" ? 0.4 : 0.8;
  const low = product.baseRate[0] + risk * 0.65 + cityBump;
  const high = product.baseRate[1] + risk * 0.9 + cityBump;
  const width = risk > 3 ? 2.8 : risk > 1.5 ? 1.8 : 1.1;
  return [clamp(low, 7, 42), clamp(Math.max(high, low + width), 8, 48)];
}

function assess(input) {
  const product = PRODUCTS[input.purpose];
  const profile = scoreProfile(input);
  const tenure = Math.min(Number(input.tenure), product.tenureCap);
  const income = Number(input.income) || 0;
  const householdIncome = income + (Number(input.otherIncome) || 0) * 0.75;
  const existingEmi = Number(input.existingEmi) || 0;
  const expenses = Number(input.expenses) || 0;
  const wanted = Number(input.amountWanted) || 0;
  const collateral = Number(input.collateral) || 0;
  const foirCap = input.employment === "salaried" ? 0.5 : input.employment === "self" ? 0.45 : 0.35;
  const expenseCap = Math.max(0, householdIncome - expenses);
  const householdRepaymentLimit = householdIncome <= 25000 ? 0.4 : foirCap;
  const totalDebtCeiling = householdIncome * householdRepaymentLimit;
  const rawEmiRoom = Math.min(totalDebtCeiling - existingEmi, expenseCap * 0.72);
  const emergencyHaircut = input.savings === "none" ? 0.68 : input.savings === "unknown" ? 0.82 : input.savings === "some" ? 0.94 : 1;
  const stabilityHaircut = input.stability === "volatile" ? 0.62 : input.stability === "mixed" ? 0.84 : 1;
  const safeEmi = Math.max(0, rawEmiRoom * emergencyHaircut * stabilityHaircut);

  const band = rateBandFor(input, product, profile.risk);
  const borrowerRate = band[1];
  const lenderRate = (band[0] + band[1]) / 2 + profile.risk * 0.25;
  const borrowerCapacity = principalFor(safeEmi, borrowerRate, tenure);
  const lenderFoir = principalFor(Math.max(0, totalDebtCeiling - existingEmi), lenderRate, tenure);
  const collateralCap = product.unsecured ? wanted * 1.05 : collateral > 0 ? collateral * product.ltv : wanted * product.ltv;
  const riskHaircut = clamp(1 - profile.risk * 0.055, 0.48, 1.08);
  const lenderBase = Math.min(wanted, lenderFoir, collateralCap);
  const lenderLikely = Math.min(wanted, lenderBase * riskHaircut);
  const safeAmount = Math.min(wanted, borrowerCapacity, product.unsecured ? wanted : collateralCap);
  const currentEmiAtWanted = emiFor(wanted, borrowerRate, tenure);
  const safeRounded = Math.round(safeAmount / 5000) * 5000;
  const lenderRounded = Math.round(lenderLikely / 5000) * 5000;
  const aprLow = aprFromFee(Math.max(10000, Math.min(wanted, Math.max(safeRounded, 10000))), band[0], tenure, product.processingFee);
  const aprHigh = aprFromFee(Math.max(10000, Math.min(wanted, Math.max(safeRounded, 10000))), band[1], tenure, product.processingFee);

  const redFlags = [];
  if (existingEmi >= totalDebtCeiling) redFlags.push("existing EMIs already exceed the household repayment ceiling");
  if (input.bounces === "recent") redFlags.push("a recent bounce makes new borrowing dangerous");
  if (safeEmi <= 1000) redFlags.push("there is almost no safe EMI room after expenses and existing loans");
  if (!product.productive && input.employment === "informal" && input.savings === "none") redFlags.push("non-productive borrowing with no savings buffer is fragile");

  let verdict = "Borrow less";
  if (redFlags.length >= 2 || safeAmount < wanted * 0.25) verdict = "Don't borrow";
  else if (safeAmount >= wanted * 0.85 && profile.risk < 3.2) verdict = "Borrow";

  const confidenceAnswers = [
    input.income,
    input.employment,
    input.otherIncome !== "",
    input.existingEmi !== "",
    input.expenses,
    input.purpose,
    input.amountWanted,
    input.tenure,
    input.stability,
    input.creditScore,
    input.savings,
    input.bounces,
    product.unsecured || collateral > 0
  ].filter(Boolean).length;
  const confidence = confidenceAnswers >= 11 && !profile.unknownScore ? "High" : confidenceAnswers >= 9 ? "Medium" : "Low";

  const reasonBits = profile.reasons.slice(0, 2);
  if (redFlags[0]) reasonBits.unshift(redFlags[0]);
  if (!reasonBits.length) reasonBits.push("income, debt load and product risk are within the documented guardrails");

  const stressIncome = householdIncome * 0.8;
  const stressCeiling = Math.max(0, Math.min(stressIncome * householdRepaymentLimit - existingEmi, (stressIncome - expenses) * 0.72) * emergencyHaircut * stabilityHaircut);
  const stressRate = borrowerRate + 2;
  const stressAmount = principalFor(stressCeiling, stressRate, tenure);

  const rows = [12, 24, 36, 48, 60, 84, 120, 180]
    .filter((m) => m <= product.tenureCap)
    .map((m) => ({
      months: m,
      safe: principalFor(safeEmi, borrowerRate, m),
      emiWanted: emiFor(Math.min(wanted, Math.max(1, safeAmount)), borrowerRate, m)
    }));

  return {
    product,
    tenure,
    verdict,
    confidence,
    band,
    apr: [aprLow, aprHigh],
    emiCeiling: safeEmi,
    safeAmount: safeRounded,
    lenderLikely: lenderRounded,
    rows,
    explanations: {
      verdict: reasonBits.join("; ") + ".",
      lender: `Likely sanction is capped by ${product.unsecured ? "FOIR and unsecured-risk haircuts" : "FOIR, collateral/LTV and risk haircuts"}.`,
      safe: `Safe amount uses the lower of requested amount, collateral cap and an EMI room of ${money(safeEmi)}.`,
      rate: `${product.label} starts from a market-style base band, then adjusts for score, income stability, employment and recent repayment behaviour.`,
      apr: `APR includes the assumed processing fee of ${(product.processingFee * 100).toFixed(1)}%, so it is higher than the quoted interest rate.`,
      emi: `Monthly ceiling keeps total household loan repayments near ${Math.round(householdRepaymentLimit * 100)}% of income and preserves expense buffer.`
    },
    stress: {
      amount: stressAmount,
      ceiling: stressCeiling,
      rate: stressRate
    },
    quotedRate: Number(input.quotedRate) || null,
    currentEmiAtWanted
  };
}
