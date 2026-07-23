export const companyIntelligenceProfiles = {
  'migros-bank': {
    companyId: 'migros-bank',
    executiveBrief: 'Migros Bank verbindet eine starke Schweizer Privatkundenposition mit einer konsequenten Digitalisierungsagenda. Fuer das Gespraech sind digitales Onboarding, regulatorische Effizienz und eine reibungslose Customer Experience besonders relevant. Intrum kann mit Credit Information, Digital Identity und Compliance Services konkrete Prozess- und Risikopotenziale adressieren.',
    management: [
      { name: 'Executive Management', role: 'Strategische Steuerung', relevance: 'Executive Sponsor und Priorisierung' },
      { name: 'Risk & Compliance', role: 'Regulatorik und Governance', relevance: 'KYC, AML und Auditierbarkeit' },
      { name: 'Digital Banking', role: 'Customer Journey', relevance: 'Onboarding und Prozessautomatisierung' }
    ],
    financials: [
      { label: 'Revenue', value: 'CHF 730 Mio.', note: 'Referenzwert aus dem ISAP Demo-Datensatz' },
      { label: 'Employees', value: "ca. 1'900", note: 'Unternehmensgroesse' },
      { label: 'Market', value: 'Switzerland', note: 'Fokus Privat- und Firmenkunden' }
    ],
    strategicInitiatives: ['Digital Banking ausbauen', 'Onboarding automatisieren', 'Compliance-Aufwand reduzieren', 'Customer Experience verbessern'],
    swot: {
      strengths: ['Starke Schweizer Marke', 'Breite Kundenbasis', 'Hohe Vertrauensposition'],
      weaknesses: ['Regulatorisch komplexe Prozesse', 'Potenzielle Medienbrueche im Onboarding'],
      opportunities: ['Digitale Identifikation', 'Automatisierte Risikopruefung', 'Datenbasierte Kreditentscheidungen'],
      threats: ['Steigende Compliance-Kosten', 'Digitale Wettbewerber', 'Wachsende Betrugsrisiken']
    },
    news: [
      { date: '2026', title: 'Digitalisierung bleibt strategischer Fokus', category: 'Strategy', summary: 'ISAP Demo-Signal fuer Investitionen in digitale Kundenprozesse.' },
      { date: '2026', title: 'Effizienz und regulatorische Sicherheit', category: 'Operations', summary: 'Relevanz fuer KYC, Compliance und automatisierte Entscheidungsprozesse.' }
    ],
    discoveryQuestions: [
      'Wo entstehen im heutigen Onboarding die groessten Medienbrueche?',
      'Welche regulatorischen Pruefungen verursachen den hoechsten manuellen Aufwand?',
      'Welche Kennzahl soll sich durch eine neue Loesung messbar verbessern?',
      'Welche Stakeholder muessen fuer einen Pilot eingebunden werden?'
    ],
    intrumFit: [
      { solution: 'Digital Identity', score: 94, reason: 'Direkter Fit zu digitalem Onboarding und KYC.' },
      { solution: 'Credit Information', score: 89, reason: 'Unterstuetzt schnelle und belastbare Kreditentscheidungen.' },
      { solution: 'Compliance Services', score: 86, reason: 'Reduziert operative Belastung und verbessert Nachvollziehbarkeit.' }
    ],
    timeline: [
      { year: '2026', title: 'Digital Banking Prioritaet', detail: 'Automatisierung und Kundenerlebnis im Fokus.' },
      { year: '2026', title: 'ISAP Meeting', detail: 'Discovery zu Onboarding, KYC und Compliance.' }
    ]
  },
  swisscom: {
    companyId: 'swisscom',
    executiveBrief: 'Swisscom verfuegt ueber hohe Kundenvolumen und komplexe Kommunikations- und Zahlungsprozesse. Der groesste Fit fuer Intrum liegt in einer kundenorientierten Optimierung des Forderungsmanagements, in digitaler Kontaktsteuerung und in der Vermeidung unnoetiger Kundenverluste. Das Gespraech sollte auf Retention, Automatisierung und messbare Pilotresultate ausgerichtet werden.',
    management: [
      { name: 'Finance Leadership', role: 'Cashflow und Effizienz', relevance: 'Business Case und Ergebnisverantwortung' },
      { name: 'Customer Experience', role: 'Kundenkommunikation', relevance: 'Retention und Journey Design' },
      { name: 'Operations', role: 'Prozesssteuerung', relevance: 'Pilotumfang und Integration' }
    ],
    financials: [
      { label: 'Revenue', value: 'CHF 11 Mrd.', note: 'Referenzwert aus dem ISAP Demo-Datensatz' },
      { label: 'Employees', value: "ca. 19'000", note: 'Unternehmensgroesse' },
      { label: 'Market', value: 'Switzerland', note: 'Telekommunikation und ICT' }
    ],
    strategicInitiatives: ['Digital Customer Journey', 'Automatisierung', 'Customer Retention', 'Kosten- und Prozesseffizienz'],
    swot: {
      strengths: ['Hohe Markenbekanntheit', 'Grosse Kundenbasis', 'Breite digitale Touchpoints'],
      weaknesses: ['Komplexe Legacy-Prozesse', 'Hohe Prozessvolumen'],
      opportunities: ['Personalisierte Payment Journey', 'Fruehintervention', 'Automatisierte Kundenansprache'],
      threats: ['Churn', 'Preisdruck', 'Negative Kundenerlebnisse im Mahnprozess']
    },
    news: [
      { date: '2026', title: 'Customer Experience und Automatisierung', category: 'Strategy', summary: 'ISAP Demo-Signal fuer digitale und effiziente Kundenprozesse.' },
      { date: '2026', title: 'Retention-orientiertes Forderungsmanagement', category: 'Opportunity', summary: 'Moeglicher Pilot fuer segmentierte Kommunikation und Self-Service.' }
    ],
    discoveryQuestions: [
      'Wo verlieren Sie heute im Mahnprozess am meisten Zeit oder Kunden?',
      'Wie differenzieren Sie Kommunikation nach Kundensegment und Risiko?',
      'Welche Pilotgruppe bietet ein messbares und kontrollierbares Volumen?',
      'Wie bewerten Sie heute den Zusammenhang zwischen Collections und Churn?'
    ],
    intrumFit: [
      { solution: 'ReConnect', score: 95, reason: 'Verbindet Forderungsmanagement mit Kundenbindung.' },
      { solution: 'PreConnect', score: 91, reason: 'Erlaubt fruehe, praeventive und digitale Kontaktaufnahme.' },
      { solution: 'Payment Journey', score: 88, reason: 'Verbessert Self-Service und Zahlungserlebnis.' }
    ],
    timeline: [
      { year: '2026', title: 'Automation Focus', detail: 'Effizienz und digitale Kundeninteraktion.' },
      { year: '2026', title: 'ISAP Workshop', detail: 'Pilot fuer Forderungsmanagement und Retention.' }
    ]
  },
  ubs: {
    companyId: 'ubs',
    executiveBrief: 'UBS benoetigt fuer Compliance-, KYC- und Identifikationsprozesse maximale Governance, Skalierbarkeit und Auditierbarkeit. Intrum sollte im Executive Meeting nicht produktorientiert starten, sondern den strategischen Nutzen, kontrollierte Implementierung und belastbare Risikoprozesse adressieren. Ein klar abgegrenzter Fachworkshop ist der empfohlene naechste Schritt.',
    management: [
      { name: 'Executive Sponsor', role: 'Strategische Verantwortung', relevance: 'Prioritaet und Governance' },
      { name: 'Compliance Leadership', role: 'Regulatorische Kontrolle', relevance: 'KYC, AML und Audit' },
      { name: 'Technology & Operations', role: 'Integration und Skalierung', relevance: 'Architektur und Prozessdesign' }
    ],
    financials: [
      { label: 'Revenue', value: 'USD 40+ Mrd.', note: 'Referenzwert aus dem ISAP Demo-Datensatz' },
      { label: 'Employees', value: "ca. 110'000", note: 'Globale Organisation' },
      { label: 'Market', value: 'Global', note: 'Banking und Wealth Management' }
    ],
    strategicInitiatives: ['Compliance Transformation', 'Risk Governance', 'Digital Identity', 'Operational Resilience'],
    swot: {
      strengths: ['Globale Skalierung', 'Hohe Fachkompetenz', 'Starke Governance'],
      weaknesses: ['Komplexe Systemlandschaft', 'Hoher Abstimmungsbedarf'],
      opportunities: ['Standardisierte Identifikation', 'Automatisierte Kontrollprozesse', 'Datenbasierte Risikoentscheidungen'],
      threats: ['Regulatorische Veraenderungen', 'Cyber- und Fraud-Risiken', 'Integrationskomplexitaet']
    },
    news: [
      { date: '2026', title: 'Governance und Integration', category: 'Risk', summary: 'ISAP Demo-Signal fuer kontrollierte Transformation und operative Resilienz.' },
      { date: '2026', title: 'Digital Identity', category: 'Technology', summary: 'Potenzial fuer skalierbare und auditierbare Identifikationsprozesse.' }
    ],
    discoveryQuestions: [
      'Welche regulatorischen Anforderungen verursachen aktuell den hoechsten Aufwand?',
      'Wo bestehen die groessten Unterschiede zwischen Regionen oder Business Units?',
      'Welche Governance-Kriterien muss ein Pilot zwingend erfuellen?',
      'Wie wird der Nutzen einer Prozessveraenderung auf Executive Level bewertet?'
    ],
    intrumFit: [
      { solution: 'Compliance Services', score: 96, reason: 'Sehr hoher Fit zu Governance und regulatorischer Effizienz.' },
      { solution: 'Digital Identity', score: 93, reason: 'Skalierbare und nachvollziehbare Identifikation.' },
      { solution: 'Credit Information', score: 84, reason: 'Ergaenzt Risiko- und Entscheidungsprozesse.' }
    ],
    timeline: [
      { year: '2026', title: 'Compliance Transformation', detail: 'Governance, Skalierung und Integration.' },
      { year: '2026', title: 'Executive Alignment', detail: 'Fachworkshop als empfohlener naechster Schritt.' }
    ]
  }
}

