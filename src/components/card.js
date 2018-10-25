import styled from "styled-components"
import styles from "../css/styles"

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  padding: 0 2rem;
  margin: 0 auto;
`

const Card = styled.a`
  background: ${styles.white};
  border-radius: 12px;
  box-shadow: 0 4px 20px 0 ${styles.shadow};
  display: flex;
  margin: 0 2rem 2rem 0;
  min-height: 100px;
  width: 400px;
`

const CardImage = styled.div`
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  img {
    border-radius: 12px 0 0 12px;
    display: block;
    width: 100%;
    height: 100%;
  }
`

const CardContent = styled.div`
  padding: 1rem 2rem;
  text-decoration: none !important;
  .label {
    font-size: 1rem;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
`

export {CardContainer, Card, CardContent, CardImage}
