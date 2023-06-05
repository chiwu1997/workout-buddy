import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useDropdownContext } from '../hooks/useDropdownContext'
import { useState } from 'react'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const { dispatch: dropdownDispatch } = useDropdownContext()

  const [isUpdateMode, setIsUpdateMode] = useState(false)

  const [title, setTitle] = useState(workout.title)
  const [reps, setReps] = useState(workout.reps)
  const [load, setLoad] = useState(workout.load)

  const handleDeleteClick = async () => {
    if (!user) {
      return
    }

    const response = await fetch('/api/workouts/' + workout._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_WORKOUT', payload: json.workout})
      if (json.titleSearch.length === 0) {
        dropdownDispatch({type: 'DELETE_DROPDOWN', payload: json.workout})
      }
    }
  }

  const handleUpdateClick = async () => {
    if (!user) {
      return
    }

    const updatedWorkout = {title, load, reps}

    const response = await fetch('/api/workouts/' + workout._id, {
      method: 'PATCH',
      body: JSON.stringify(updatedWorkout),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'UPDATE_WORKOUT', payload: json})
      if (json.originalTitleSearch.length === 0) {
        dropdownDispatch({type: 'DELETE_DROPDOWN', payload: json.originalTitle})
      }
      if (json.updatedTitleSearch.length === 0) {
        dropdownDispatch({type: 'CREATE_DROPDOWN', payload: json.workout})
      }
      convertToTextarea()
    }
  }

  const convertToTextarea = () => {
    setIsUpdateMode(!isUpdateMode);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleLoadChange = (event) => {
    setLoad(event.target.value);
  };

  const handleRepsChange = (event) => {
    setReps(event.target.value);
  };

  const createDate = new Date(workout.createdAt).toLocaleDateString('en-CA')

  return (
    <div className="workout-details">
      {isUpdateMode ? <input id="title-input" value={title} onChange={handleTitleChange} /> :  <h4>{title}</h4>}
      <p><strong>Load (lb): </strong>{isUpdateMode ? <input type="number" value={load} onChange={handleLoadChange} /> :  load}</p>
      <p><strong>Reps: </strong>{isUpdateMode ? <input type="number" value={reps} onChange={handleRepsChange} /> :  reps}</p>
      <p><strong>Date: </strong>{createDate}</p>
      <p>{formatDistanceToNow(new Date(workout.updatedAt), { addSuffix: true })}</p>
      
      {/* update & delete button */}
      {isUpdateMode ? (
        <span id="check" className="material-symbols-outlined button update" onClick={handleUpdateClick}>check</span>
      ) : (
        <span className="material-symbols-outlined button update" onClick={convertToTextarea}>edit</span>
      )}
      <span className="material-symbols-outlined button delete" onClick={handleDeleteClick}>delete</span>
    </div>
  )
}

export default WorkoutDetails