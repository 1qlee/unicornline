import styled from "styled-components"

const Hero = styled.div`
  background-color: ${props => props.color};
  position: relative;
  padding: 160px 0;
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
    animation: fadeDown 0.4s both cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  @media only screen and (max-width: 860px) {
    padding: 2rem 0;
  }
  @keyframes fadeDown {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export default Hero
