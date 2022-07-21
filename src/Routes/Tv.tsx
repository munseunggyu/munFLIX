import { AnimatePresence, motion, useViewportScroll } from "framer-motion"
import { useState } from "react"
import { useQuery } from "react-query"
import { matchRoutes, useMatch, useNavigate } from "react-router-dom"
import styled from "styled-components"
import {  getTvs, IGetMoviesResult, IGetTvsResult } from "../api"
import { makeImagePath, TvTypes } from "../utilts"
import Slider from "../Components/MovieSlider"
import TvSlider from "../Components/TvSlider"


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


function Tv(){
  const {data,isLoading} = useQuery<IGetTvsResult>(['tvs','popular'],() => getTvs(TvTypes.popular))
  return(
    <Wrapper>
      {
        isLoading ? <Lodder> Lodding... </Lodder> : 
        <>
          <Banner  bgphoto={makeImagePath(data?.results[0].backdrop_path || '')}>
            <BannerTitle> {data?.results[0].name}</BannerTitle>
            <Overview > {data?.results[0].overview} </Overview>
            
          </Banner>
          <SliderWrapper>
            <TvSlider chlidren = 'Popular'  type={TvTypes.popular} />
            <TvSlider chlidren = 'On the Air' type={TvTypes.on_the_air} />
            <TvSlider chlidren = 'Top Rated'  type={TvTypes.top_rated} />
            <TvSlider chlidren = 'Airing Today' type={TvTypes.airing_today} />
          </SliderWrapper>
        </>

      }
    </Wrapper>
    )
}

export default Tv