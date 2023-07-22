import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
	const request = axios.get(baseUrl)
	return (request.then(response => response.data))
}

const create = (newPerson) => {
	const request = axios.post(baseUrl, newPerson)
	return (request.then(response => response.data))
}

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const update = (id, newNumber) => {
	const request = axios.put(`${baseUrl}/${id}`,newNumber)
	return request.then(response => response.data)
}

export default {getAll, create, deletePerson, update}