import { DropdownContext } from "../context/DropdownContext"
import { useContext } from "react"

export const useDropdownContext = () => {
  const context = useContext(DropdownContext)

  if(!context) {
    throw Error('useDropdownContext must be used inside an DropdownContextProvider')
  }

  return context
}