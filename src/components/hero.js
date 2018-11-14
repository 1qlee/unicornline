import styled from "styled-components"

const Hero = styled.div`
  background-color: ${props => props.color};
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  position: relative;
  &.is-flex-start {
    justify-content: flex-start;
    height: auto;
    padding: 2rem;
    &.no-side-padding {
      padding: 2rem 0;
    }
  }
  &.has-animation {
    animation: fadeDown 0.4s forwards ease-in;
  }
  .has-text-centered {
    padding: 120px 0;
    @media only screen and (max-width: 850px) {
      padding: 60px 1rem;
    }
  }
  @media only screen and (max-width: 850px) {
    height: auto;
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
