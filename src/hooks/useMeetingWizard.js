import { useMemo, useState } from 'react'

const initialForm = {
  source: '',
  company: null,
  newCompany: { name: '', industry: '', city: '' },
  contact: { firstName: '', lastName: '', role: '', email: '', phone: '' },
  goal: null,
  notes: '',
  meetingDate: new Date().toISOString().slice(0, 10),
  meetingTime: '09:00'
}

export default function useMeetingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const update = (key, value) => {
    setError('')
    setForm((current) => ({ ...current, [key]: value }))
  }

  const updateContact = (key, value) => update('contact', { ...form.contact, [key]: value })
  const updateNewCompany = (key, value) => update('newCompany', { ...form.newCompany, [key]: value })

  const isStepValid = useMemo(() => {
    if (currentStep === 0) return Boolean(form.source && form.meetingDate && form.meetingTime)
    if (currentStep === 1) return Boolean(form.company || form.newCompany.name.trim())
    if (currentStep === 2) return Boolean(form.contact.firstName.trim() && form.contact.lastName.trim())
    if (currentStep === 3) return Boolean(form.goal)
    return true
  }, [currentStep, form])

  const next = () => {
    if (!isStepValid) {
      setError('Bitte fuelle die Pflichtfelder aus, bevor du fortfaehrst.')
      return
    }
    setError('')
    setCurrentStep((step) => Math.min(step + 1, 4))
  }

  const back = () => {
    setError('')
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  const reset = () => {
    setCurrentStep(0)
    setForm(initialForm)
    setSubmitting(false)
    setError('')
  }

  return {
    currentStep,
    form,
    submitting,
    error,
    isStepValid,
    update,
    updateContact,
    updateNewCompany,
    setSubmitting,
    setError,
    next,
    back,
    reset
  }
}
