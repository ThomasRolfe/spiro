import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { usePoints, useColor } from '../store/useCircleStore'

export const PointSpline = () => {
  const points = usePoints()
  const color = useColor()

  // Create line material
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: color,
      linewidth: 1,
    })
  }, [color])

  // Create geometry from points
  const geometry = useMemo(() => {
    if (!points || points.length < 2) return null

    // Create a spline curve using the points
    const curve = new THREE.SplineCurve(points)

    // Generate points for the curve
    const curvePoints = curve.getPoints(points.length)

    // Create buffer geometry
    const geometry = new THREE.BufferGeometry()

    // Convert points to vertices
    const vertices = new Float32Array(curvePoints.length * 3)
    curvePoints.forEach((point, i) => {
      vertices[i * 3] = point.x
      vertices[i * 3 + 1] = point.y
      vertices[i * 3 + 2] = 0
    })

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    return geometry
  }, [points])

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

  if (!geometry || points.length < 2) return null

  return (
    <primitive object={new THREE.Line(geometry, material)} dispose={null} />
  )
}
