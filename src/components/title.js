import styled from "styled-components"

const Title = styled.h1`
  color: ${props => props.color};
  display: inline-block;
  font-size: ${props => props.fontSize};
  font-weight: ${props => props.fontWeight};
  line-height: ${props => props.fontSize};
  border-bottom: ${props => props.border || "none"};
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

const Line = styled.span`
  font-family: "Karla";
  padding: 0.5rem;
  background: ${props => props.color};
  color: #fff;
  display: inline-block;
  margin-left: 1rem;
  @media only screen and (max-width: 425px) {
    margin-left: 0;
    margin-top: 1rem;
    display: block;
  }
`

export {Title, Subtitle, Line}
