import styled from "styled-components"
import styles from "../css/styles"

const Menu = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 1rem;
`

const MenuRow = styled.div`
  width: 25%;
`

const MenuItem = styled.a`
  border: 1px solid ${styles.white};
  display: block;
  padding: 1rem;
  position: relative;
  width: 100%;
  &::before {
    background: rgba(0,109,225,0.9);
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transition: width 0.2s ease;
    width: 0;
  }
  &::after {
    content: "View Item";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    opacity: 0;
    color: ${styles.white};
  }
  &:hover {
    cursor: pointer;
    &::before {
      width: 100%;
    }
    &::after {
      opacity: 1;
    }
  }
  p {
    color: ${styles.white};
    &:nth-child(2) {
      color: ${styles.whiteLight};
    }
  }
`

export {Menu, MenuItem, MenuRow}
