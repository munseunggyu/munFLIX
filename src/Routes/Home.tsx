import { AnimatePresence, motion, useViewportScroll } from "framer-motion"
import { useState } from "react"
import { useQuery } from "react-query"
import { matchRoutes, useMatch, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { getNowMovies, IGetMoviesResult } from "../api"
import { makeImagePath } from "../utilts"
import { IoIosArrowBack,IoIosArrowForward } from "react-icons/io";
import Slider from "../Components/Slider"


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


function Home(){
  const {data,isLoading} = useQuery<IGetMoviesResult>(['movies','nowPlaying'],getNowMovies)
 

  return(
    <Wrapper>
      {
        isLoading ? <Lodder> Lodding... </Lodder> : 
        <>
          <Banner  bgphoto={makeImagePath(data?.results[0].backdrop_path || '')}>
            <BannerTitle> {data?.results[0].title}</BannerTitle>
            <Overview > {data?.results[0].overview} </Overview>
          </Banner>
          <Slider />
        </>

      }
    </Wrapper>
    )
}

export default Home