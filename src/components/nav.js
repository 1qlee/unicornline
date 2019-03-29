import React from "react"
import throttle from "lodash/throttle"
import { graphql, StaticQuery, Link } from "gatsby"
import styled from "styled-components"
import styles from "../css/styles.js"

import UnicornLogo from "./unicorn.jpg"

const Nav = styled.nav`
  display: block;
  position: relative;
  z-index: 5;
`

const NavContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  position: relative;
`

const NavItem = styled.div`
  padding: 1rem;
  &.is-active {
    a {
      color: ${styles.text};
    }
  }
`

const NavLogo = styled.div`
  img {
    display: block;
    height: 45px;
    min-width: 45px;
    width: 45px;
    padding: 5px;
    background: #fff;
    border-radius: 100%;
    box-shadow: 0 8px 30px 0 ${styles.shadow};
  }
`

const NavLeft = styled.div`
  margin-right: 1rem;
`

const NavRight = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const NavLink = styled.div`
  color: ${styles.grey.normal};
  font-size: 0.875rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  &:hover {
    cursor: pointer;
    color: ${styles.grey.dark};
  }
`

const NavMenu = styled.div`
  background: ${styles.white.normal};
  border-radius: 0.3rem;
  box-shadow: 0 10px 20px 0 ${styles.shadow}, 1px 0 5px 0 ${styles.shadow};
  display: flex;
  flex-wrap: wrap;
  padding: 1rem;
  position: absolute;
  right: 0;
  top: 65px;
  transition: transform 0.1s ease, width 0.1s ease, height 0.1s ease;
  will-change: transform, width, height;
  z-index: 99;
  &.menu-pos-1 {
    transform: translateX(-17rem);
    width: 428px;
    height: 382px;
  }
  &.menu-pos-2 {
    transform: translateX(-9rem);
    width: 428px;
    height: 350px;
  }
  &.menu-pos-3 {
    transform: translateX(-12px);
    width: 459px;
    height: 417px;
  }
  &.menu-pos-4 {
    transform: translateX(-24px);
    width: 252px;
    height: 417px;
  }
  &.menu-pos-5 {
    transform: translateX(-24px);
    width: 155px;
    height: 242px;
  }
  &.menu-col-2 {
    a {
      width: 50%;
    }
  }
  a {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    animation-iteration-count: 1;
    animation-timing-function: ease;
    animation-fill-mode: forwards;
    border-radius: 3px;
    color: ${styles.text};
    padding: 0.5rem 0.3rem;
    transition: color 0.1s ease, background-color 0.1s ease;
    width: 100%;
    &:hover {
      color: ${styles.white.normal};
      background-color: ${styles.primary.normal};
    }
    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
`

const NavMenuArrow = styled.div`
  background: ${styles.white.normal};
  box-shadow: -1px -1px 1px 0 ${styles.shadow};
  height: 16px;
  left: 50%;
  position: absolute;
  top: -8px;
  transform: translateX(-50%) rotate(45deg);
  width: 16px;
  &.is-right {
    right: 1rem;
    left: auto;
  }
`

const Hamburger = styled.div`
  cursor: pointer;
  padding: 1rem;
  position: relative;
  &.is-active {
    span {
      &:first-child {
        transform: rotate(45deg);
        top: 17px;
      }
      &:nth-child(2) {
        display: none;
      }
      &:nth-child(3) {
        transform: rotate(-45deg);
        top: 17px;
      }
    }
  }
  &:hover {
    span {
      background: ${styles.grey.dark};
    }
  }
  span {
    background: ${styles.grey.normal};
    height: 1px;
    left: 4px;
    position: absolute;
    transition: transform 0.2s ease;
    width: 24px;
    &:first-child {
      top: 10px;
    }
    &:nth-child(2) {
      top: 17px;
    }
    &:nth-child(3) {
      top: 24px;
    }
  }
`

const HamburgerDropdown = styled.div`
  background: ${styles.white.normal};
  border-bottom: 3px solid ${styles.shadow};
  border-radius: 0.3rem;
  box-shadow: 0 1px 20px 0 ${styles.shadow};
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  z-index: 99;
  .nav-link {
    display: block;
    padding: 1rem;
  }
`

// Nav hamburger menu component
class HamburgerMenu extends React.Component {
  state = {
    isActive: false
  }

  handleClick = (e) => {
    this.setState({
      isActive: !this.state.isActive
    })
  }

  render() {
    return (
      <Hamburger className={this.state.isActive ? "is-active" : null} onClick={this.handleClick}>
        <span></span>
        <span></span>
        <span></span>
        {this.state.isActive ? (
          <HamburgerDropdown>
            {this.props.categories.edges.map(({node}) => (
              <Link key={node.id} to={`/${node.name.toLowerCase()}`}>
                <NavLink className="nav-link">{node.name}</NavLink>
              </Link>
            ))}
          </HamburgerDropdown>
        ) : (
          null
        )}
      </Hamburger>
    )
  }
}

// Nav dropdown menu component
class NavMenuContainer extends React.Component {
  // Pass all categories (graphql nodes) into component as props
  // Then render every product for each category
  render() {
    switch(this.props.category) {
      case "Accessory":
        return (
          <NavMenu className="menu-col-2 menu-pos-1">
            <NavMenuArrow />
            {this.props.accessory.edges.map(({node}) => (
              <Link key={node.id} to={"/accessory/" + node.slug}>{node.name}</Link>
            ))}
          </NavMenu>
        )
      case "Presentation":
        return (
          <NavMenu className="menu-col-2 menu-pos-2">
            <NavMenuArrow />
            {this.props.presentation.edges.map(({node}) => (
              <Link key={node.id} to={"/presentation/" + node.slug}>{node.name}</Link>
            ))}
          </NavMenu>
        )
      case "Display":
        return (
          <NavMenu className="menu-col-2 menu-pos-3">
            <NavMenuArrow />
            {this.props.display.edges.map(({node}) => (
              <Link key={node.id} to={"/display/" + node.slug}>{node.name}</Link>
            ))}
          </NavMenu>
        )
      case "Creative":
        return (
          <NavMenu className="menu-pos-4">
            <NavMenuArrow />
            {this.props.creative.edges.map(({node}) => (
              <Link key={node.id} to={"/creative/" + node.slug}>{node.name}</Link>
            ))}
          </NavMenu>
        )
      case "Award":
        return (
          <NavMenu className="menu-col-1 menu-pos-5">
            <NavMenuArrow className="is-right" />
            {this.props.award.edges.map(({node}) => (
              <Link key={node.id} to={"/award/" + node.slug}>{node.name}</Link>
            ))}
          </NavMenu>
        )
      default:
        return null
    }
  }
}

// Navbar container component
class NavBar extends React.Component {
  constructor() {
    super()
    // showMenu hides or shows dropdown menu
    // currentCategory keeps track of which dropdown category was last shown
    this.state = {
      showMenu: false,
      currentCategory: null,
      windowWidth: 0,
      showHamburger: typeof window !== 'undefined' ? window.innerWidth < 750 : false
    }
    // Bind methods
    this.handlePointerEnter = this.handlePointerEnter.bind(this)
    this.handlePointerLeave = this.handlePointerLeave.bind(this)
    this.handleWindowResize = this.handleWindowResize.bind(this)
  }

  componentDidMount() {
    // Add window resizing event handler
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentWillUnmount() {
    // Remove window resizing event handler
    window.removeEventListener('resize', this.handleWindowResize)
  }

  // Handle small viewport width to toggle hamburger menu
  handleWindowResize = throttle(() => {
    this.onResize()
  }, 200)

  onResize = () => {
    if (typeof window !== 'undefined') {
      this.setState({ showHamburger: window.innerWidth < 750 })
    }
  }

  // Handle mouse entering a category link
  handlePointerEnter = (event) => {
    // Set state to show menu
    // Change currentCategory to the category that was hovered on
    this.setState({
      showMenu: true,
      currentCategory: event.target.textContent,
    })

    // Remove any pre-existing highlights on all category links
    const navItems = document.getElementsByClassName("nav-item")
    for (let item of navItems) {
      item.classList.remove("is-active")
    }
    // Highlight the text of the currently hovered category
    event.target.classList.add("is-active")
  }

  // Handle mouse leaving a category link
  handlePointerLeave = (event) => {
    // Remove any highlighting from category links
    const navItems = document.querySelector(".nav-item.is-active")
    if (navItems) {
      navItems.classList.remove("is-active")
    }

    // Set state to hide menu
    this.setState({
      showMenu: false,
    })
  }

  render() {
    return (
      <Nav>
        <NavContainer>
          <NavLeft>
            <Link to="/">
              <NavLogo>
                <img src={UnicornLogo} alt="Logo" />
              </NavLogo>
            </Link>
          </NavLeft>
          {this.state.showHamburger ? (
            <NavRight>
              <HamburgerMenu categories={this.props.categories} />
            </NavRight>
          ) : (
            <NavRight onPointerLeave={this.handlePointerLeave}>
              {this.props.categories.edges.map(({node}) => (
                <NavItem key={node.id} id={node.name} onPointerEnter={this.handlePointerEnter} className="nav-item">
                  <Link to={`/${node.name.toLowerCase()}`}>
                    <NavLink>{node.name}</NavLink>
                  </Link>
                </NavItem>
              ))}
              {this.state.showMenu ? (
                <NavMenuContainer
                  category={this.state.currentCategory}
                  accessory={this.props.accessory}
                  presentation={this.props.presentation}
                  display={this.props.display}
                  creative={this.props.creative}
                  award={this.props.award}
                />
              ) : (
                null
              )}
            </NavRight>
          )}
        </NavContainer>
      </Nav>
    )
  }
}

export default () => (
  <StaticQuery
    query={graphql`
      query NavQuery {
        allAccessory:allDatoCmsProduct(sort: {fields: [name], order: ASC} filter: {category: {eq: "Accessory"}}) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        allPresentation:allDatoCmsProduct(sort: {fields: [name], order: ASC} filter: {category: {eq: "Presentation"}}) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        allDisplay:allDatoCmsProduct(sort: {fields: [name], order: ASC} filter: {category: {eq: "Display"}}) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        allCreative:allDatoCmsProduct(sort: {fields: [name], order: ASC} filter: {category: {eq: "Creative"}}) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        allAward:allDatoCmsProduct(sort: {fields: [name], order: ASC} filter: {category: {eq: "Award"}}) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        allDatoCmsCategory {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `}
    render={data => (
      <NavBar categories={data.allDatoCmsCategory} accessory={data.allAccessory} presentation={data.allPresentation} display={data.allDisplay} creative={data.allCreative} award={data.allAward} />
    )}
  />
)
