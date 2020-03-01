import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'

import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import { config } from './store'

import Root from './screens/Root'
import './styles.css'
import Layout from 'components/Layout'

const overmind = createOvermind(config)

const render = () => {
  ReactDOM.render(
    <Provider value={overmind}>
      <Layout>
        <Root />
      </Layout>
    </Provider>,
    document.getElementById('root')
  )
}

render()

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./screens/Root', render)
}

// TODO: Enable service worker
serviceWorker.unregister()
