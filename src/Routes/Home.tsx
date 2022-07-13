import { useQuery } from "react-query"
import styled from "styled-components"
import { getMovies, IGetMoviesResult } from "../api"

const Wrapper = styled.div`
    background:black;
`
const Lodder = styled.div`
    height: 20vh;;
    display:flex;
    justify-content:center;
    align-items:center;
`

function Home(){
    const {data,isLoading} = useQuery<IGetMoviesResult>(['movies','nowPlaying'],getMovies)
    return(
        <Wrapper>
            {
                isLoading ? <Lodder> Lodding... </Lodder> : null
            }
        </Wrapper>
        )
}

export default Home