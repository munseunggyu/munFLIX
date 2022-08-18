import { AnimatePresence, motion, useViewportScroll  } from "framer-motion"
import { useState } from "react"
import { useQuery } from "react-query"
import { useMatch, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { getMovies, getTvs, IGetResult, IGetTvsResult } from "../api"
import { makeImagePath, TvTypes, Types } from "../utilts"
import { IoIosArrowBack,IoIosArrowForward } from "react-icons/io";
import BigScreen from "./BigScreen"

const SliderContainer = styled.div`
margin-bottom:250px;
&:last-child{
  margin-bottom:150px;
}
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
`;
const Box = styled(motion.div)<{bgphoto : string}>`
background-color: #fff;
background-image:url(${props=>props.bgphoto});
background-size:cover;
height:200px;
cursor: pointer;
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
width:40px;
height:200px;
z-index:2;
cursor: pointer;
background-color:rgba(0,0,0,0.5);
display: flex;
align-items:center;
justify-content:center;
right: ${props => props.right ? 0 : null};
left: ${props => props.right ? null : 0};
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color:rgba(0,0,0,0.5);
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
  z-index:99;
  border-radius: 15px;
  overflow: scroll;
  overflow-x:hidden;
  background-color: ${props => props.theme.black.lighter};
`;


function TvSlider({type,chlidren}:{type:TvTypes,chlidren:string}){
  const {data} = useQuery<IGetResult>(['tvs',type],() => getTvs(type))
  const [index,setIndex] = useState(0)
  const {scrollY} =useViewportScroll()
  const offset = 6
  const bigMovieMatch= useMatch(`/tv/${type}/:tvId`)
  const navigate = useNavigate()
  const [leaving,setLeaving] = useState(false)
  const toggleLeaving = () => setLeaving(prev => !prev)
  const [clickReverse,setClickReverse] = useState(false)
  const increaseIndex = () => {
   if(data){
    if(leaving) return
    setClickReverse(false)
    toggleLeaving()
    const maxIndex = Math.floor(data.results.slice(1).length/offset)-1
    setIndex(prev=> maxIndex > prev ? prev+1 : 0)
   }
  }
  const decreaseIndex = () =>{
    if(data){
      if(leaving) return
      setClickReverse(true)
      toggleLeaving()
      const maxIndex = Math.floor(data.results.slice(1).length/offset)-1
      setIndex(prev=> prev !==0 ? prev-1 : maxIndex)
     }
  }
  const onBoxClicked = ({
    tvId,
    category,
  }: {
    tvId: number;
    category: string;
  }) => {
    navigate(`/tv/${category}/${tvId}`);
  };
  const onOverlayClick = () => navigate('/tv')
  const clickedMovie = bigMovieMatch?.params.tvId && 
  data?.results.find(movie => String(movie.id) === bigMovieMatch.params.tvId)
  console.log(clickedMovie)
  return (
    <>
      <SliderContainer>
        <SliderTitle> {chlidren}  </SliderTitle>
        <AnimatePresence initial={false} custom={clickReverse} onExitComplete={toggleLeaving}>
        <Row  
        key={type + index}
        custom={clickReverse}
        variants={rowVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
        transition={{type:'tween',duration:1}}
        >
          {data?.results.slice(1).slice(index*offset,index*offset+offset).map(tv=>
          <>
            <Box key={type + tv.id} 
            layoutId={type + tv.id}
            whileHover='hover'
            initial='nomal'
            variants={boxVariants}
            transition={{type:'tween'}}
            bgphoto={makeImagePath(tv.backdrop_path ? tv.backdrop_path : tv.poster_path,'w500')}
            onClick={() => onBoxClicked({tvId:tv.id,category:type})}
            > 
              <Info variants={infoVariants}>
                <h4>{tv.name}</h4>
              </Info> 
            </Box>
       
          </>
          )}
        </Row>
      </AnimatePresence>
      <Arrow right={false} onClick={decreaseIndex} > <IoIosArrowBack size='70' /> </Arrow>
      <Arrow right={true} onClick={increaseIndex}> <IoIosArrowForward size='40' /> </Arrow>


    </SliderContainer>
    <AnimatePresence>
    {bigMovieMatch ? (
      <>
        <Overlay onClick={onOverlayClick}
    />  
        <BigMovie
        style={{top:scrollY.get() -550}}
        layoutId={type + bigMovieMatch.params.tvId!!}
        > 
              {clickedMovie && (
              <>
                <BigScreen clickedMovie={clickedMovie} type='tv' />
              </>
            )}
        </BigMovie>
      </>
    ) : null}
  </AnimatePresence>
 </>
  );
}

export default TvSlider;