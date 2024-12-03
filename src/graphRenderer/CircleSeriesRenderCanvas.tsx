import { Canvas } from '@react-three/fiber'
import { OrbitControls, Plane } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { CircleSeriesRenderer } from './CircleSeriesRenderer'

export const CircleSeriesRenderCanvas = () => {
  const params = new URLSearchParams(document.location.search)
  const debug = params.get('debug')

  return (
    <div id='canvas-container'>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <gridHelper
          args={[150, 300, '#1d1e2a', '#1d1e2a']}
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
        {debug && (
          <>
            <Perf />
            <axesHelper />
          </>
        )}
        <OrbitControls
          enableRotate={false}
          enablePan={true}
          maxDistance={20}
          minDistance={3}
          target={[0, 0, 0]}
        />
        <CircleSeriesRenderer />
      </Canvas>
    </div>
  )
}
