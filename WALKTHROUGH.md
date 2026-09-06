# Five-Minute Walkthrough

Borrower Copilot starts with the minimum questions needed to avoid fake precision: income, income type, existing EMI, expenses, age, product, amount, tenure and credit score if known. It then asks adaptive tightening questions: income stability, variable income share, savings, recent bounces, collateral and quotes already received.

The model deliberately separates two numbers. "Lender may sanction" uses FOIR-style capacity, collateral/LTV and a risk haircut. "Safe amount" is borrower-first: it uses a stricter EMI room after household expenses, stability and emergency-savings haircuts. The borrower is told which number to use.

Every output has a one-sentence why. Missing credit score widens the band; it is not treated as a 300 score. Recent bounces and no savings matter because the goal is not approval theatre, it is whether the borrower can still breathe after signing.

The negotiation card is the product moment. It turns the assessment into branch language: ask for this amount, do not cross this EMI, fair rate is this band, all-in APR should include the processing fee. A borrower can hold that up to a lender and challenge a quote without sounding vague.

What I would build next: a smarter adaptive question engine that hides irrelevant questions in real time, a printable card, lender-offer comparison, explainable sensitivity sliders and regional/product-specific rule packs.

What I would cut: more product breadth. The app should be sharp for the included products and three borrower shapes before adding education loans, credit cards or BNPL. I would also avoid bureau integrations until the borrower-side rules are trusted and understandable.
