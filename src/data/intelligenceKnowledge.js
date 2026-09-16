export const defaultKnowledge = {
  dictionaries: [
    { id:'credit-information', label:'Credit Information', type:'topic', terms:['credit check','creditworthiness','bonitaet','bonitätsprüfung','scoring','credit risk'], products:['Credit Information'], weight:9 },
    { id:'collections', label:'Collections', type:'topic', terms:['collections','debt collection','overdue','arrears','receivables','dso'], products:['Collections'], weight:9 },
    { id:'fraud', label:'Fraud Prevention', type:'topic', terms:['fraud','identity fraud','fraud prevention','suspicious transaction'], products:['Fraud Prevention'], weight:10 },
    { id:'manual-process', label:'Manual process', type:'pain-point', terms:['manual','spreadsheet','excel','handarbeit','manuell'], products:[], weight:7 },
    { id:'onboarding', label:'Onboarding efficiency', type:'business-impact', terms:['onboarding','customer onboarding','application process'], products:['Credit Information'], weight:6 },
    { id:'cost-reduction', label:'Cost reduction', type:'buying-signal', terms:['cost reduction','reduce cost','efficiency','savings','kosten senken'], products:['Collections'], weight:6 }
  ],
  taxonomy: {
    nodes: [
      { id:'tax-credit', type:'product', label:'Credit Information', description:'Credit risk and decision support.' },
      { id:'tax-collections', type:'product', label:'Collections', description:'Receivables and collection services.' },
      { id:'tax-manual', type:'pain-point', label:'Manual processes', description:'Manual work, spreadsheets and fragmented workflows.' },
      { id:'tax-risk', type:'pain-point', label:'Credit risk', description:'Need to improve creditworthiness and risk decisions.' },
      { id:'tax-efficiency', type:'buying-signal', label:'Efficiency pressure', description:'Customer is actively looking for efficiency or cost improvements.' },
      { id:'tax-banking', type:'industry', label:'Banking', description:'Banks and financial institutions.' },
      { id:'tax-onboarding', type:'topic', label:'Customer onboarding', description:'Customer application and onboarding processes.' },
      { id:'tax-question-volume', type:'question', label:'How many checks are performed manually today?', description:'Discovery question for manual credit-check processes.' }
    ],
    links: [
      { id:'link-1', from:'tax-manual', to:'tax-credit', relation:'suggests' },
      { id:'link-2', from:'tax-risk', to:'tax-credit', relation:'suggests' },
      { id:'link-3', from:'tax-efficiency', to:'tax-collections', relation:'suggests' },
      { id:'link-4', from:'tax-onboarding', to:'tax-credit', relation:'relevant-for' },
      { id:'link-5', from:'tax-manual', to:'tax-question-volume', relation:'ask' }
    ]
  },
  settings: { explainability:true, minimumConfidence:45, externalAiEnabled:false, mode:'RULE' }
}
