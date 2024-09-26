import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { CircleSeriesState } from './CircleSeriesRenderer'
import { UseBoundStore, StoreApi } from 'zustand'

export const PointSpline = ({
  store,
  color,
}: {
  store: UseBoundStore<StoreApi<CircleSeriesState>>
  color: string
}) => {
  const lineRef = useRef()
  const colorRef = useRef<THREE.LineBasicMaterial>()
  const pointsRef = useRef(store.getState().points)

  useEffect(() => {
    store.subscribe((state) => (pointsRef.current = state.points))
  }, [])

  useFrame(() => {
    if (pointsRef.current && pointsRef.current.length) {
      const curve = new THREE.SplineCurve(pointsRef.current)
      lineRef?.current?.geometry?.setFromPoints(
        curve.getPoints(pointsRef.current.length * 2)
      )
    }
  })

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial ref={colorRef} color={color} />
    </line>
  )
}
