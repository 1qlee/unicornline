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
  &.has-text-centered {
    text-align: center;
  }
  &.is-flex {
    display: flex;
    align-items: center;
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
