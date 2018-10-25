import styled from "styled-components"

const Title = styled.h1`
  color: ${props => props.color};
  display: inline-block;
  font-size: 4rem;
  font-weight: 400;
  margin-bottom: 1rem;
`

const Subtitle = styled.p`
  color: ${props => props.color};
  font-size: 2rem;
`

export {Title, Subtitle}
