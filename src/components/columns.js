import styled from "styled-components"

const Columns = styled.div`
  display: flex;
  width: calc(100% - 80px);
  position: relative;
  transform: translateX(80px);
  transition: width 0.4s ease, transform 0.4s ease;
  @media only screen and (max-width: 1180px) {
    width: 100%;
    transform: translateX(0);
  }
  @media only screen and (max-width: 860px) {
    flex-direction: column;
  }
`

const Column = styled.div`
  padding: 1rem;
  width: 50%;
  &.has-items-centered {
    display: flex;
    align-items: center;
  }
  &.index-col-1 {
    padding: 10rem 0rem 5rem 5rem;
    @media only screen and (max-width: 1180px) {
      padding: 10rem 1rem;
    }
  }
  &.index-col-2 {
    padding: 10rem 0 5rem 1rem;
    @media only screen and (max-width: 1180px) {
      width: 100%;
    }
  }
  @media only screen and (max-width: 1180px) {
    padding: 10rem 1rem;
  }
`

export {Columns, Column}
