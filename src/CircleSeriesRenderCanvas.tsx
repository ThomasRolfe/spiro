import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { CircleSeriesGear, CircleSeriesRenderer } from './CircleSeriesRenderer'

export const CircleSeriesRenderCanvas = ({
  circleSeriesArray,
}: {
  circleSeriesArray: Array<Array<CircleSeriesGear>>
}) => {
  return (
    <div id="canvas-container">
      <Canvas>
        <Perf />
        <OrbitControls
          enableRotate={false}
          enablePan={true}
          maxDistance={20}
          minDistance={2}
        />
        {circleSeriesArray.map((circleSeries, index) => {
          return (
            <CircleSeriesRenderer
              key={index}
              blueprint={false}
              color="brown"
              circleSeries={circleSeries}
            />
          )
        })}
      </Canvas>
    </div>
  )
}
