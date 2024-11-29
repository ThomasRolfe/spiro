import { Canvas } from '@react-three/fiber'
import { CameraControls, OrbitControls, Plane } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { CircleSeriesGear, CircleSeriesRenderer } from './CircleSeriesRenderer'

export type circleSeriesRenderCanvasProps = {
  circleSeriesDefinitions: circleSeriesDefinition[]
}

export type circleSeriesDefinition = {
  renderSettings: {
    color: string
    showBlueprint: boolean
  }
  circleSeries: CircleSeriesGear[]
}

export const CircleSeriesRenderCanvas = ({
  circleSeriesDefinitions,
}: circleSeriesRenderCanvasProps) => {
  return (
    <div id='canvas-container'>
      <Canvas camera={{ position: [-2, 0, 5] }}>
        {/* <axesHelper /> */}
        <gridHelper
          args={[150, 300, '#232433', '#303244']}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, -0.01]}
        />
        <Plane
          args={[100, 100]} // width and height of the plane
          rotation={[0, 0, 0]} // rotate to align with grid (-90 degrees on X axis)
          position={[0, 0, -2]}
        >
          <meshBasicMaterial color='#232433' />
        </Plane>
        <Perf />
        <OrbitControls
          enableRotate={false}
          enablePan={true}
          maxDistance={20}
          minDistance={3}
          target={[-2, 0, 0]}
        />
        {circleSeriesDefinitions.map((circleSeriesDefinition, index) => {
          return (
            <CircleSeriesRenderer
              key={index}
              showBlueprint={
                circleSeriesDefinition?.renderSettings?.showBlueprint ?? false
              }
              color={circleSeriesDefinition?.renderSettings?.color ?? 'blue'}
              circleSeries={circleSeriesDefinition.circleSeries}
            />
          )
        })}
      </Canvas>
    </div>
  )
}
