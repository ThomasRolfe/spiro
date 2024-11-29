import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { UseBoundStore, StoreApi } from 'zustand'
import { CircleSeriesState } from './CircleSeriesRenderer'

type CircleProps = {
  store: UseBoundStore<StoreApi<CircleSeriesState>>
  index: number
  radius: number
}

export const Circle = ({ store, index, radius }: CircleProps) => {
  const circleRef = useRef(store.getState().circles[index])
  const lineRef = useRef<THREE.Line>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    store.subscribe((state) => (circleRef.current = state.circles[index]))
  }, [index, store])

  useFrame(() => {
    if (circleRef.current) {
      if (lineRef.current) {
        lineRef.current.geometry.setFromPoints([
          new THREE.Vector3(...circleRef.current.origin),
          new THREE.Vector3(...circleRef.current.endEffector),
        ])
      }

      if (meshRef.current) {
        meshRef.current.position.set(...circleRef.current.origin)
      }
    }
  })

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <ringGeometry args={[radius, radius + 0.01, 50]} />
        <lineBasicMaterial color='white' />
      </mesh>
      <line ref={lineRef}>
        <bufferGeometry />
        <lineDashedMaterial dashSize={1} gapSize={2} color='white' />
      </line>
    </>
  )
}
