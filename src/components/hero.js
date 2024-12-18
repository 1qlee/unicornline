import styled from "styled-components"

const Hero = styled.div`
  background-color: ${props => props.color};
  position: relative;
  padding: 1rem;
  &.is-flex-start {
    justify-content: flex-start;
    height: auto;
  }
  &.has-animation {
    animation: fadeInDown 0.4s both cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`

const HeroContent = styled.div`
  margin-bottom: 1rem;
`

export { Hero, HeroContent }
