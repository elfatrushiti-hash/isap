# ISAP Package 2A - Delivery 3

Company Intelligence Service Layer and Company Workspace 2.0.

## Installation

Copy the included `src` folder into the root of the existing ISAP project from Delivery 2A.2. Merge folders and replace files when requested.

## Included

- `src/services/companyService.js`
- `src/data/companyIntelligence.js`
- complete `src/pages/CompanyIntelligence` workspace
- reusable company intelligence components
- Overview, Management, Financials, Strategy, News, Opportunities and AI Insights tabs
- Executive Brief, Company Health, SWOT, Intrum Fit and Discovery Questions
- safe fallback profiles for newly created companies

The package uses the existing `Company` navigation entry and the selected meeting from `IsapStore`.

## Administration Foundation

This delivery adds the Administration module to the existing ISAP application. It includes dedicated sections for Products, Assets, Presentations, Categories, AI Settings and Integrations, plus initial service boundaries for product and asset management.

## Delivery 1.2

Product Management is now active under Administration > Products. Product changes are stored in the browser's local storage for the current frontend-only implementation.
