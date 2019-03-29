import styled from "styled-components"

const Hero = styled.div`
  background-color: ${props => props.color};
  position: relative;
  padding: 2rem 0;
  &.is-index {
    padding: 0;
    display: flex;
  }
  &.is-flex-start {
    justify-content: flex-start;
    height: auto;
    padding: 1rem;
  }
  &.has-items-centered {
    display: flex;
    align-items: center;
  }
  &.has-animation {
    animation: fadeInDown 0.4s both cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  @media only screen and (max-width: 860px) {
    padding: 2rem 0;
  }
`

export default Hero
