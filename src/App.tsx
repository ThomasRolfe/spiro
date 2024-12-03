import './App.css'
import { CircleSeriesRenderCanvas } from './graphRenderer/CircleSeriesRenderCanvas'
import { Controls } from './controls/Controls'

function App() {
  return (
    <div id='page-container' className='dark'>
      <div id='controls-container' className='bg-slate-900 text-white'>
        <Controls />
      </div>
      <div id='graph-container'>
        <CircleSeriesRenderCanvas />
      </div>
    </div>
  )
}

export default App
