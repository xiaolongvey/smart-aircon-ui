import { createContext, useContext, useState } from 'react'

const PowerContext = createContext()

export const usePower = () => {
  const context = useContext(PowerContext)
  if (!context) {
    throw new Error('usePower must be used within a PowerProvider')
  }
  return context
}

export const PowerProvider = ({ children }) => {
  const [powerOn, setPowerOn] = useState(true)

  const togglePower = () => {
    setPowerOn(!powerOn)
  }

  return (
    <PowerContext.Provider value={{ powerOn, togglePower }}>
      {children}
    </PowerContext.Provider>
  )
}




