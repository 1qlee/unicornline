import styled from "styled-components"
import styles from "../css/styles"

import IndexBackground from "../images/trianglify-index.svg"
import AccessoryBackground from "../images/trianglify-accessory.svg"
import PresentationBackground from "../images/trianglify-presentation.svg"
import DisplayBackground from "../images/trianglify-display.svg"
import CreativeBackground from "../images/trianglify-creative.svg"
import AwardBackground from "../images/trianglify-award.svg"
import BeautyBackground from "../images/trianglify-beauty.svg"

const Main = styled.div`
  background: ${styles.white.normal};
  background-size: cover;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  &.index {
    background-image: url(${IndexBackground});
  }
  &.accessory {
    background-image: url(${AccessoryBackground});
  }
  &.presentation {
    background-image: url(${PresentationBackground});
  }
  &.display {
    background-image: url(${DisplayBackground});
  }
  &.creative {
    background-image: url(${CreativeBackground});
  }
  &.award {
    background-image: url(${AwardBackground});
  }
  &.beauty {
    background-image: url(${BeautyBackground});
  }
`

export default Main
