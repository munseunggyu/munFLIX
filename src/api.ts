import { Types } from "./utilts";

const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}
    
export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export function getMovies(type:Types){
    return fetch(`${BASE_PATH}/movie/${type}?api_key=${process.env.REACT_APP_API_KEY}`).then(
        (response) => response.json()
    );
}

export function getPopularMovies(){
    return fetch(`${BASE_PATH}/movie/popular?api_key=${process.env.REACT_APP_API_KEY}`).then(
        (response) => response.json()
    );
}