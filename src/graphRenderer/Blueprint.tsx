import { Circle } from './Circle'
import { CircleSeriesGear, CircleSeriesState } from './CircleSeriesRenderer'
import { UseBoundStore, StoreApi } from 'zustand'

type BlueprintProps = {
  show: boolean
  circleStore: UseBoundStore<StoreApi<CircleSeriesState>>
  circleSeries: CircleSeriesGear[]
}

export const Blueprint = ({
  show,
  circleStore,
  circleSeries,
}: BlueprintProps) => {
  if (!show) {
    return <></>
  }

  return (
    <>
      {circleSeries.map((circle) => {
        return (
          <Circle store={circleStore} key={`${Math.random()}`} {...circle} />
        )
      })}
    </>
  )
}
