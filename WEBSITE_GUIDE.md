# Barclays Bank India Demo — Website Guide

## What this website is

This project is a responsive, front-end banking dashboard styled as an India-focused Barclays Bank demo. It uses Indian rupees (INR), sample Indian account details, and UPI, IMPS, NEFT, and RTGS choices in its payment form.

It is a visual and interaction prototype. It does not connect to Barclays or another bank, authenticate a customer, access real accounts, or send payments. All names, balances, and transactions shown are example data.

## Opening the website

The project uses plain HTML, CSS, and JavaScript, so it needs no build step or package installation.

1. Open `index.html` in a browser, or start a local server from this project folder:

   ```sh
   python3 -m http.server 8000
   ```

2. Visit `http://localhost:8000`.

If port 8000 is already in use, choose another port, such as `8001`, and visit that port instead. The Google Fonts stylesheet uses an internet connection; the page falls back to system sans-serif fonts if those fonts cannot load.

### Deploying on Render

`render.yaml` configures this as a static site with no build step and the repository root (`.`) as its publish directory. If the existing Render service was created with manual settings, set its **Publish Directory** to `.` in the Render dashboard (or create/sync it as a Blueprint from this repository) so Render stops looking for a generated `build` folder.

## Page layout

### Navigation sidebar

- **Overview** returns to the dashboard top.
- **Transactions** scrolls to recent activity.
- **Cards** opens a sample card-controls view.
- **UPI & payments** opens the send-money form.
- **Insights** jumps to the spending overview.
- **Settings** opens sample profile preferences.
- On narrow screens, the sidebar collapses behind the menu button.

The sidebar profile and the profile avatar in the top bar both open sample profile details. The help link opens the configured demo support email address.

### Dashboard header

The header displays a greeting, the current date in the browser's Indian locale, a theme switch, notifications, and the profile shortcut.

- **Light/dark toggle:** switches the page palette. Dark mode is the default. The choice is saved in browser `localStorage` under `barclays-demo-theme` and is restored on a later visit in the same browser.
- **Notifications:** opens a sample empty/informational notifications view.

### Account summary

- **Total balance:** displays the combined sample balance. Its Hide/Show control masks or restores that total.
- **Income this month** and **Spent this month:** show example totals. Their three-dot buttons open informational summaries.
- The plotted line and mini-bars are decorative sample visualizations; they do not recalculate from transaction records.

### Accounts

Three example accounts are shown: a salary account, smart savings, and a holiday fund. Selecting an account opens a small details view. **All accounts** opens an account summary. **Add an account** explains that real account linking would need a secure bank-consent or account-aggregator connection; this demo does not collect bank credentials.

### Spending overview

The period selector supports **This month**, **Last month**, and **This week**. Changing it updates the displayed sample total and category amounts. The donut chart is illustrative and its segment proportions are fixed; it does not redraw to match the selected period.

### Recent transactions

- The search field searches sample merchant, category, account, date, status, and amount text.
- **Filter** toggles a pending-only view. Search and the pending filter can be combined.
- **See all** clears the search and status filter.
- Selecting a transaction opens its sample details.

The entries are hard-coded in `index.html`; they do not represent imported or live banking activity.

### Send money form

The **Send money** button and **UPI & payments** navigation item open the same form. It asks for a recipient, UPI ID or account details, payment method, source account, amount, and optional note. Browser form validation checks required fields and a positive amount. Submitting displays a review-style confirmation with the entered recipient, amount, and method.

The confirmation is only a local demo state. No transaction is created, stored, authorized, or sent. A real payment flow would need a bank/payment provider, secure authentication, transaction authorization, backend validation, and appropriate compliance controls.

## Visual design and responsive behavior

`styles.css` contains the original component layout, responsive breakpoints, and the dark blue dashboard theme inspired by the supplied reference. A light palette is defined for `html[data-theme="light"]`. The layout adapts at tablet and mobile widths, uses a collapsible sidebar on phones, and allows the transaction table to scroll horizontally on small screens. Reduced-motion preferences are respected by the base stylesheet.

## Project files

- `index.html` — page structure, visible labels, sample accounts and transactions, and the payment form.
- `styles.css` — layout, colors, responsive rules, dark theme, light theme, and control styling.
- `script.js` — theme persistence, dates, balance masking, searches, filters, modal views, and form interactions.
- `WEBSITE_GUIDE.md` — this product and implementation guide.

## Customizing the demo

- **Brand and profile text:** edit the relevant elements in `index.html`; update matching profile-dialog text in `script.js` if the customer name changes.
- **Account and transaction examples:** edit the account rows and transaction table in `index.html`. Keep each row's `data-search` attribute in sync with the text if you want its keywords searchable.
- **Theme colors:** adjust the dark styles near the end of `styles.css` and the `html[data-theme="light"]` rules for the light palette.
- **Payment options:** edit the payment method `<select>` in `index.html`. Adding real transfers requires a backend integration; changing the options alone will not send payments.

## Current limitations

- No login, registration, server, database, real account data, card service, payment rail, or bank API is connected.
- Dashboard figures, spending categories, and chart graphics are sample/static values.
- Form data is not persisted. The theme choice is the only feature saved in browser storage.
- The demo should not be used to collect real customer credentials, bank-account information, or payment instructions.
