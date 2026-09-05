import { useState } from 'react'
import { useFetchBreedsQuery } from './dogsSlice'

export function Dogs() {
  const [numDogs, setNumDogs] = useState(5)
  const { data = [], isFetching } = useFetchBreedsQuery(numDogs)

  return (
    <div>
      <p>Dogs to fetch</p>

      <select
        value={numDogs}
        onChange={(e) => setNumDogs(Number(e.target.value))}
      >
        <option value='5'>5</option>
        <option value='10'>10</option>
        <option value='25'>25</option>
        <option value='50'>50</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Breed</th>
            <th>Picture</th>
          </tr>
        </thead>
        <tbody>
          {data.map((dog) => (
            <tr key={dog.id}>
              <td>{dog.name}</td>
              <td>{dog.bred_for}</td>
              <td>
                <img
                  src={dog.image.url}
                  alt='dog'
                  width='200px'
                  height='auto'
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
