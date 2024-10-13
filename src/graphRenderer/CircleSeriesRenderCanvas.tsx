import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
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
  console.log({ circleSeriesDefinitions })
  return (
    <div id="canvas-container">
      <Canvas>
        {/* <axesHelper /> */}
        <gridHelper
          args={[150, 300, '#b8b8b8', '#e3e3e3']}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, -0.01]}
        />
        <Perf />
        <OrbitControls
          enableRotate={false}
          enablePan={true}
          maxDistance={20}
          minDistance={2}
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
