import styled from "styled-components"

const Title = styled.h1`
  color: ${props => props.color};
  display: inline-block;
  font-size: 4rem;
  font-weight: 700;
  font-family: "Karla";
  position: relative;
  &.fade-in-down {
    animation: fadeInDown 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  & + p {
    margin-top: 1rem;
  }
  @keyframes fadeInDown {
    0% {
      opacity: 0;
      transform: translateY(-30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const Subtitle = styled.p`
  color: ${props => props.color};
  font-size: ${props => props.fontSize || "1.5rem"};
  &.fade-in-down {
    animation: fadeInDown 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  @keyframes fadeInDown {
    0% {
      opacity: 0;
      transform: translateY(-30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export {Title, Subtitle}
