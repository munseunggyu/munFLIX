import { TvTypes, Types } from "./utilts";

const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
    vote_average:number;
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

export interface ITv {
  id:number;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  name: string;
}

export interface IGetTvsResult {
  results: ITv[]
}

export function getMovies(type:Types){
  return fetch(`${BASE_PATH}/movie/${type}?api_key=${process.env.REACT_APP_API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTvs(type:TvTypes){
    return fetch(`${BASE_PATH}/tv/${type}?api_key=${process.env.REACT_APP_API_KEY}`).then(
        (response) => response.json()
    );
}