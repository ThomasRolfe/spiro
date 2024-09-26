import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { create } from 'zustand'
import { Circle } from './Circle'
import { PointSpline } from './PointSpline'

export type CircleSeriesGear = {
  index: number
  parentIndex?: number
  radius: number
  angle: number
  direction: string
  speed: number
  origin: number[]
  endEffector: number[]
}

export interface CircleSeriesState {
  circles: CircleSeriesGear[]
  points: Array<THREE.Vector2>
  addPoint: (point: THREE.Vector2) => void
}

export const CircleSeriesRenderer = ({
  blueprint,
  color,
  circleSeries,
}: {
  blueprint: boolean
  color: string
  circleSeries: Array<CircleSeriesGear>
}) => {
  const useCircleStore = create<CircleSeriesState>()((set) => ({
    circles: [],
    points: [],
    addPoint: (point) =>
      set((state) => ({
        points: [...state.points, point],
      })),
  }))

  // Eventually this can be passed into circle renderer based on user input
  const circlesSeriesRef = useRef(circleSeries)
  const addPoint = useCircleStore.getState().addPoint
  const renderClock = new THREE.Clock()

  useEffect(() => {
    useCircleStore.setState({ circles: circleSeries })
  }, [useCircleStore, circleSeries])

  useEffect(() => {
    return useCircleStore.subscribe(
      (state) => (circlesSeriesRef.current = state.circles)
    )
  }, [])

  useFrame(() => {
    const circlesFrame = calculateNextSeriesFrame(circlesSeriesRef.current)
    useCircleStore.setState({ circles: circlesFrame })

    // Fudge the annoying start time end effectors
    if (
      circlesFrame[circlesFrame.length - 1]?.endEffector &&
      renderClock.getElapsedTime() > 0.1
    ) {
      const nextEndEffector = circlesFrame[circlesFrame.length - 1].endEffector
      const nextPoint = new THREE.Vector2(
        nextEndEffector[0],
        nextEndEffector[1]
      )

      addPoint(nextPoint)
    }

    // Trim the start of long point arrays to avoid memory hog
    if (useCircleStore.getState().points.length > 5000) {
      useCircleStore.setState({
        points: useCircleStore.getState().points.toSpliced(0, 5),
      })
    }
  })

  return (
    <>
      {blueprint &&
        circleSeries.map((circle) => {
          return (
            <Circle store={useCircleStore} key={circle.index} {...circle} />
          )
        })}
      <PointSpline color={color} store={useCircleStore} />
    </>
  )
}

function degreesToRads(degrees: number): number {
  return degrees * (Math.PI / 180)
}

const calculateNextSeriesFrame = (circleSeries: CircleSeriesGear[]) => {
  const newSeries = []
  const fixedDelta = 0.05

  for (let i = 0; circleSeries.length > i; i++) {
    const currentCircle = circleSeries[i]
    const parent = currentCircle.parentIndex
      ? circleSeries[currentCircle.parentIndex]
      : null
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

    newSeries.push({
      ...currentCircle,
      angle: newAngle,
      origin: currentOrigin,
      endEffector: lineEnd,
    })
  }

  return newSeries
}
