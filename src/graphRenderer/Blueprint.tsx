import { Line } from '@react-three/drei'
import { degreesToRads } from '../utils/degreesToRads'
import {
  useCircleStore,
  useShowBlueprint,
  useColor,
  CircleGearFrame,
  CircleGear,
} from '../store/useCircleStore'

export const Blueprint = () => {
  const showBlueprint = useShowBlueprint()
  const circles = useCircleStore((state) => state.circles)
  const angleDelta = useCircleStore((state) => state.angleDelta)

  if (!showBlueprint || !circles || circles.length === 0) {
    return null
  }

  const frameData = calculateBlueprintPositions(circles, angleDelta)

  return (
    <>
      {frameData.map((frame, index) => (
        <BlueprintGear
          key={`blueprint-gear-${index}`}
          frame={frame}
          isLast={index === frameData.length - 1}
        />
      ))}
    </>
  )
}

const BlueprintGear = ({
  frame,
  isLast,
}: {
  frame: CircleGearFrame
  isLast: boolean
}) => {
  const color = useColor()
  const points: [number, number, number][] = []
  const segments = 100 // Number of segments to create the circle

  // Create circle points
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    points.push([
      frame.origin[0] + Math.cos(angle) * frame.radius,
      frame.origin[1] + Math.sin(angle) * frame.radius,
      0,
    ])
  }

  // Calculate arm end point using current angle
  const armEnd: [number, number, number] = [
    frame.origin[0] +
      (frame.direction === 'acw'
        ? Math.cos(degreesToRads(frame.currentAngle))
        : -Math.cos(degreesToRads(frame.currentAngle))) *
        frame.radius,
    frame.origin[1] +
      (frame.direction === 'acw'
        ? Math.sin(degreesToRads(frame.currentAngle))
        : -Math.sin(degreesToRads(frame.currentAngle))) *
        frame.radius,
    0,
  ]

  return (
    <>
      {/* Circle outline */}
      <Line points={points} color='#666666' lineWidth={1} dashed={false} />

      {/* Center to edge line */}
      <Line
        points={[frame.origin as [x: number, y: number], armEnd]}
        color='#666666'
        lineWidth={1}
        dashed={false}
      />

      {/* Glowing end point for the last gear */}
      {isLast && (
        <mesh position={[armEnd[0], armEnd[1], armEnd[2]]}>
          {/* Smaller bright center */}
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color={color} />

          {/* Smaller, more focused glow */}
          <pointLight distance={0.2} intensity={0.3} color={color} decay={2} />
        </mesh>
      )}
    </>
  )
}

const calculateBlueprintPositions = (
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
