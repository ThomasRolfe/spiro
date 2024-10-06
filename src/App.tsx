import './App.css'
import { CircleSeriesRenderCanvas } from './CircleSeriesRenderCanvas'

function App() {
  const initCircles = [
    {
      index: 0,
      radius: 0.1,
      angle: 0,
      direction: 'cw' as const,
      speed: 0.3,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
    {
      index: 1,
      parentIndex: 0,
      radius: 1,
      angle: 0,
      direction: 'cw',
      speed: 1,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
    // {
    //   index: 1,
    //   parentIndex: 0,
    //   radius: 1,
    //   angle: 90,
    //   direction: 'cw',
    //   speed: 3 / 10,
    //   origin: [0, 0, 0],
    //   endEffector: [0, 0, 0],
    // },
    {
      index: 2,
      parentIndex: 1,
      radius: 0.8,
      angle: 230,
      direction: 'acw' as const,
      speed: 1,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
    // {
    //   index: 3,
    //   parentIndex: 2,
    //   radius: 0.1,
    //   angle: 210,
    //   direction: 'cw',
    //   speed: 2,
    //   origin: [0, 0, 0],
    //   endEffector: [0, 0, 0],
    // },
    // {
    //   index: 4,
    //   parentIndex: 3,
    //   radius: 0.07,
    //   angle: 210,
    //   direction: 'acw',
    //   speed: 1,
    //   origin: [0, 0, 0],
    //   endEffector: [0, 0, 0],
    // },
    {
      index: 3,
      parentIndex: 2,
      radius: 0.5,
      angle: 210,
      direction: 'acw' as const,
      speed: 1,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
  ]

  const circles2 = [
    {
      index: 0,
      radius: 1,
      angle: 0,
      direction: 'cw',
      speed: 1.3,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
    {
      index: 1,
      parentIndex: 0,
      radius: 1.3,
      angle: 90,
      direction: 'cw',
      speed: 9.9,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
    {
      index: 2,
      parentIndex: 1,
      radius: 0.56,
      angle: 230,
      direction: 'cw',
      speed: 9.7,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
    // {
    //   index: 3,
    //   parentIndex: 2,
    //   radius: 1.4,
    //   angle: 0,
    //   direction: 'cw',
    //   speed: 9.9,
    //   origin: [0, 0, 0],
    //   endEffector: [0, 0, 0],
    // },
  ]

  const circles3 = [
    {
      index: 0,
      radius: 1,
      angle: 0,
      direction: 'cw',
      speed: 1,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
    {
      index: 1,
      parentIndex: 0,
      radius: 1,
      angle: 90,
      direction: 'cw',
      speed: 2,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
    {
      index: 2,
      parentIndex: 1,
      radius: 0.5,
      angle: 230,
      direction: 'acw',
      speed: 1.2,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
  ]

  return <CircleSeriesRenderCanvas circleSeriesArray={[circles3]} />
}

export default App
