import { useEffect }from 'react'
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useDropdownContext } from "../hooks/useDropdownContext"

// components
import WorkoutDetails from '../components/WorkoutDetails'
import WorkoutForm from '../components/WorkoutForm'
import DropdownMenu from '../components/Dropdown';

const Home = () => {
  const {workouts, dispatch} = useWorkoutsContext()
  const {dropdown, dispatch: dropdownDispatch} = useDropdownContext()
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('/api/workouts', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_WORKOUTS', payload: json})
      }
    }

    const fetchDropdown = async () => {
      const response = await fetch('/api/dropdown', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const dropdownJson = await response.json()

      if (response.ok) {
        dropdownDispatch({type: 'SET_DROPDOWN', payload: dropdownJson})
      }
    }

    if (user) {
      fetchWorkouts()
      fetchDropdown()
    }
  }, [dispatch, dropdownDispatch, user])

  return (
    <div className="home">
      <div className="workouts">
        {dropdown && <DropdownMenu dispatch={dispatch} dropdown={dropdown}/>}
        {workouts && workouts.map((workout) => (
          <WorkoutDetails key={workout._id} workout={workout} />
        ))}
      </div>
      <WorkoutForm />
    </div>
  )
}

export default Home