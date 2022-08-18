import { TvTypes, Types } from "./utilts";

const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  adult?: boolean   //movie
  first_air_date?:string  //tv
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title?: string // movie
  original_name?:string //tv
  overview: string
  name?:string // tv
  popularity: number
  poster_path: string
  release_date?: string  //movie
  title? : string // movie
  video?: boolean // movie
  vote_average: number
  vote_count: number
  runtime:number
}
    
export interface IGetResult {
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
  results: IMovie[]
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
  release_date: string
  revenue: number
  runtime: number
  first_air_date:string
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
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

export function getDetail(type:string,id:number){
  return fetch(`${BASE_PATH}/${type}/${id}?api_key=${process.env.REACT_APP_API_KEY}`).then(
    (response) => response.json()
);
}

export function getsimilar(type:string,id:number){
  return fetch(`${BASE_PATH}/${type}/${id}/similar?api_key=${process.env.REACT_APP_API_KEY}`).then(
    (response) => response.json()
);
}