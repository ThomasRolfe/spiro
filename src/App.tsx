import { useState } from 'react'
import './App.css'
import {
  circleSeriesDefinition,
  CircleSeriesRenderCanvas,
} from './graphRenderer/CircleSeriesRenderCanvas'
import { Controls } from './controls/Controls'
// import { circles3 } from './presets/default'
import { FormProvider, useForm } from 'react-hook-form'
import { CircleSeriesGear } from './graphRenderer/CircleSeriesRenderer'
import { letterT } from './presets/default'

type CircleSeriesGearInput = {
  radius: string
  angle: string
  speed: string
  direction: string
}

type CircleSeriesDefinitionInput = {
  circleSeries: CircleSeriesGearInput[]
  renderSettings: {
    color: string
    showBlueprint: boolean
  }
}

const defaultControlForm = {
  graphs: [
    {
      circleSeries: [
        {
          radius: 1,
          angle: 0,
          speed: 1,
          direction: 'cw',
        },
        {
          radius: 0.5,
          angle: 0,
          speed: 2,
          direction: 'cw',
        },
        {
          radius: 0.3,
          angle: 0,
          speed: 3,
          direction: 'cw',
        },
      ],
      renderSettings: {
        color: '#09CACE',
        showBlueprint: false,
      },
    },
  ],
}

function App() {
  const [circleSeriesState, setCircleSeriesState] = useState()
  const methods = useForm({ defaultValues: defaultControlForm })
  const controlWatch = methods.watch()
  const values = methods.getValues()

  const preparedSeriesDefinitions = (
    circleSeriesDefinitions: CircleSeriesDefinitionInput[]
  ): circleSeriesDefinition[] => {
    return circleSeriesDefinitions.map((definition) => {
      return {
        ...definition,
        circleSeries: definition.circleSeries.map(
          (circleSeries, seriesIndex) => {
            return {
              radius: parseFloat(circleSeries.radius),
              speed: parseFloat(circleSeries.speed),
              angle: parseFloat(circleSeries.angle),
              direction: circleSeries.direction,
              index: seriesIndex,
              origin: [0, 0, 0],
              endEffector: [0, 0, 0],
            }
          }
        ),
      }
    })
  }

  return (
    <div id='page-container' className='dark'>
      <div id='controls-container' className='bg-slate-900 text-white'>
        <FormProvider {...methods}>
          <Controls
            circleSeriesState={circleSeriesState}
            setCircleSeriesState={setCircleSeriesState}
            generalState={null}
          />
        </FormProvider>
      </div>
      <div id='graph-container'>
        {controlWatch.graphs && (
          <CircleSeriesRenderCanvas
            circleSeriesDefinitions={preparedSeriesDefinitions(values.graphs)}
          />
        )}
      </div>
    </div>
  )
}

export default App
