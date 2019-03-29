import styled from "styled-components"

const Content = styled.div`
  h1,h2,h3,h4,h5,h6 {
    margin-bottom: 1rem;
  }
  h3,h4,h5,h6 {
    font-weight: 400;
  }
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  &.fade-in-down {
    animation: fadeInDown 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  &.has-text-centered {
    text-align: center;
  }
  &.is-flex {
    display: flex;
    align-items: center;
  }
  li {
    line-height: 1.5;
  }
  p + p {
    margin-top: 1rem;
  }
`

const StyledList = styled.ul`
  li {
    position: relative;
    padding-left: 1rem;
    &::before {
      position: absolute;
      left: 0;
      content: "";
      background: ${props => props.color};
      height: 1px;
      top: 50%;
      width: 10px;
      border-radius: 3px;
    }
  }
`

export {Content, StyledList}
