import { create } from 'zustand'
import { defaultGear, initCircles } from '../presets/default'
import * as THREE from 'three'
// import { CircleSeriesGear } from '../graphRenderer/CircleSeriesRenderer'

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
  speed: number
  showGrid: boolean
  backgroundColor: string
  gridColor: string

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
  setCircles: (circles: CircleGear[]) => void
  setSpeed: (speed: number) => void
  setShowGrid: (show: boolean) => void
  setBackgroundColor: (color: string) => void
  setGridColor: (color: string) => void
}

export const useCircleStore = create<CircleStore>((set, get) => ({
  circles: initCircles,
  angleDelta: 0,
  points: [],
  color: '#07F2CB',
  showBlueprint: true,
  isComplete: false,
  speed: 2,
  showGrid: true,
  backgroundColor: '#232433',
  gridColor: '#1d1e2a',

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
      angleDelta: state.angleDelta + 0.5 * state.speed,
    })),

  addPoint: (point) =>
    set((state) => {
      const newPoints = [...state.points, point]
      if (newPoints.length > 10000) {
        return { points: newPoints.slice(-10000) }
      }
      return { points: newPoints }
    }),

  setCircles: (circles: CircleGear[]) => {
    set({ circles })
    requestAnimationFrame(() => {
      get().resetPoints()
    })
  },

  resetPoints: () =>
    set({
      points: [],
      angleDelta: 0,
      isComplete: false,
    }),

  setColor: (color) => set({ color }),

  setShowBlueprint: (show) => set({ showBlueprint: show }),

  setComplete: (complete) => set({ isComplete: complete }),

  setSpeed: (speed) => set({ speed }),

  setShowGrid: (show) => set({ showGrid: show }),

  setBackgroundColor: (color) => set({ backgroundColor: color }),

  setGridColor: (color) => set({ gridColor: color }),
}))

// Selector functions to minimize re-renders
export const useCircles = () => useCircleStore((state) => state.circles)
export const usePoints = () => useCircleStore((state) => state.points)
export const useColor = () => useCircleStore((state) => state.color)
export const useShowBlueprint = () =>
  useCircleStore((state) => state.showBlueprint)
export const useIsComplete = () => useCircleStore((state) => state.isComplete)
export const useSpeed = () => useCircleStore((state) => state.speed)
export const useShowGrid = () => useCircleStore((state) => state.showGrid)
export const useBackgroundColor = () =>
  useCircleStore((state) => state.backgroundColor)
export const useGridColor = () => useCircleStore((state) => state.gridColor)
