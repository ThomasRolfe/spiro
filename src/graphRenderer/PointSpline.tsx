import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { usePoints, useColor } from '../store/useCircleStore'

export const PointSpline = () => {
  const points = usePoints()
  const color = useColor()

  const { geometry, material } = useMemo(() => {
    if (!points || !Array.isArray(points) || points.length < 2) {
      return { geometry: null, material: null }
    }

    // Create a spline curve using the points
    const curve = new THREE.SplineCurve(points)

    // Generate more points for a smoother curve
    const curvePoints = curve.getPoints(points.length * 2)

    // Create buffer geometry
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(curvePoints.length * 3)

    // Fill positions array
    curvePoints.forEach((point, i) => {
      positions[i * 3] = point.x
      positions[i * 3 + 1] = point.y
      positions[i * 3 + 2] = 0
    })

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.LineBasicMaterial({
      color: color,
      linewidth: 1,
      linecap: 'round',
      linejoin: 'round',
    })

    return { geometry, material }
  }, [points, color])

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (geometry) {
        geometry.dispose()
      }
      if (material) {
        material.dispose()
      }
    }
  }, [geometry, material])

  if (!geometry || !material || !points || points.length === 0) return null

  return (
    <line>
      <bufferGeometry attach='geometry' {...geometry} />
      <lineBasicMaterial attach='material' {...material} />
    </line>
  )
}
