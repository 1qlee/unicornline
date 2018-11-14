import styled from "styled-components"
import styles from "../css/styles"

const Menu = styled.div`
  animation: scaleIn 0.4s forwards ease-in;
  display: flex;
  flex-wrap: wrap;
  margin: 1rem;
  @keyframes scaleIn {
    0% {
      opacity: 0;
      transform: scale(0.98);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`

const MenuRow = styled.div`
  width: 25%;
`

const MenuItem = styled.a`
  align-items: center;
  border: 1px solid ${styles.grey.text};
  display: flex;
  height: 100px;
  justify-content: center;
  margin-bottom: -1px;
  margin-right: -1px;
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
    color: ${styles.white};
    content: "View Item";
    left: 50%;
    opacity: 0;
    position: absolute;
    top: 50%;
    transform: translate(-50%,-50%);
    transition: opacity 0.2s ease;
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
    color: ${styles.text};
    &:nth-child(2) {
      color: ${styles.grey.text};
    }
  }
`

export {Menu, MenuItem, MenuRow}
