import { useState } from 'react';
import { Dropdown } from 'rsuite';
import { useAuthContext } from "../hooks/useAuthContext"

const DropdownMenu = ({dispatch, dropdown}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const {user} = useAuthContext()

  const fetchWorkoutsByTitle = async (title) => {
    const response = await fetch(`/api/workouts/title/${title}`, {
      headers: {'Authorization': `Bearer ${user.token}`},
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'SET_WORKOUTS', payload: json})
    }
  }

  const handleSelect = (title) => {
    setSelectedOption(title)
    fetchWorkoutsByTitle(title)
  };

  const fetchWorkouts = async () => {
    const response = await fetch('/api/workouts/', {
      headers: {'Authorization': `Bearer ${user.token}`},
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'SET_WORKOUTS', payload: json})
    }
  }

  const removeSelect = () => {
    setSelectedOption('')
    fetchWorkouts()
  };

  return (
    <div className="dropdown">
      <Dropdown title="Search">
        {dropdown.map((item, index) => (
            <Dropdown.Item key={index} onSelect={() => handleSelect(item)}>{item}</Dropdown.Item>
        ))}
      </Dropdown>
      { selectedOption && <button className="dropdown-remove-button" onClick={removeSelect}>X {selectedOption}</button>}
    </div>
  );
};

export default DropdownMenu;
