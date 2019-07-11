import styled from "styled-components"

const Hero = styled.div`
  background-color: ${props => props.color};
  position: relative;
  padding: 2rem;
  &.is-flex-start {
    justify-content: flex-start;
    height: auto;
    padding: 1rem 2rem;
  }
  &.has-items-centered {
    display: flex;
    align-items: center;
  }
  &.has-animation {
    animation: fadeInDown 0.4s both cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`

const HeroContent = styled.div`
  margin-bottom: 1rem;
`

export { Hero, HeroContent }
