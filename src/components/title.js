import styled from "styled-components"

const Title = styled.h1`
  color: ${props => props.color};
  display: inline-block;
  font-size: ${props => props.fontSize};
  font-weight: ${props => props.fontWeight};
  line-height: ${props => props.fontSize};
  position: relative;
  & + p {
    margin-top: 1rem;
  }
`

const Subtitle = styled.div`
  color: ${props => props.color};
  font-size: ${props => props.fontSize || "1.5rem"};
  line-height: 1.5;
  &.fade-in-down {
    animation: fadeInDown 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`

export {Title, Subtitle}
