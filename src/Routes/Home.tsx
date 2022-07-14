import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { useQuery } from "react-query"
import styled from "styled-components"
import { getMovies, IGetMoviesResult } from "../api"
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
const Banner = styled.div<{bgPhoto:string}>`
  height:100vh;
  display: flex;
  flex-direction:column;
  justify-content:center;
  padding:60px;
  background-image: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,1)),
  url(${props=>props.bgPhoto});
  background-size:cover;
`;
const Title = styled.h2`
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
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns:repeat(6,1fr);
  gap:5px;
  position:absolute;
  width:100%;
`;
const Box = styled(motion.div)<{bgPhoto : string}>`
  background-color: #fff;
  height:200px;
  background-image:url(${props=>props.bgPhoto});
  background-size:cover;
  background-position:center center;
`;
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
}
function Home(){
  const {data,isLoading} = useQuery<IGetMoviesResult>(['movies','nowPlaying'],getMovies)
  const [index,setIndex] = useState(0)
  const offset = 6
  const [leaving,setLeaving] = useState(false)
  const toggleLeaving = () => setLeaving(prev => !prev)
  const increaseIndex = () => {
   if(data){
    if(leaving) return
    toggleLeaving()
    const maxIndex = Math.ceil(data.results.slice(1).length/offset)-1
    setIndex(prev=> maxIndex > prev ? prev+1 : maxIndex)
    console.log(index,maxIndex)
   }
  }
  return(
    <Wrapper>
      {
        isLoading ? <Lodder> Lodding... </Lodder> : 
        <>
          <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || '')}>
            <Title> {data?.results[0].title}</Title>
            <Overview > {data?.results[0].overview} </Overview>
          </Banner>
          <Slider>
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
                bgPhoto={makeImagePath(movie.backdrop_path,'w500')}
                />)}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      }
    </Wrapper>
    )
}

export default Home