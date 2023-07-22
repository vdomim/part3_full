const Filter = ({ newFilter, handleFilterChange }) => {
  return (
    <div>
      Filter shown with <input value={newFilter} onChange={handleFilterChange}/>
    </div>
  )
}

export default Filter