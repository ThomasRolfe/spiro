import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { create } from 'zustand'
import { PointSpline } from './PointSpline'
import { LCMPeriod } from '../utils/LCMPeriod'
import { Blueprint } from './Blueprint'
import { degreesToRads } from '../utils/degreesToRads'

const FIXED_DELTA = 2

export type CircleSeriesGear = {
  index: number
  // parentIndex?: number
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
  angleDelta: number
  addPoint: (point: THREE.Vector2) => void
  incrementDelta: () => void
  setNewProperties: (circleSeries: CircleSeriesGear[]) => void
}

export const CircleSeriesRenderer = ({
  showBlueprint,
  color,
  circleSeries,
}: {
  showBlueprint: boolean
  color: string
  circleSeries: Array<CircleSeriesGear>
}) => {
  // Lowest common multiple period. Smallest number of frames for pattern to repeat
  const lcmPeriod = LCMPeriod(circleSeries.map((circle) => circle.speed))
  const firstSeriesFrame = calculateNextSeriesFrame(circleSeries)
  const useCircleStore = create<CircleSeriesState>()((set) => ({
    circles: firstSeriesFrame,
    points: [],
    angleDelta: 0,
    addPoint: (point) =>
      set((state) => ({
        points: [...state.points, point],
      })),
    incrementDelta: () =>
      set((state) => ({
        angleDelta: state.angleDelta + FIXED_DELTA,
      })),
    setNewProperties: (circleSeries: CircleSeriesGear[]) => {
      set((state) => ({
        ...state,
        circles: circleSeries,
        points: [],
        angleDelta: 0,
      }))
    },
  }))

  useEffect(() => {
    const reset = useCircleStore.getState().setNewProperties
    circlesSeriesRef.current = firstSeriesFrame
    reset(firstSeriesFrame)
  }, [useCircleStore, firstSeriesFrame, circleSeries])

  // Eventually this can be passed into circle renderer based on user input
  const circlesSeriesRef = useRef(firstSeriesFrame)
  const angleDeltaRef = useRef(0)
  const addPoint = useCircleStore.getState().addPoint
  const incrementDelta = useCircleStore.getState().incrementDelta

  useEffect(() => {
    const unsubscribeCircleSeriesStore = useCircleStore.subscribe(
      (state) => (circlesSeriesRef.current = state.circles)
    )

    return () => {
      unsubscribeCircleSeriesStore()
    }
  }, [useCircleStore, firstSeriesFrame])

  useEffect(() => {
    return useCircleStore.subscribe(
      (state) => (angleDeltaRef.current = state.angleDelta)
    )
  }, [useCircleStore])

  useFrame(() => {
    const circlesFrame = calculateNextSeriesFrame(circlesSeriesRef.current)
    incrementDelta()
    useCircleStore.setState({ circles: circlesFrame })

    const nextEndEffector = circlesFrame[circlesFrame.length - 1].endEffector
    const nextPoint = new THREE.Vector2(nextEndEffector[0], nextEndEffector[1])

    // Slight buffer of 10 degrees
    const fullRotations = angleDeltaRef.current / 380
    // console.log({ fullRotations })

    // If lcm period > 50, assume it won't get there before the point length limit is hit
    if (lcmPeriod > 200 || fullRotations < lcmPeriod * 2) {
      addPoint(nextPoint)
    }

    // Trim the start of long point arrays to avoid memory hog
    if (useCircleStore.getState().points.length > 10000) {
      useCircleStore.setState({
        points: useCircleStore.getState().points.toSpliced(0, 5),
      })
    }
  })

  return (
    <>
      <Blueprint
        show={showBlueprint}
        circleStore={useCircleStore} // passing the series in twice effectively, needs changing
        circleSeries={circleSeries}
      />
      <PointSpline color={color} store={useCircleStore} />
    </>
  )
}

const calculateNextSeriesFrame = (circleSeries: CircleSeriesGear[]) => {
  const newSeries = []
  const fixedDelta = FIXED_DELTA

  for (let i = 0; circleSeries.length > i; i++) {
    const currentCircle = circleSeries[i]
    const parent: CircleSeriesGear | null =
      currentCircle.index !== 0 ? newSeries[currentCircle.index - 1] : null

    const currentOrigin: number[] = parent
      ? parent.endEffector
      : currentCircle.origin
    const newAngle =
      currentCircle.angle +
      (currentCircle.direction === 'acw' ? fixedDelta : -fixedDelta) *
        currentCircle.speed

    const lineEnd = [
      currentOrigin[0] +
        (currentCircle.direction === 'acw'
          ? Math.cos(degreesToRads(newAngle))
          : -Math.cos(degreesToRads(newAngle))) *
          currentCircle.radius,
      currentOrigin[1] +
        (currentCircle.direction === 'acw'
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
