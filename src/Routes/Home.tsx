import { AnimatePresence, motion, useViewportScroll } from "framer-motion"
import { useState } from "react"
import { useQuery } from "react-query"
import { matchRoutes, useMatch, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { getNowMovies, IGetMoviesResult } from "../api"
import { makeImagePath } from "../utilts"

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
const Slider = styled.div`
  position: relative;
  top:-100px;
  margin-bottom:20px;
  padding-left:20px;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns:repeat(6,1fr);
  gap:5px;
  position:absolute;
  width:100%;
`;
const Box = styled(motion.div)<{bgphoto : string}>`
  background-color: #fff;
  height:150px;
  background-image:url(${props=>props.bgphoto});
  background-size:cover;
  height:200px;
  background-position:center center;
  position:relative;
  &:first-child{
    transform-origin:center left;
  }
  &:last-child{
    transform-origin:center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color:${props=>props.theme.black.lighter};
  position:absolute;
  width:100%;
  bottom:0;
  opacity: 0;
  h4{
    text-align:center;
    font-size:14px;
  }
`;
const Overlay = styled(motion.div)`
  position:fixed;
  top:0;
  width:100%;
  height:100%;
  opacity: 0;
  background-color: rgba(0,0,0,.5);
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${props => props.theme.black.lighter};
`;
const BigCover = styled.div`
   width: 100%;
   background-size: cover;
   background-position: center center;
   height: 400px;
 `;

 const BigTitle = styled.h3`
   color: ${(props) => props.theme.white.lighter};
   padding: 20px;
   font-size: 46px;
   position: relative;
   top: -80px;
 `;

 const BigOverview = styled.p`
   padding: 20px;
   position: relative;
   top: -80px;
   color: ${(props) => props.theme.white.lighter};
 `;
 const SliderTitle = styled.h3`
  font-size:26px;
  font-weight:700;
  padding-left:40px;
  padding-bottom:10px;
 `
const rowVariants ={
  hidden:{
    x:window.outerWidth +5,
  },
  visible:{
    x:0,
  },
  exit:{
    x:-window.outerWidth -5,
  }
};
const boxVariants = {
  nomal:{
    scale:1,
  },
  hover:{
    zIndex:99,
    scale:1.3,
    y:-50,
    transition:{
      delay:.3,
      duration:.3,
      type:'tween',
    }
  }
};
const infoVariants = {
  hover:{
    opacity:1,
    transition:{
      delay:.3,
      duration:.3,
      type:'tween',
    },
  }
}

function Home(){
  const {data,isLoading} = useQuery<IGetMoviesResult>(['movies','nowPlaying'],getNowMovies)
  const [index,setIndex] = useState(0)
  const offset = 6
  const bigMovieMatch= useMatch('/movies/:id')
  const navigate = useNavigate()
  const {scrollY} = useViewportScroll()
  const [leaving,setLeaving] = useState(false)
  const toggleLeaving = () => setLeaving(prev => !prev)
  const increaseIndex = () => {
   if(data){
    if(leaving) return
    toggleLeaving()
    const maxIndex = Math.ceil(data.results.slice(1).length/offset)-1
    setIndex(prev=> maxIndex > prev ? prev+1 : 0)
   }
  }
  const onBoxClicked = (movieId:number) => {
    navigate(`/movies/${movieId}`)
  }
  const onOverlayClick = () => navigate('/')
  const clickedMovie = bigMovieMatch?.params.id && data?.results.find(movie => String(movie.id) === bigMovieMatch.params.id)
  console.log(clickedMovie)
  return(
    <Wrapper>
      {
        isLoading ? <Lodder> Lodding... </Lodder> : 
        <>
          <Banner onClick={increaseIndex} bgphoto={makeImagePath(data?.results[0].backdrop_path || '')}>
            <BannerTitle> {data?.results[0].title}</BannerTitle>
            <Overview > {data?.results[0].overview} </Overview>
          </Banner>
          <Slider>
            <SliderTitle> Now Playing</SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row  
              key={index}
              variants={rowVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              transition={{type:'tween',duration:1}}
              >
                {data?.results.slice(1).slice(index*offset,index*offset+offset).map(movie=>
                <Box key={movie.id} 
                layoutId={movie.id+""}
                whileHover='hover'
                initial='nomal'
                variants={boxVariants}
                transition={{type:'tween'}}
                bgphoto={makeImagePath(movie.backdrop_path,'w500')}
                onClick={() => onBoxClicked(movie.id)}
                > 
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info> 
                </Box>
                )}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay onClick={onOverlayClick}
            />  
                <BigMovie
                style={{top:scrollY.get() +100}}
                layoutId={bigMovieMatch.params.id}
                > 
                     {clickedMovie && (
                     <>
                       <BigCover
                         style={{
                           backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                             clickedMovie.backdrop_path,
                             "w500"
                           )})`,
                         }}
                       />
                       <BigTitle>{clickedMovie.title}</BigTitle>
                       <BigOverview>{clickedMovie.overview}</BigOverview>
                     </>
                   )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>

      }
    </Wrapper>
    )
}

export default Home