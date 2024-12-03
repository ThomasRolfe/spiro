import {
  Field,
  Label,
  Switch,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import {
  useCircleStore,
  useShowBlueprint,
  useColor,
} from '../store/useCircleStore'
import { useState } from 'react'
import { classNames } from '../utils/classNames'
import { presets } from '../presets/default'

export const Controls = () => {
  const tabs = [
    { name: 'Edit', component: <CircleSeriesForm /> },
    { name: 'Presets', component: <PresetsForm /> },
  ]

  return (
    <div id='controls-editor-container' className='p-4'>
      <TabGroup>
        <TabList className='flex space-x-1 rounded-xl bg-slate-800/50 p-1'>
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-md py-2.5 text-sm font-medium leading-5',
                  'ring-transparent focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-sky-500 text-white shadow'
                    : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </TabList>
        <TabPanels className='mt-4'>
          <TabPanel>
            <CircleSeriesForm />
          </TabPanel>
          <TabPanel>
            <PresetsForm />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}

const CircleSeriesForm = () => {
  const circles = useCircleStore((state) => state.circles)
  const addGear = useCircleStore((state) => state.addGear)
  if (!circles) {
    return
  }
  return (
    <div className='form-container grid gap-4 rounded'>
      {circles.map((_, index) => (
        <CircleGearForm key={`circle-gear-form-${index}`} index={index} />
      ))}
      <AddGearForm onAdd={addGear} />
      <CircleRenderForm />
    </div>
  )
}

const CircleGearForm = ({ index }: { index: number }) => {
  const circles = useCircleStore((state) => state.circles)
  const updateGear = useCircleStore((state) => state.updateGear)
  const removeGear = useCircleStore((state) => state.removeGear)

  const [localValues, setLocalValues] = useState({
    radius: circles[index].radius,
    startAngle: circles[index].startAngle,
    speed: circles[index].speed,
    direction: circles[index].direction,
  })

  const handleInputComplete = (field: string, value: number | string) => {
    const currentValue = circles[index][field]
    const newValue = typeof currentValue === 'number' ? Number(value) : value

    if (currentValue !== newValue) {
      updateGear(index, { [field]: newValue })
    }
  }

  return (
    <div className='-sm p-4 border border-light-border rounded-md'>
      <div className='flex justify-between'>
        <h3 className='font-bold'>
          {index === 0 ? 'Base gear' : `Gear ${index + 1}`}
        </h3>
        {index !== 0 && (
          <button className='' onClick={() => removeGear(index)}>
            <TrashIcon className='-ml-1 -mr-0.5 h-5 w-5 text-white hover:text-grey-50' />
          </button>
        )}
      </div>
      <div className='grid grid-cols-2 gap-4 mt-4'>
        <NumberInput
          name='radius'
          label='Radius'
          value={localValues.radius}
          onChange={(value) =>
            setLocalValues((prev) => ({ ...prev, radius: value }))
          }
          onComplete={(value) => handleInputComplete('radius', value)}
          min={0.1}
          max={4}
          step={0.1}
          placeholder='eg. 2.5'
          defaultValue={1}
          index={index}
          className='col-span-1'
        />
        <NumberInput
          name='angle'
          label='Angle'
          value={localValues.startAngle ?? 0}
          onChange={(value) =>
            setLocalValues((prev) => ({ ...prev, startAngle: value }))
          }
          onComplete={(value) => handleInputComplete('startAngle', value)}
          min={0}
          max={360}
          step={1}
          placeholder='Starting angle in degrees'
          defaultValue={0}
          index={index}
          className='col-span-1'
        />
        <NumberInput
          name='speed'
          label='Speed'
          value={localValues.speed}
          onChange={(value) =>
            setLocalValues((prev) => ({ ...prev, speed: value }))
          }
          onComplete={(value) => handleInputComplete('speed', value)}
          min={0.1}
          max={9.9}
          step={0.01}
          placeholder='Rotational speed'
          defaultValue={1}
          index={index}
          className='col-span-1'
        />
        <div className='col-span-1 sm:grid sm:grid-cols-1 sm:items-start sm:gap-2'>
          <label
            htmlFor={`direction-${index}`}
            className='block text-sm font-light leading-6 text-white'
          >
            Direction
          </label>
          <div className='mt-2 sm:col-span-2 sm:mt-0 text-white'>
            <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-light-border focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:max-w-md'>
              <select
                id={`direction-${index}`}
                value={localValues.direction}
                onChange={(e) => {
                  setLocalValues((prev) => ({
                    ...prev,
                    direction: e.target.value,
                  }))
                  handleInputComplete('direction', e.target.value)
                }}
                className='block w-full border-0 bg-transparent py-1.5 pl-2 pr-8 text-white focus:ring-0 sm:text-sm sm:leading-6 appearance-none [&>option]:bg-slate-900 [&>option]:text-white'
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                }}
              >
                <option value='cw' className='bg-slate-900 text-white'>
                  Clockwise
                </option>
                <option value='acw' className='bg-slate-900 text-white'>
                  Anti-clockwise
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CircleRenderForm = () => {
  const color = useColor()
  const showBlueprint = useShowBlueprint()
  const { setColor, setShowBlueprint } = useCircleStore()

  return (
    <div className='border border-light-border rounded-md p-4'>
      <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4'>
        <label
          htmlFor={`graphs.0.renderSettings.color`}
          className='block text-sm font-medium leading-6 text-white'
        >
          Color
        </label>
        <div className='mt-2 sm:col-span-2 sm:mt-0'>
          <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-light-border focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:max-w-md'>
            <input
              id={`graphs.0.renderSettings.color`}
              type='color'
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className='block flex-1 border-0 bg-transparent py-1.5 px-2 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
            />
          </div>
        </div>
      </div>

      <Field className='flex items-center justify-between mt-2'>
        <span className='flex flex-grow flex-col'>
          <Label
            as='span'
            passive
            className='text-sm font-medium leading-6 text-white'
          >
            Show blueprint
          </Label>
        </span>
        <Switch
          checked={showBlueprint}
          onChange={setShowBlueprint}
          className='group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 data-[checked]:bg-sky-500'
        >
          <span
            aria-hidden='true'
            className='pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5'
          />
        </Switch>
      </Field>
    </div>
  )
}

const AddGearForm = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <div className='relative flex justify-center'>
      <button
        type='button'
        className='w-full flex justify-center rounded border border-light-border px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        onClick={onAdd}
      >
        <PlusIcon
          aria-hidden='true'
          className='-ml-1 mr-2 h-5 w-5 text-gray-400'
        />
        <span>Add gear</span>
      </button>
    </div>
  )
}

