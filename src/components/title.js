import styled from "styled-components"

const Title = styled.h1`
  background: ${props => props.background ? props.background : null};
  border-bottom: ${props => props.border || "none"};
  color: ${props => props.color};
  font-size: 4rem;
  font-weight: ${props => props.fontWeight};
  line-height: ${props => props.fontSize};
  margin-bottom: ${props => props.marginBottom ? props.marginBottom : "1rem"};
  position: relative;
  text-align: ${props => props.align ? props.align : null};
  @media only screen and (max-width: 700px) {
    font-size: 3rem;
  }
`

const Subtitle = styled.div`
  color: ${props => props.color};
  font-size: ${props => props.fontSize || "1.5rem"};
  line-height: 1.5;
  &.fade-in-down {
    animation: fadeInDown 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  @media only screen and (max-width: 700px) {
    font-size: 1.2rem;
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
