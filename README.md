# Borrower Copilot

Borrower Copilot is a web app that helps Indian borrowers understand a loan before accepting it.
It estimates what a lender may sanction, what the borrower can safely carry, and what rate range is fair.
The app turns borrower inputs into clear outputs, stress checks, and a negotiation card.
It is designed as a practical borrower-side tool, not a credit bureau or lender underwriting model.

It answers:

- Should I borrow at all?
- How much might a lender sanction?
- How much can I safely carry?
- What is a fair interest-rate and all-in APR band?
- What EMI/outflow ceiling should I negotiate around?

## Run locally

Open `index.html` in a browser. No backend is required.

If your browser blocks local scripts, run a tiny static server from this directory:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Files

- `index.html` - app shell and borrower questions.
- `styles.css` - responsive product UI.
- `rules.js` - all lending rules, thresholds, formulas and demo borrowers.
- `app.js` - form handling and rendering.
- `RULES.md` - rule table with value, why, source or judgement.
- `RUN_THROUGHS.md` - Priya, Ravi and Anita run-throughs.
- `WALKTHROUGH.md` - five-minute written walkthrough.

## Privacy

The app runs in the browser, stores nothing, and does not call a bureau, API or server.
