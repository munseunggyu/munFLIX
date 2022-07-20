import { AnimatePresence, motion, useViewportScroll  } from "framer-motion"
import { useState } from "react"
import { useQuery } from "react-query"
import { matchRoutes, useMatch, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { getNowMovies, IGetMoviesResult } from "../api"
import { makeImagePath } from "../utilts"
import { IoIosArrowBack,IoIosArrowForward } from "react-icons/io";

const SliderContainer = styled.div`
position: relative;
top:-100px;
margin-bottom:20px;
`;
const SliderTitle = styled.h3`
font-size:26px;
font-weight:700;
padding-left:35px;
padding-bottom:10px;
`
const Row = styled(motion.div)`
display: grid;
grid-template-columns:repeat(6,1fr);
gap:5px;
position:absolute;
width:100%;
padding: 0 30px;
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
const Arrow = styled.div<{right:boolean}>`
position:absolute;
width:30px;
height:200px;
background-color:rgba(0,0,0,0.5);
display: flex;
align-items:center;
justify-content:center;
right: ${props => props.right ? 0 : null};
left: ${props => props.right ? null : 0};
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
const rowVariants = {
  hidden: (clickReverse:boolean) => ({
    x: clickReverse ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit:(clickReverse:boolean) => ({
    x: clickReverse ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
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

function Slider(){
  const {data} = useQuery<IGetMoviesResult>(['movies','nowPlaying'],getNowMovies)
  const [index,setIndex] = useState(0)
  const {scrollY} =useViewportScroll()
  const offset = 6
  const bigMovieMatch= useMatch('/movies/:id')
  const navigate = useNavigate()
  const [leaving,setLeaving] = useState(false)
  const toggleLeaving = () => setLeaving(prev => !prev)
  const [clickReverse,setClickReverse] = useState(false)
  const increaseIndex = () => {
   if(data){
    if(leaving) return
    setClickReverse(false)
    toggleLeaving()
    const maxIndex = Math.ceil(data.results.slice(1).length/offset)-1
    setIndex(prev=> maxIndex > prev ? prev+1 : 0)
   }
  }
  const decreaseIndex = () =>{
    if(data){
      if(leaving) return
      setClickReverse(true)
      toggleLeaving()
      const maxIndex = Math.ceil(data.results.slice(1).length/offset)-1
      setIndex(prev=> prev !==0 ? prev-1 : 0)
     }
  }
  const onBoxClicked = (movieId:number) => {
    navigate(`/movies/${movieId}`)
  }
  const onOverlayClick = () => navigate('/')
  const clickedMovie = bigMovieMatch?.params.id && 
  data?.results.find(movie => String(movie.id) === bigMovieMatch.params.id)
  return (
    <>
      <SliderContainer>
        <SliderTitle> Now Playing</SliderTitle>
        <AnimatePresence initial={false} custom={clickReverse} onExitComplete={toggleLeaving}>
        <Row  
        key={index}
        custom={clickReverse}
        variants={rowVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
        transition={{type:'tween',duration:1}}
        >
          {data?.results.slice(1).slice(index*offset,index*offset+offset).map(movie=>
          <>
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
            { index !== 0 &&
              <Arrow right={false} onClick={decreaseIndex} > <IoIosArrowBack size='70' /> </Arrow>
            }
          <Arrow right={true} onClick={increaseIndex}> <IoIosArrowForward size='30' /> </Arrow>
  
          </>
          )}
        </Row>
      </AnimatePresence>
    </SliderContainer>
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
  );
}

export default Slider;