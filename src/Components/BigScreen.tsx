import styled from "styled-components";
import { getDetail, getsimilar, IDetail, IGetMoviesResult, IMovie } from "../api"
import { makeImagePath } from "../utilts"
import {AiTwotoneStar} from 'react-icons/ai'
import { useQuery } from "react-query";

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  display: flex;
  align-items:end;
  div{
    display: flex;
    justify-content:space-between;
    align-items:center;
    width:100%;
    h3{
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 30px;
    }
   span{
    display: flex;
    align-items:center;
    padding-right:20px;
    p{
      margin-top:2px;
      margin-left:5px;
    }
  }
    
  }
`;
const BigOverview = styled.div`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;
const BigOverviewTitle = styled.div`
  padding:20px;
  display: flex;
  align-items:center;
  margin-bottom:-15px;
  h5{
    font-size:20px;
    font-weight:600;
    margin-right:10px;
  }
`;
const RunningTime = styled.span`
  border-radius:5px;
  background-color:#FBC530;
  color: ${(props) => props.theme.white.lighter};
  padding:5px;
  font-weight:500;
`;
const GenresTagContainer = styled.div`
  padding:20px;
  display: flex;
`
const GenresTag = styled.span`
  border-radius:5px;
  font-weight:500;
  padding:5px;
  background-color:#FF0000;
  margin-right:5px;

  color: ${(props) => props.theme.white.lighter};
`;
function BigScreen({clickedMovie}:{clickedMovie:IMovie}){
  const {data} = useQuery<IDetail>(['movies'],() => getDetail(clickedMovie.id))
  const similar = useQuery<IGetMoviesResult>(['similar'],() => getsimilar(clickedMovie.id))
  const similarData = similar.data?.results.slice(0,6)
  console.log(data,'as')
  console.log(similarData,'si')
  console.log(clickedMovie)
  return(
    <>
      <BigCover 
      style={{
        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
          clickedMovie.backdrop_path,
          "w500"
        )})`,
      }}
      > 
      <div>
        <h3>{clickedMovie.title}</h3>
        <span> <AiTwotoneStar color="RGB(251, 160, 0)" /> <p>{clickedMovie.vote_average}</p></span>
      </div>
      </BigCover>
      <BigOverviewTitle>
        <h5>{data?.release_date.slice(0,4)}</h5>
        <RunningTime>{data?.runtime}분</RunningTime>
      </BigOverviewTitle>
      <GenresTagContainer>
        {
          data?.genres.map(item => <GenresTag>{item.name}</GenresTag>)
        }
      </GenresTagContainer>
      <BigOverview>{clickedMovie.overview.slice(0,300)}...</BigOverview> 
      <GenresTag>{data?.genres[0].name}</GenresTag> 
    </>
  )
}
export default BigScreen