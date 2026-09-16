import { Check } from 'lucide-react'

const steps = ['Source', 'Company', 'Contact', 'Goal', 'Review']

export default function WizardStepper({ currentStep }) {
  return (
    <div className="wizard-stepper" aria-label={`Step ${currentStep + 1} of ${steps.length}`}>
      {steps.map((step, index) => (
        <div key={step} className={`wizard-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'done' : ''}`}>
          <span className="wizard-step-dot">{index < currentStep ? <Check size={15}/> : index + 1}</span>
          <span>{step}</span>
        </div>
      ))}
    </div>
  )
}
