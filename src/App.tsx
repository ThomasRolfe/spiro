import './App.css'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { create } from 'zustand'

function degreesToRads(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// const useCircleStore = create((set) => ({
//   circles: {},
//   points: {},
//   addPoint: (x, y, z) =>
//     set((state) => ({
//       points: [...state.points, [x, y, z]],
//     })),
// }))

type CircleProps = {
  store: any
  index: number
  parentIndex?: number
  radius: number
  angle: number
  direction: 'cw' | 'acw'
  speed: number
  origin: Array<number>
  endEffector: Array<number>
}

const Circle = ({
  store,
  index,
  radius,
  angle,
  direction,
  speed,
  origin,
  endEffector,
}: CircleProps) => {
  const circleRef = useRef(store.getState().circles[index])
  const lineRef = useRef()
  const meshRef = useRef()

  useEffect(() => {
    console.log('useEffect')
    store.subscribe((state) => (circleRef.current = state.circles[index]))
  }, [])

  console.log('rendered circle', {
    radius,
    angle,
    direction,
    speed,
    origin,
    endEffector,
  })

  useFrame((state, delta) => {
    if (circleRef.current) {
      if (lineRef.current) {
        lineRef.current.geometry.setFromPoints([
          new THREE.Vector3(...circleRef.current.origin),
          new THREE.Vector3(...circleRef.current.endEffector),
        ])
        // console.log('circle origin', circleRef.current.origin)
        // console.log('lines new geometry', lineRef.current.geometry)
      }

      if (meshRef.current) {
        // console.log('setting mesh to', circleRef.current.origin)
        meshRef.current.position.set(...circleRef.current.origin)
      }
    }
  })

  return (
    <>
      {/* <mesh ref={meshRef} position={[0, 0, 0]} color="black">
        <ringGeometry args={[radius, radius + 0.01, 100]} />
        <lineBasicMaterial color="grey" />
      </mesh>
      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="teal" />
      </line> */}
    </>
  )
}

const PointSpline = ({ store, color }: { store: any; color: string }) => {
  console.log('rendering points spline')
  const lineRef = useRef()
  const colorRef = useRef()
  const pointsRef = useRef(store.getState().points)

  useEffect(() => {
    store.subscribe((state) => (pointsRef.current = state.points))
  }, [])

  useFrame((state, delta) => {
    // console.log('pointsRef', pointsRef.current)
    if (pointsRef.current && pointsRef.current.length) {
      // console.log(pointsRef.current.length)
      const curve = new THREE.SplineCurve(
        pointsRef.current.map((point) => {
          return new THREE.Vector2(point[0], point[1])
        })
      )
      lineRef.current.geometry.setFromPoints(
        curve.getPoints(pointsRef.current.length * 2)
      )
      // console.log(colorRef.current.color)
      // colorRef.current.color.setFromVector3(
      //   new THREE.Vector3(point[0], point[1], 0)
      // )
      // console.log(colorRef.current)
    }
  })

  // const hsl = `hsl(${1}, 100%, 50%)`

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial ref={colorRef} color={color} />
    </line>
  )
}

