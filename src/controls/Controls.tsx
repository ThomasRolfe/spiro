import { Field, Label, Switch } from '@headlessui/react'
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useEffect } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { defaultGear } from '../presets/default'

type ControlsProps = {
  circleSeriesState: []
  setCircleSeriesState: () => {}
  generalState: []
}

export const Controls = ({
  circleSeriesState,
  setCircleSeriesState,
  generalState,
}: ControlsProps) => {
  return (
    <>
      <div id="controls-menu-container">menu stuff</div>
      <div id="controls-editor-container">
        <CircleSeriesForm
          state={circleSeriesState}
          setState={setCircleSeriesState}
        />
      </div>
    </>
  )

  // state of overall controls (general speed, show grid?, debug mode)
}

const CircleSeriesForm = ({ state, setState }) => {
  const { getValues } = useFormContext()
  const circleSeries = getValues('graphs.0.circleSeries') ?? []
  console.log({ circleSeries })

  return (
    <div className="form-container m-4 grid gap-4 bg-white rounded ">
      {circleSeries.map((circleSeriesGear, index) => {
        return (
          <CircleGearForm
            key={`circle-gear-form-${index}`}
            index={index}
            gearCount={circleSeries.length}
          />
        )
      })}
      {/* <CircleGearForm key={`circle-gear-form-${0}`} index={0} />
      <CircleGearForm key={`circle-gear-form-${1}`} index={1} />
      <CircleGearForm key={`circle-gear-form-${2}`} index={2} /> */}
      <CircleRenderForm />
    </div>
  )
}

const CircleGearForm = ({
  index,
  gearCount,
}: {
  index: number
  gearCount: number
}) => {
  const { register, unregister } = useFormContext()

  const unregisterFields = () => {
    const fields = ['speed', 'angle', 'radius', 'direction']
    fields.forEach((field) => {
      unregister(`circleSeries.${index}.${field}`)
    })
  }

  console.log({ index, gearCount })
  return (
    <>
      <div className="-sm p-4">
        <div className="flex justify-between">
          <h3 className="font-bold">
            {index === 0 ? 'Base gear' : `Gear ${index + 1}`}
          </h3>
          {index !== 0 && (
            <button className="" onClick={() => unregisterFields()}>
              <TrashIcon className="-ml-1 -mr-0.5 h-5 w-5 text-red-500 hover:text-red-600" />
            </button>
          )}
        </div>
        <NumberInput
          name="radius"
          label="Radius"
          min={0.1}
          max={4}
          step={0.1}
          placeholder="eg. 2.5"
          defaultValue={1}
          index={index}
        />
        <NumberInput
          name="angle"
          label="Angle"
          min={0}
          max={360}
          step={1}
          placeholder="Starting angle in degrees"
          defaultValue={0}
          index={index}
        />
        <NumberInput
          name="speed"
          label="Speed"
          min={0.1}
          max={9.9}
          step={0.01}
          placeholder="Rotational speed"
          defaultValue={1}
          index={index}
        />
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 mt-2">
          <label
            htmlFor={`graphs.0.circleSeries.${index}.direction`}
            className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
          >
            Direction
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:max-w-md">
              <select
                id={`graphs.0.circleSeries.${index}.direction`}
                defaultValue="Clockwise"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                {...register(`graphs.0.circleSeries.${index}.direction`)}
              >
                <option value="cw">Clockwise</option>
                <option value="acw">Anti-clockwise</option>
              </select>
            </div>
          </div>
        </div>
        {/*  */}
      </div>
      <Divider
        showAddGear={index > 0 && index + 1 === gearCount && index < 5}
      />
    </>
  )
}

type NumberInputProps = {
  name: string
  label: string
  min: number
  max: number
  step: number
  defaultValue: number
  placeholder: string
  index: number
}

const NumberInput = ({
  name,
  label,
  min,
  max,
  step,
  defaultValue,
  placeholder,
  index,
}: NumberInputProps) => {
  const { register } = useFormContext()
  const fieldName = `graphs.0.circleSeries.${index}.${name}`
  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 mt-2">
      <label
        htmlFor={fieldName}
        className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
      >
        {label}
      </label>
      <div className="mt-2 sm:col-span-2 sm:mt-0">
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:max-w-md">
          <input
            id={fieldName}
            type="number"
            min={min}
            max={max}
            step={step}
            defaultValue={defaultValue}
            placeholder={placeholder ?? ''}
            className="block flex-1 border-0 bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            {...register(fieldName)}
          />
        </div>
      </div>
    </div>
  )
}

const CircleRenderForm = () => {
  const { register, unregister, setValue, getValues } = useFormContext()

  useEffect(() => {
    register('graphs.0.renderSettings.showBlueprint')
  }, [register])

  return (
    <div className="bg-white rounded-sm p-4">
      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
        <label
          htmlFor={`graphs.0.renderSettings.color`}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Color
        </label>
        <div className="mt-2 sm:col-span-2 sm:mt-0">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-sky-500 sm:max-w-md">
            <input
              id={`graphs.0.renderSettings.color`}
              type="color"
              defaultValue={'#7116cc'}
              className="block flex-1 border-0 bg-transparent py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              {...register(`graphs.0.renderSettings.color`)}
            />
          </div>
        </div>
      </div>

      <Field className="flex items-center justify-between mt-2">
        <span className="flex flex-grow flex-col">
          <Label
            as="span"
            passive
            className="text-sm font-medium leading-6 text-gray-900"
          >
            Show blueprint
          </Label>
        </span>
        <Switch
          checked={getValues('graphs.0.renderSettings.showBlueprint')}
          onChange={(isChecked) => {
            setValue('graphs.0.renderSettings.showBlueprint', isChecked)
          }}
          className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 data-[checked]:bg-sky-500"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
          />
        </Switch>
      </Field>
    </div>
  )
}

const Divider = ({ showAddGear = false }: { showAddGear?: boolean }) => {
  const { register, setValue, getValues } = useFormContext()

  const addGearControl = () => {
    const currentCircleSeries = getValues('graphs.0.circleSeries')
    const newSeriesPropertyName = `graphs.0.circleSeries.${currentCircleSeries.length}`
    register(newSeriesPropertyName)
    setValue(newSeriesPropertyName, defaultGear)
  }

  return (
    <div className="relative mx-4">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      {showAddGear && (
        <div className="relative flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => {
              addGearControl()
            }}
          >
            <PlusIcon
              aria-hidden="true"
              className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400"
            />
            Add gear
          </button>
        </div>
      )}
    </div>
  )
}
