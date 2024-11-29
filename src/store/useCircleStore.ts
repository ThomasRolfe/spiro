import { create } from 'zustand'
import { circles3, defaultGear, initCircles } from '../presets/default'
import * as THREE from 'three'
import { CircleSeriesGear } from '../graphRenderer/CircleSeriesRenderer'

export interface CircleGear {
  index: number
  radius: number
  startAngle: number
  direction: string
  speed: number
}

export interface CircleGearFrame extends CircleGear {
  currentAngle: number
  origin: number[]
  endEffector: number[]
}

export interface CircleStore {
  circles: CircleGear[]
  angleDelta: number
  points: THREE.Vector2[]
  color: string
  showBlueprint: boolean
  isComplete: boolean

  // Actions
  addGear: () => void
  removeGear: (index: number) => void
  updateGear: (index: number, updates: Partial<CircleGear>) => void
  incrementDelta: () => void
  addPoint: (point: THREE.Vector2) => void
  resetPoints: () => void
  setColor: (color: string) => void
  setShowBlueprint: (show: boolean) => void
  setComplete: (complete: boolean) => void
}

const FIXED_DELTA = 2

export const useCircleStore = create<CircleStore>((set, get) => ({
  circles: circles3,
  angleDelta: 0,
  points: [],
  color: '#07F2CB',
  showBlueprint: true,
  isComplete: false,

  addGear: () =>
    set((state) => {
      // Clear existing points first
      const newState = {
        circles: [
          ...state.circles,
          { ...defaultGear, index: state.circles.length },
        ],
        points: [],
        angleDelta: 0,
        isComplete: false,
      }

      // Force a re-render of points
      requestAnimationFrame(() => {
        get().resetPoints()
      })

      return newState
    }),

  removeGear: (index) =>
    set((state) => {
      // Clear existing points first
      const newState = {
        circles: state.circles.filter((_, i) => i !== index),
        points: [],
        angleDelta: 0,
        isComplete: false,
      }

      // Force a re-render of points
      requestAnimationFrame(() => {
        get().resetPoints()
      })

      return newState
    }),

  updateGear: (index, updates) =>
    set((state) => {
      // Clear existing points first
      const newState = {
        circles: state.circles.map((gear, i) =>
          i === index ? { ...gear, ...updates } : gear
        ),
        points: [],
        angleDelta: 0,
        isComplete: false,
      }

      // Force a re-render of points
      requestAnimationFrame(() => {
        get().resetPoints()
      })

      return newState
    }),

  incrementDelta: () =>
    set((state) => ({
      angleDelta: state.angleDelta + FIXED_DELTA,
    })),

  addPoint: (point) =>
    set((state) => {
      if (!(point instanceof THREE.Vector2)) {
        point = new THREE.Vector2(point.x, point.y)
      }

      const newPoints = [...state.points, point]
      if (newPoints.length > 10000) {
        return { points: newPoints.slice(-10000) }
      }
      return { points: newPoints }
    }),

  resetPoints: () =>
    set({
      points: [],
      angleDelta: 0,
      isComplete: false,
    }),

  setColor: (color) => set({ color }),

  setShowBlueprint: (show) => set({ showBlueprint: show }),

  setComplete: (complete) => set({ isComplete: complete }),
}))

// Selector functions to minimize re-renders
export const useCircles = () => useCircleStore((state) => state.circles)
export const usePoints = () => useCircleStore((state) => state.points)
export const useColor = () => useCircleStore((state) => state.color)
export const useShowBlueprint = () =>
  useCircleStore((state) => state.showBlueprint)
export const useIsComplete = () => useCircleStore((state) => state.isComplete)
