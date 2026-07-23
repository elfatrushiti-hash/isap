import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import './foundation.css'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ISAP view error', error, info)
  }

  reset = () => {
    this.setState({ hasError: false })
    this.props.onReset?.()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="foundation-error">
        <div className="foundation-error-card">
          <AlertTriangle size={34} />
          <span>ISAP Recovery</span>
          <h1>Diese Ansicht konnte nicht geladen werden.</h1>
          <p>ISAP hat den Fehler abgefangen. Du kannst sicher zum Dashboard zurueckkehren.</p>
          <button type="button" onClick={this.reset}><RotateCcw size={17}/> Zum Dashboard</button>
        </div>
      </div>
    )
  }
}
