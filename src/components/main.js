import styled from "styled-components"
import styles from "../css/styles"

import IndexBackground from "../images/trianglify-index.svg"
import AccessoryBackground from "../images/trianglify-accessory.svg"
import PresentationBackground from "../images/trianglify-presentation.svg"

const Main = styled.div`
  background: ${styles.white.normal};
  background-size: cover;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  &.index {
    background-image: url("${IndexBackground}");
  }
  &.accessory {
    background-image: url("${AccessoryBackground}");
  }
  &.presentation {
    background-image: url("${PresentationBackground}");
  }
`

export default Main
