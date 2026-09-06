# RULES

This app is not a credit model. It is a borrower-side self-assessment that converts stated inputs into ranges, warnings and a negotiation card.

| Rule | Value | Why | Source or judgement |
|---|---:|---|---|
| No bureau pull | User-entered score only; unknown is never converted to 300 | Missing data should widen confidence, not punish as a fake low score | Brief requirement and judgement |
| Household repayment ceiling | 35-50% of monthly income depending on employment/income | Keeps total debt obligations visible and prevents the app from endorsing stretched EMI | RBI microfinance directions cap household loan repayment obligations at 50% of monthly household income; judgement adapts lower caps for informal/volatile borrowers |
| Expense buffer | New EMI room cannot exceed 72% of income after household expenses | A borrower must still absorb food, rent, school, health and transport shocks | Judgement |
| Income stability haircut | Stable 100%, mixed 84%, volatile 62% | Variable income should reduce safe EMI even when average income appears adequate | Judgement |
| Emergency savings haircut | None 68%, unknown 82%, 1-3 months 94%, 3+ months 100% | No buffer turns the same EMI into materially higher borrower risk | Judgement |
| Recent bounce | Adds 2.7 risk points and can trigger "Don't borrow" | A recent failed payment is a live liquidity warning | Judgement |
| Credit score | 760+ improves pricing; 700-759 neutral; 650-699 worsens; below 650 high risk; unknown widens band | Simple borrower-readable score bands without pretending to be lender underwriting | Judgement |
| Product base rates | Home 8.5-11.5%, gold 9.5-16%, two-wheeler 10.5-17%, LAP 10.5-15.5%, personal 12.5-19.5%, business 13.5-22% | Gives realistic relative ordering: secured usually cheaper than unsecured; business/informal risk wider | Market-style judgement, documented assumption |
| Fair-rate adjustment | Base band plus risk, city and repayment behaviour adjustments | Produces a band, not a false point estimate | Judgement |
| APR | Effective annualized cost computed from EMI against net disbursal after processing fee | Borrower should compare all-in cost, not only nominal rate | RBI digital lending/KFS guidance requires upfront APR disclosure as all-inclusive cost |
| Processing fee assumptions | Home 1%, gold 1.2%, LAP 1.5%, two-wheeler 2%, personal 2.5%, business 3% | Converts rate to APR without requiring lender-specific fees | Judgement |
| Collateral/LTV caps | Gold 75%, two-wheeler 85%, LAP 55%, home 80%, business secured 70%; unsecured uses no collateral cap | Lender sanction and borrower safety differ, especially for secured products | Judgement |
| Lender likely sanction | Minimum of requested amount, FOIR capacity and collateral/LTV, then risk haircut | Separates what a lender may approve from what the borrower should carry | Judgement |
| Borrower safe amount | Minimum of requested amount, safe EMI capacity and collateral cap | The borrower should use the lower, safer number | Judgement |
| Verdict | "Borrow" if safe amount covers 85%+ of request and risk is moderate; "Borrow less" if partial capacity; "Don't borrow" for severe red flags or safe amount below 25% of request | Makes "Don't borrow" reachable and explainable | Brief requirement and judgement |
| Stress case | Recompute with 20% lower income and 2 percentage-point higher rate | Shows income/rate shock before signing | Judgement |
| Confidence | High with enough answers and known score; medium with most answers; low when missing key answers | Silence widens confidence and is disclosed | Brief requirement and judgement |

## Assumptions and limits

- The app does not know lender-specific policy, employer category, bank statement behaviour, geography-specific collection risk or bureau tradelines.
- It does not recommend illegal or usurious lending. A high quoted rate is surfaced as a negotiation warning, not accepted as fair.
- It treats productive borrowing more sympathetically only when income capacity and repayment behaviour are also acceptable.
- For low-income households, the RBI 50% household repayment cap is used as a hard outer guardrail; this app often uses lower internal caps for borrower safety.
