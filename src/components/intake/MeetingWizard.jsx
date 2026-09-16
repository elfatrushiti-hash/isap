import { ArrowLeft, ArrowRight, LoaderCircle, Sparkles } from 'lucide-react'
import useMeetingWizard from '../../hooks/useMeetingWizard.js'
import MeetingSourceStep from './MeetingSourceStep.jsx'
import CompanyStep from './CompanyStep.jsx'
import ContactStep from './ContactStep.jsx'
import GoalStep from './GoalStep.jsx'
import ReviewStep from './ReviewStep.jsx'
import WizardStepper from './WizardStepper.jsx'

export default function MeetingWizard({ onCancel, onFinish }) {
  const wizard = useMeetingWizard()
  const { currentStep, form, error, submitting, isStepValid, next, back, update, updateContact, updateNewCompany, setSubmitting, setError } = wizard

  const steps = [
    <MeetingSourceStep key="source" form={form} update={update}/>,
    <CompanyStep key="company" form={form} update={update} updateNewCompany={updateNewCompany}/>,
    <ContactStep key="contact" contact={form.contact} updateContact={updateContact}/>,
    <GoalStep key="goal" form={form} update={update}/>,
    <ReviewStep key="review" form={form}/>
  ]

  const finish = async () => {
    try {
      setSubmitting(true)
      setError('')
      await onFinish(form)
    } catch (finishError) {
      setError(finishError?.message || 'Meeting could not be created. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="meeting-wizard">
      <div className="wizard-topline"><span>Step {currentStep + 1} of 5</span><span>{Math.round(((currentStep + 1) / 5) * 100)}%</span></div>
      <div className="wizard-progress"><span style={{ width: `${((currentStep + 1) / 5) * 100}%` }}/></div>
      <WizardStepper currentStep={currentStep}/>
      {steps[currentStep]}
      {error && <div className="wizard-error" role="alert">{error}</div>}
      <footer className="wizard-actions">
        <button type="button" className="ghost" onClick={currentStep === 0 ? onCancel : back} disabled={submitting}><ArrowLeft size={17}/>{currentStep === 0 ? 'Cancel' : 'Back'}</button>
        {currentStep < 4 ? (
          <button type="button" onClick={next} disabled={!isStepValid}><span>Next</span><ArrowRight size={17}/></button>
        ) : (
          <button type="button" className="start-intelligence" onClick={finish} disabled={submitting}>
            {submitting ? <LoaderCircle className="spin" size={18}/> : <Sparkles size={18}/>} {submitting ? 'Creating meeting...' : 'Start Intelligence'}
          </button>
        )}
      </footer>
    </div>
  )
}
