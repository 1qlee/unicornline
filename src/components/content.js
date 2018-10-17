import styled from "styled-components"

const Content = styled.div`
  h1,h2,h3,h4,h5,h6 {
    margin-bottom: 1rem;
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
  &.fade-in-down {
    animation: fadeInDown 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  &.fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeInDown {
    0% {
      opacity: 0;
      transform: translateY(-50px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export default Content
