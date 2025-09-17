
const Search = ({searchInput,setSearchInput}) => {
    
  return (
    <div>
        <div className="search">
            <div>
                <img src="../assets/search.svg" alt="Search icon" />
                <input onChange={(e) => {setSearchInput(e.target.value)} } value={searchInput} type="text" placeholder='Search for a movie' />
            </div>
        </div>
    </div>
  )
}

export default Search