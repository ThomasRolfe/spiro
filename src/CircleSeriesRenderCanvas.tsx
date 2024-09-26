import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { CircleSeriesGear, CircleSeriesRenderer } from './CircleSeriesRenderer'

export const CircleSeriesRenderCanvas = ({
  circleSeries,
}: {
  circleSeries: CircleSeriesGear[]
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
        <CircleSeriesRenderer
          blueprint={true}
          color="brown"
          circleSeries={circleSeries}
        />
        {/* <CircleRenderer
          blueprint={false}
          color="coral"
          circleSeries={circles2}
        /> */}
        {/* <CircleRenderer
          blueprint={false}
          color="hotpink"
          circleSeries={circles3}
        /> */}
      </Canvas>
    </div>
  )
}