const CircleRenderer = ({
  color,
  circleSeries,
}: {
  color: string
  circleSeries: Array<object>
}) => {
  const useCircleStore = create((set) => ({
    circles: [],
    points: [],
    addPoint: (x, y, z) =>
      set((state) => ({
        points: [...state.points, [x, y, z]],
      })),
  }))

  // Eventually this can be passed into circle renderer based on user input
  const circlesSeriesRef = useRef(circleSeries)
  const addPoint = useCircleStore.getState().addPoint
  const renderClock = new THREE.Clock()

  useEffect(() => {
    useCircleStore.setState({ circles: circleSeries })
  }, [circleSeries])

  useEffect(() => {
    return useCircleStore.subscribe(
      (state) => (circlesSeriesRef.current = state.circles)
    )
  }, [])

  useFrame((state, delta) => {
    let circlesFrame = []

    const fixedDelta = 0.05

    for (let i = 0; circlesSeriesRef.current.length > i; i++) {
      const currentCircle = circlesSeriesRef.current[i]
      const parent = circlesSeriesRef.current[currentCircle.parentIndex]
      const currentOrigin = parent ? parent.endEffector : currentCircle.origin
      const newAngle =
        currentCircle.angle +
        (currentCircle.direction === 'cw' ? fixedDelta : -fixedDelta) *
          (currentCircle.speed * 50)

      const lineEnd = [
        currentOrigin[0] +
          (currentCircle.direction === 'cw'
            ? Math.cos(degreesToRads(newAngle))
            : -Math.cos(degreesToRads(newAngle))) *
            currentCircle.radius,
        currentOrigin[1] +
          (currentCircle.direction === 'cw'
            ? Math.sin(degreesToRads(newAngle))
            : -Math.sin(degreesToRads(newAngle))) *
            currentCircle.radius,
        0,
      ]

      circlesFrame.push({
        ...currentCircle,
        angle: newAngle,
        origin: currentOrigin,
        endEffector: lineEnd,
      })
    }

    useCircleStore.setState({ circles: circlesFrame })

    // Fudge the annoying start time end effectors
    if (
      circlesFrame[circlesFrame.length - 1]?.endEffector &&
      renderClock.getElapsedTime() > 0.1
    ) {
      addPoint(...circlesFrame[circlesFrame.length - 1].endEffector)
    }

    if (useCircleStore.getState().points.length > 15000) {
      useCircleStore.setState({
        points: useCircleStore.getState().points.toSpliced(0, 5),
      })
    }
  })

  console.log('rendering circle series', circleSeries)

  return (
    <>
      {circleSeries.map((circle) => {
        return <Circle store={useCircleStore} key={circle.index} {...circle} />
      })}
      <PointSpline color={color} store={useCircleStore} />
    </>
  )
}

function App() {
  // console.log('circle store', useCircleStore.getState().circles)

  const initCircles = [
    {
      index: 0,
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
    //   angle: 0,
    //   direction: 'cw',
    //   speed: 1,
    //   origin: [0, 0, 0],
    //   endEffector: [0, 0, 0],
    // },
    {
      index: 1,
      parentIndex: 0,
      radius: 1,
      angle: 90,
      direction: 'cw',
      speed: 1,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
    {
      index: 2,
      parentIndex: 1,
      radius: 1 / 6,
      angle: 230,
      direction: 'acw',
      speed: 5,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
    // {
    //   index: 3,
    //   parentIndex: 2,
    //   radius: 0.1,
    //   angle: 210,
    //   direction: 'cw',
    //   speed: 5.5,
    //   origin: [0, 0, 0],
    //   endEffector: [0, 0, 0],
    // },
    // {
    //   index: 5,
    //   parentIndex: 4,
    //   radius: 0.07,
    //   angle: 210,
    //   direction: 'acw',
    //   speed: 1,
    //   origin: [0, 0, 0],
    //   endEffector: [0, 0, 0],
    // },
    // {
    //   index: 6,
    //   parentIndex: 5,
    //   radius: 0.05,
    //   angle: 210,
    //   direction: 'cw',
    //   speed: 3,
    //   origin: [0, 0, 0],
    //   endEffector: [0, 0, 0],
    // },
  ]

  const circles2 = [
    {
      index: 0,
      radius: 1,
      angle: 0,
      direction: 'cw',
      speed: 1,
      origin: [2, 0, 0],
      endEffector: [0, 0, 0],
    },
    {
      index: 1,
      parentIndex: 0,
      radius: 1,
      angle: 90,
      direction: 'cw',
      speed: 1,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
    {
      index: 2,
      parentIndex: 1,
      radius: 1 / 20,
      angle: 230,
      direction: 'acw',
      speed: 8,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
  ]

  const circles3 = [
    {
      index: 0,
      radius: 1,
      angle: 0,
      direction: 'cw',
      speed: 1,
      origin: [-2, 0, 0],
      endEffector: [0, 0, 0],
    },
    {
      index: 1,
      parentIndex: 0,
      radius: 1,
      angle: 90,
      direction: 'cw',
      speed: 1,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
    {
      index: 2,
      parentIndex: 1,
      radius: 1 / 3,
      angle: 230,
      direction: 'acw',
      speed: 3,
      origin: [0, 0, 0],
      endEffector: [0, 0, 0],
    },
  ]

  return (
    <div id="canvas-container">
      <Canvas>
        <CircleRenderer color="brown" circleSeries={initCircles} />
        <CircleRenderer color="coral" circleSeries={circles2} />
        <CircleRenderer color="hotpink" circleSeries={circles3} />
      </Canvas>
    </div>
  )
}

export default App
