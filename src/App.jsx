import { useEffect, useState } from "react"
import Search from "./Components/Search"
import MovieCard from "./Components/MovieCard";
import Spiner from "./Components/Spiner";
import { useDebounce } from "react-use";
import {updateSearchCount,getTrendingMovies} from "./appwrite";
import HeroImage from "/assets/hero-img.png"
import Logo from "/assets/logo.svg"
import Arrow from "/assets/arrow.png";

const App = () => {
  const [searchInput,setSearchInput] = useState("");
  const [errorMessage,setErrorMessage] = useState("");
  const [moviesList,setMoviesList] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [debouncedSearchInput,setDebouncedSearchInput] = useState("");
  const [trendingMovies,setTrendingMovies] = useState([])
  const [page,setpage] = useState(1);
  const [totalPages,setTotalPages] = useState(null)

  useDebounce(()=> setDebouncedSearchInput(searchInput),500,[searchInput]);

    const API_URL = "https://api.themoviedb.org/3";
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

    const API_OPTIONS = {
      method : "GET",
      headers : {
        accept : "application/json",
        Authorization :`Bearer ${API_KEY}`
      }
    }

  const getMovies = async (query = '') => {


    try{
      setIsLoading(true)
      const endPoint = query ?  `${API_URL}/search/movie?query=${query}`: `${API_URL}/discover/movie?page=${page}&sort_by=popularity.desc`
      const response = await fetch(endPoint,API_OPTIONS);
      if(!response.ok){
        throw new Error("Faild to fetch movies");
      }
      const data = await response.json();
      setTotalPages( data.total_pages )
      
      setMoviesList(data.results);
      
      if(query && data.results.length > 0){
        await updateSearchCount(query,data.results[0])
      }
      
      
    }catch(error){
      console.error(`Error ${error}`);
      setErrorMessage("Error fetching Movies")
    }finally{
      setIsLoading(false)
    }
    
  }
  
  
  const showTrendingMovies = async () => {
  try{
    const tmovies = await getTrendingMovies()
    setTrendingMovies(tmovies)
    
  }
  catch(error){
    console.error()
  }
}

  useEffect(()=> {
    getMovies(debouncedSearchInput)    
  },[debouncedSearchInput,page])
  
  useEffect(()=> {
    showTrendingMovies()
  },[])
  
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src={Logo} alt="Logo" className="w-20" />
            <img src={HeroImage} alt="Hero image" />
            <h1>Find <span className="text-gradient">Movies</span> You’ll Love Without the Hassle</h1>
            <Search searchInput={searchInput} setSearchInput={setSearchInput}/>
          </header>
            {trendingMovies.length > 0 ? <section className="trending">
              <h2>Trending</h2>
              <ul>
                {trendingMovies.map((trendingMovie,index) => (
                  <li key={trendingMovie.$id}>
                    <p>{index + 1}</p>
                    <img src={trendingMovie.poster_url} alt={trendingMovie.title} />
                  </li>
                ))}
              </ul>
            </section> : null}
            <section className="all-movies">
              <h2>Popular</h2>
                {isLoading ? 
                  (<div className="flex justify-center items-center gap-x-4 h-64"><Spiner/></div>) : 
                  errorMessage ? (<p className="text-red-500">{errorMessage}</p>) 
                  : (<ul>
                    {moviesList.map((movie) => (
                    <li key={movie.id}><MovieCard movie={movie}/></li>
                  ))}
                    </ul>)}
           </section>
           <section className="pagination">
              <img className="r-arrow" src={Arrow} alt="Arrow" onClick={() => {setpage((prev) => Math.max(prev - 1,1))}} />
              <p><span>{page}</span> / {totalPages}</p>
              <img className="l-arrow"  src={Arrow} alt="Arrow" onClick={() => {setpage((prev) => Math.min(prev + 1,totalPages))}} />
           </section>
        </div>
      </div>
    </main>
  )
}

export default App