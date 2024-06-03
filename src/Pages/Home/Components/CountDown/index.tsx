import { useContext, useEffect } from 'react'
import { CountDownContainer, Separator } from './styles'
import { CyclesContext } from '../../../../contexts/CyclesContext'
import { differenceInSeconds } from 'date-fns'

export function CountDown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    ammountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle?.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )

        if (secondsDifference >= totalSeconds) {
          clearInterval(interval)
          markCurrentCycleAsFinished()
          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    setSecondsPassed,
    markCurrentCycleAsFinished,
  ])

  const currentSeconds = activeCycle ? totalSeconds - ammountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  )
}
