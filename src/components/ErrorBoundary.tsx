import React from 'react'

interface OwnState {
  hasError: false
}

export default class ErrorBoundary extends React.Component<{}, OwnState> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="m-auto font-semibold text-lg text-white">
          <h1>Something went wrong.</h1>
        </div>
      )
    }

    return this.props.children
  }
}
