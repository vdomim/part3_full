const Persons = ({persons, filter, deletePerson}) => {
	return (
		persons.filter(filter).map(person => (
			<Person key={person.name} person={person} deletePerson={deletePerson}/>
		))
	)	
}

const Person = ({person, deletePerson}) => {
	return (
		<div>
			{person.name} {person.number} <button id={person.id} value={person.name} onClick={deletePerson}>delete</button>
		</div>
	)	
}

export default Persons