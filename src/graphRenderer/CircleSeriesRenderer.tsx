import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { PointSpline } from './PointSpline'
import { Blueprint } from './Blueprint'
import { degreesToRads } from '../utils/degreesToRads'
import { LCMPeriod } from '../utils/LCMPeriod'
import {
  CircleGear,
  CircleGearFrame,
  useCircleStore,
  useCircles,
} from '../store/useCircleStore'
import { useMemo } from 'react'

export const CircleSeriesRenderer = () => {
  const circles = useCircles()
  const angleDelta = useCircleStore((state) => state.angleDelta)
  const { addPoint, incrementDelta } = useCircleStore()

  // Calculate LCM period only when circles change
  const lcmPeriod = useMemo(() => {
    if (!circles || circles.length === 0) return 0
    const frequencies = circles.map((circle) => circle.speed)
    return LCMPeriod(frequencies) * 360 // Convert to degrees
  }, [circles])

  useFrame(() => {
    if (!circles || circles.length === 0) return

    const frameData = calculateFramePositions(circles, angleDelta)
    incrementDelta()

    if (frameData.length > 0) {
      const lastGear = frameData[frameData.length - 1]
      if (lastGear.endEffector && angleDelta - 10 < lcmPeriod) {
        addPoint(
          new THREE.Vector2(lastGear.endEffector[0], lastGear.endEffector[1])
        )
      }
    }
  })

  return (
    <>
      <Blueprint />
      <PointSpline />
    </>
  )
}

const calculateFramePositions = (
  circles: CircleGear[],
  delta: number
): CircleGearFrame[] => {
  const frameData: CircleGearFrame[] = []

  for (let i = 0; i < circles.length; i++) {
    const currentGear = circles[i]
    const parent = i > 0 ? frameData[i - 1] : null

    const currentOrigin = parent ? parent.endEffector : [0, 0, 0]

    const currentAngle =
      currentGear.startAngle +
      (currentGear.direction === 'acw' ? delta : -delta) * currentGear.speed

    const lineEnd = [
      currentOrigin[0] +
        (currentGear.direction === 'acw'
          ? Math.cos(degreesToRads(currentAngle))
          : -Math.cos(degreesToRads(currentAngle))) *
          currentGear.radius,
      currentOrigin[1] +
        (currentGear.direction === 'acw'
          ? Math.sin(degreesToRads(currentAngle))
          : -Math.sin(degreesToRads(currentAngle))) *
          currentGear.radius,
      0,
    ]

    frameData.push({
      ...currentGear,
      currentAngle,
      origin: currentOrigin,
      endEffector: lineEnd,
    })
  }

  return frameData
}
