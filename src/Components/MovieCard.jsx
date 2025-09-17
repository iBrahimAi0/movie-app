import Star from "/assets/star.png"
import noPoster from "/assets/no-poster.png"

const MovieCard = ({movie : {poster_path,title,vote_average,release_date,original_language}}) => {
    
  return (
    <div className="movie-card">
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : noPoster} alt={title} />
        <h3>{title}</h3>
        <div className="content">
            <div className="rating">
                <img src={Star} alt="Star" />
                <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
            </div>
            <p className="lang">{original_language ? original_language : "N/A"}</p>
            <span>•</span>
            <p className="year">{release_date ? release_date.split("-")[0] : "N/A"}</p>
        </div>
    </div>
  )
}

export default MovieCard