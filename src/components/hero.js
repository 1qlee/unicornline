import styled from "styled-components"

const Hero = styled.div`
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 0;
  position: relative;
  overflow-y: hidden;
  &.is-flex-start {
    justify-content: flex-start;
    padding: 120px 2rem;
  }
`

export default Hero
