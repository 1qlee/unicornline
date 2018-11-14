import styled from "styled-components"
import styles from "../css/styles"

const Title = styled.h1`
  color: ${props => props.color};
  display: inline-block;
  font-size: 4rem;
  font-weight: 400;
  margin-bottom: 1rem;
  position: relative;
  &.has-line {
    &::before {
      background: ${styles.primary.transparent};
      bottom: 0;
      content: "";
      height: 1.2rem;
      position: absolute;
      right: 0;
      width: 125px;
    }
  }
`

const Subtitle = styled.p`
  color: ${props => props.color};
  font-size: ${props => props.fontSize || "2rem"};
`

export {Title, Subtitle}
