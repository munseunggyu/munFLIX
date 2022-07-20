export function makeImagePath(id:string,format?:string){
    return `https://image.tmdb.org/t/p/${format? format : 'original'}/${id}`
}

export enum Types {
  "now_playing" = "now_playing",
  "popular" = "popular",
  "top_rated" = "top_rated",
  "upcoming" = "upcoming",
}

export enum TvTypes {
  "on_the_air" = "on_the_air",
  "popular" = "popular",
  "airing_today" = "airing_today",
  "top_rated" = "top_rated"
}