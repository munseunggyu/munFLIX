import { useQuery } from "react-query"
import styled from "styled-components"
import { getMovies, IGetResult } from "../api"
import { makeImagePath, Types } from "../utilts"
import MovieSlider from "../Components/MovieSlider"


const Wrapper = styled.div`
  background:black;
`;
const Lodder = styled.div`
  height: 20vh;;
  display:flex;
  justify-content:center;
  align-items:center;
`;
const Banner = styled.div<{bgphoto:string}>`
  height:100vh;
  display: flex;
  flex-direction:column;
  justify-content:center;
  padding:60px;
  background-image: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,1)),
  url(${props=>props.bgphoto});
  background-size:cover;
`;
const BannerTitle = styled.h2`
  font-size:60px;
  margin-bottom:20px;
`;
const Overview = styled.p`
  font-size:36px;
  width:50%;
`;
const SliderWrapper = styled.div`
  position:relative;
  top:-100px;
`


function Home(){
  const {data,isLoading} = useQuery<IGetResult>(['movies','nowPlaying'],() => getMovies(Types.now_playing))
 

  return(
    <Wrapper>
      {
        isLoading ? <Lodder> Lodding... </Lodder> : 
        <>
          <Banner  bgphoto={makeImagePath(data?.results[0].backdrop_path || '')}>
            <BannerTitle> {data?.results[0].title}</BannerTitle>
            <Overview > {data?.results[0].overview} </Overview>
            
          </Banner>
          <SliderWrapper>
            <MovieSlider chlidren='Now Playing' type={Types.now_playing} />
            <MovieSlider chlidren="Popular" type={Types.popular} />
            <MovieSlider chlidren="Top Rated" type={Types.top_rated} />
            <MovieSlider chlidren="Upcoming" type={Types.upcoming} />
          </SliderWrapper>
        </>

      }
    </Wrapper>
    )
}

export default Home