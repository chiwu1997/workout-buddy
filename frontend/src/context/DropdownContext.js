import { createContext, useReducer } from 'react'

export const DropdownContext = createContext()

export const dropdownReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DROPDOWN':
      return { 
        dropdown: action.payload.map((obj) => obj.title)
      }
    case 'CREATE_DROPDOWN':
      return { 
        dropdown: [...state.dropdown, action.payload.title] 
      }
    case 'DELETE_DROPDOWN':
      return { 
        dropdown: state.dropdown.filter(w => w !== action.payload.title) 
      }
    default:
      return state
  }
}

export const DropdownContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dropdownReducer, { 
    dropdown: null
  })
  
  return (
    <DropdownContext.Provider value={{ ...state, dispatch }}>
      { children }
    </DropdownContext.Provider>
  )
}