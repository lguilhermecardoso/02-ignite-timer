import React, { createContext, useEffect, useReducer, useState } from 'react'
import { cyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrenctCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextTpe {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
  ammountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCycle: () => void
  cycles: Cycle[]
}
export const CyclesContext = createContext({} as CyclesContextTpe)

interface CyclesProviderProps {
  children: React.ReactNode
}

export function CyclesProvider({ children }: CyclesProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const stateJSON = localStorage.getItem('@ignite-item:cycles-state-1.0.0')

      if (stateJSON) {
        return JSON.parse(stateJSON)
      }

      return initialState
    },
  )

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [ammountSecondsPassed, setAmmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-item:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  function markCurrentCycleAsFinished() {
    dispatch(markCurrenctCycleAsFinishedAction())
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    dispatch(addNewCycleAction(newCycle))
    setAmmountSecondsPassed(0)
  }

  function interruptCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  function setSecondsPassed(seconds: number) {
    setAmmountSecondsPassed(seconds)
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        ammountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
