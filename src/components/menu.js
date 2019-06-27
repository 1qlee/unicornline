import styled from "styled-components"
import styles from "../css/styles"

const Menu = styled.div`
  animation: scaleIn 0.4s both cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-wrap: wrap;
  margin: 1rem;
  @keyframes scaleIn {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`

const MenuItemWrapper = styled.div`
  margin-bottom: -1px;
  margin-right: -1px;
  width: 25%;
  @media only screen and (max-width: 620px) {
    width: 50%;
  }
`

const MenuItem = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
  position: relative;
  width: 100%;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  p {
    margin-top: 1rem;
    color: ${styles.white.normal};
  }
  &:hover {
    background-color: ${styles.white.normal};
    box-shadow: 0 4px 20px ${styles.shadow};
    transform: translateY(-5px);
    cursor: pointer;
    p {
      color: ${styles.text};
    }
  }
`

export {Menu, MenuItem, MenuItemWrapper}