export const defaultCompanyIntelligence = {
  executiveBrief: 'Die Intelligence Pipeline ist abgeschlossen. Dieses Profil wurde aus den Meeting-Daten und dem allgemeinen Branchenmodell erzeugt. Fuer die naechste Ausbaustufe koennen externe Datenquellen ueber den Service Layer angebunden werden.',
  management: [
    { name: 'Executive Sponsor', role: 'Strategische Verantwortung', relevance: 'Priorisierung und Entscheid' },
    { name: 'Business Owner', role: 'Fachliche Verantwortung', relevance: 'Use Case und Business Value' },
    { name: 'Operations / IT', role: 'Umsetzung', relevance: 'Integration und Pilot' }
  ],
  financials: [
    { label: 'Revenue', value: 'Not loaded', note: 'Externe Datenquelle vorbereitet' },
    { label: 'Employees', value: 'Not loaded', note: 'Externe Datenquelle vorbereitet' },
    { label: 'Market', value: 'To be validated', note: 'Im Discovery Meeting bestaetigen' }
  ],
  strategicInitiatives: ['Digitalisierung', 'Effizienz', 'Customer Experience'],
  swot: {
    strengths: ['Etablierte Marktposition'],
    weaknesses: ['Informationsstand noch unvollstaendig'],
    opportunities: ['Automatisierung', 'Datenbasierte Entscheidungen'],
    threats: ['Wettbewerbsdruck', 'Steigende Prozesskosten']
  },
  news: [{ date: 'Pending', title: 'News Intelligence vorbereitet', category: 'Intelligence', summary: 'Die spaetere Web-Anbindung kann diesen Bereich automatisch befuellen.' }],
  discoveryQuestions: ['Welches Business-Ergebnis hat fuer Sie aktuell Prioritaet?', 'Wo entsteht heute der groesste manuelle Aufwand?', 'Wer ist am Entscheidungsprozess beteiligt?'],
  intrumFit: [{ solution: 'Discovery erforderlich', score: 65, reason: 'Fit wird anhand der Kundenprioritaeten weiter qualifiziert.' }],
  timeline: [{ year: 'Now', title: 'ISAP Intelligence', detail: 'Company Workspace wurde vorbereitet.' }]
}