type NumberInputProps = {
  name: string
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  onComplete: (value: number) => void
  placeholder: string
  index: number
  className?: string
  defaultValue: number
}

const NumberInput = ({
  name,
  label,
  min,
  max,
  step,
  value,
  onChange,
  onComplete,
  placeholder,
  index,
}: NumberInputProps) => {
  const handleComplete = (newValue: number) => {
    onComplete(Number(newValue))
  }

  return (
    <div className='sm:grid sm:grid-cols-1 sm:items-start sm:gap-2 '>
      <label
        htmlFor={`${name}-${index}`}
        className='block text-sm font-light leading-6 text-white '
      >
        {label}
      </label>
      <div className='sm:mt-0'>
        <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-light-border focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:max-w-md'>
          <input
            id={`${name}-${index}`}
            type='number'
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            onBlur={(e) => handleComplete(parseFloat(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur()
              }
            }}
            placeholder={placeholder ?? ''}
            className='block flex-1 border-0 bg-transparent py-1.5 px-2 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
          />
        </div>
      </div>
    </div>
  )
}

const PresetsForm = () => {
  const setCircles = useCircleStore((state) => state.setCircles)
  return (
    <div className='grid gap-4'>
      {presets.map((preset) => {
        return (
          <button
            onClick={() => setCircles(preset.circles)}
            className='block w-full border border-light-border rounded-md p-4'
          >
            <h2 className='text-white text-lg font-medium'>{preset.name}</h2>
          </button>
        )
      })}
    </div>
  )
}
