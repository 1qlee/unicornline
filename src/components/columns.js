import styled from "styled-components"

const Columns = styled.div`
  display: flex;
  position: relative;
  transform: translateX(80px);
  transition: width 0.4s ease, transform 0.4s ease;
  width: calc(100% - 80px);
  will-change: transform;
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
    padding: 10rem 0rem 5rem 3rem;
    @media only screen and (max-width: 1180px) {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
  &.index-col-2 {
    padding: 10rem 0 5rem 1rem;
    @media only screen and (max-width: 1180px) {
      padding-left: 0;
      padding-right: 0;
    }
  }
  @media only screen and (max-height: 830px) {
    &.index-col-1,
    &.index-col-2 {
      padding-top: 3rem;
      padding-bottom: 3rem;
    }
  }
  @media only screen and (min-height: 831px) and (max-height: 959px) {
    &.index-col-1,
    &.index-col-2 {
      padding-top: 5rem;
      padding-bottom: 5rem;
    }
  }
  @media only screen and (max-width: 860px) {
    &.index-col-1,
    &.index-col-2 {
      width: 100%;
    }
  }
`

export {Columns, Column}
