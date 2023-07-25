import React, { useState, useEffect  } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ infoMessage, setInfoMessage] = useState(null)
  const [ infoType, setInfoType ] = useState('')

  useEffect(() => {
    personService.getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  },[])

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {name: newName, number: newNumber}
    const personExists = persons.filter(person => person.name.toLowerCase() === newName.toLowerCase())[0]
    if(personExists !== undefined){
      const personId = personExists.id
      if(window.confirm(`${newName} is already added to the Phonebook, replace the old number with a new one?`)){
        const newPerson = {...personExists, number: newNumber}
        personService.update(personId, newPerson)
        .then(updatedPerson =>{
          setNewName("")
          setNewNumber("")
          setPersons(persons.map(person => person.id !== personId ? person : updatedPerson))
          setInfoType("successful")
          setInfoMessage(
            `Updated ${newName} number`
          )
          setTimeout(() => {
            setInfoMessage(null)
          }, 5000)
        })
      }
    }else{
      personService.create(nameObject)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName("")
        setNewNumber("")
        setInfoType("successful")
        setInfoMessage(
            `Added ${newName}`
          )
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)
      })
      .catch(error => {
        setInfoType("error")
        setInfoMessage(error.response.data.error)
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  } 

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const filterFunction = (person) => {
    return person.name.toLowerCase().includes(newFilter.toLowerCase())
  }

  const deleteHandler = (event) => {
    if (window.confirm(`Delete ${event.target.value}?`)){
      const id = event.target.id
      personService.deletePerson(id)
        .then(() => {
          personService.getAll()
          .then(initialPersons => {
            setPersons(initialPersons)
            setInfoType("successful")
            setInfoMessage(
                `Deleted ${event.target.value}`
              )
            setTimeout(() => {
              setInfoMessage(null)
            }, 5000)
          })
        })
      .catch(error => {
        personService.getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
        setInfoType("error")
        setInfoMessage(`Information of ${event.target.value} has already beenn removed from server`)
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={infoMessage} infoType={infoType}/>
        <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm submitFunction={addPerson} name={newName} handleName={handleNameChange}
      number={newNumber} handleNumber={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filterFunction} deletePerson={deleteHandler} />
    </div>
  )
}

export default App