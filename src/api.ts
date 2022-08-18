import { TvTypes, Types } from "./utilts";

const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
    // id: number;
    // backdrop_path: string;
    // poster_path: string;
    // title: string;
    // overview: string;
    // vote_average:number;
    adult: boolean
backdrop_path: string
genre_ids: number[]
id: number
original_language: string
original_title: string
overview: string
popularity: number
poster_path: string
release_date: string
title: string
video: false
vote_average: number
vote_count: number
runtime:number
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
interface IGenrens{
  id:number,
  name:string
}
interface ICompaney{
  id:number
  logo_path:string
  name:string
  origin_country:string
}
export interface IDetail{
  adult: boolean
  backdrop_path: string
  belongs_to_collection: null
  budget: number
  genres: IGenrens[]
  homepage: string
  id: number
  imdb_id: string
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: ICompaney[]
  // production_countries?: 
  release_date: string
  revenue: number
  runtime: number
  // spoken_languages: [{…}]
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}
// export interface IDetailResult{
//   results:IDetail[]
// }

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

export function getDetail(id:number){
  return fetch(`${BASE_PATH}/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}`).then(
    (response) => response.json()
);
}

export function getsimilar(id:number){
  return fetch(`${BASE_PATH}/movie/${id}/similar?api_key=${process.env.REACT_APP_API_KEY}`).then(
    (response) => response.json()
);
}