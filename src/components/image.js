import styled from "styled-components"
import styles from "../css/styles.js"

const ImageContainer = styled.figure`
  display: block;
  margin-bottom: 1rem;
  position: relative;
`

const CardImage = styled.img`
  display: block;
  height: 360px;
  width: 100%;
  margin-bottom: 1rem;
  -moz-user-select: none;
  -webkit-user-select: none;
  pointer-events: none;
  user-select: none;
`

const Image = styled.img`
  border: 0.3rem solid white;
  box-shadow: 0 10px 30px 0 ${styles.shadow};
  display: block;
  height: auto;
  opacity: 0.9;
  transition: opacity 0.2s ease, width 0.2s ease, height 0.2s ease;
  width: 100%;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
  &.max {
    position: absolute;
    opacity: 1;
    width: calc(100% - 4rem);
    top: 2rem;
    height: calc(100% - 4rem);
    z-index: 99;
  }
`


export { ImageContainer, CardImage, Image }
