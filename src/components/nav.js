import React from "react"
import throttle from "lodash/throttle"
import { graphql, StaticQuery, Link } from "gatsby"
import styled from "styled-components"
import styles from "../css/styles.js"

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

const NavLink = styled.div`
  color: ${styles.text};
  font-size: 0.875rem;
  padding: 1rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  text-align: center;
  &:hover {
    cursor: pointer;
    color: ${styles.grey.normal};
  }
  &::before {
    content: "";
    height: 0;
    width: calc(100% - 2rem);
    position: absolute;
    top: 0;
    left: 1rem;
    background: ${styles.white.normal};
    transition: height 0.1s ease;
  }
  &.is-active {
    &::before {
      height: 3px;
    }
  }
`

const NavLogo = styled.img`
  filter: drop-shadow(0 1px 5px ${styles.shadow});
  display: block;
  height: 60px;
  width: 60px;
`

const NavLeft = styled.div`
  margin: 0;
`

const NavRight = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const NavMenu = styled.div`
  background: ${styles.white.normal};
  border-radius: 0.3rem;
  box-shadow: 0 1px 4px 0 ${styles.shadow};
  display: flex;
  flex-wrap: wrap;
  padding: 1rem;
  position: absolute;
  right: 0;
  top: 70px;
  transition: transform 0.1s ease, width 0.1s ease, height 0.1s ease;
  will-change: transform, width, height;
  z-index: 99;
  a {
    &:hover {
      background-color: ${styles.primary.normal};
      color: ${styles.white.normal};
    }
  }
  &.accessory-menu {
    transform: translateX(-545px);
    width: 428px;
    height: 382px;
  }
  &.award-menu {
    transform: translateX(-585px);
    width: 155px;
    height: 242px;
  }
  &.beauty-menu {
    transform: translateX(-395px);
    width: 365px;
    height: 180px;
  }
  &.creative-menu {
    transform: translateX(-360px);
    width: 252px;
    height: 450px;
  }
  &.display-menu {
    transform: translateX(-225px);
    width: 459px;
    height: 417px;
  }
  &.health-menu {
    transform: translateX(-190px);
    width: 220px;
    height: 360px;
  }
  &.lifestyle-menu {
    transform: translateX(-110px);
    width: 195px;
    height: 210px;
  }
  &.presentation-menu {
    transform: translateX(-2rem);
    width: 375px;
    height: 320px;
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
  height: 16px;
  left: 50%;
  position: absolute;
  top: -9px;
  transform: translateX(-50%) rotate(45deg);
  border-left: 1px solid ${styles.grey.border};
  border-top: 1px solid ${styles.grey.border};
  width: 16px;
  &.is-presentation {
    right: 40px;
    left: auto;
  }
  &.is-display {
    right: 150px;
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
      background: ${styles.white.light};
    }
  }
  span {
    background: ${styles.grey.dark};
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
  border-bottom: 3px solid ${styles.grey.normal};
  border-radius: 0.2rem;
  box-shadow: 0 4px 20px 0 ${styles.shadow};
  position: absolute;
  right: 0.5rem;
  top: 100%;
  width: calc(100% - 1rem);
  z-index: 99;
  .nav-link {
    display: block;
    padding: 1rem;
    color: ${styles.text};
    text-align: left;
    &:hover {
      background-color: ${styles.grey.hover};
      &::before {
        content: "\u2192";
      }
    }
    &::before {
      content: "";
      position: absolute;
      left: calc(100% - 30px);
      top: 1rem;
    }
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
      <div>
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
        <Hamburger className={this.state.isActive ? "is-active" : null} onClick={this.handleClick}>
          <span></span>
          <span></span>
          <span></span>
        </Hamburger>
      </div>
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
          <NavMenu className="menu-col-2 accessory-menu">
            <NavMenuArrow />
            {this.props.accessory.edges.map(({node}) => (
              <Link key={node.id} to={"/accessory/" + node.slug}>{node.name}</Link>
            ))}
          </NavMenu>
        )
      case "Award":
        return (
          <NavMenu className="award-menu">
            <NavMenuArrow />
            {this.props.award.edges.map(({node}) => (
              <Link key={node.id} to={"/award/" + node.slug}>{node.name}</Link>
            ))}
          </NavMenu>
        )
      case "Beauty":
        return (
          <NavMenu className="menu-col-2 beauty-menu">
            <NavMenuArrow className="is-beauty" />
            {this.props.beauty.edges.map(({node}) => (
              <Link key={node.id} to={"/beauty/" + node.slug}>{node.name}</Link>
            ))}
          </NavMenu>
        )
      case "Creative":
        return (
          <NavMenu className="creative-menu">
            <NavMenuArrow />
            {this.props.creative.edges.map(({node}) => (
              <Link key={node.id} to={"/creative/" + node.slug}>{node.name}</Link>
            ))}
          </NavMenu>
        )
      case "Display":
        return (
          <NavMenu className="menu-col-2 display-menu">
            <NavMenuArrow className="is-display" />
            {this.props.display.edges.map(({node}) => (
              <Link key={node.id} to={"/display/" + node.slug}>{node.name}</Link>
            ))}
          </NavMenu>
        )
      case "Health":
        return (
          <NavMenu className="health-menu">
            <NavMenuArrow className="is-health" />
            {this.props.health.edges.map(({node}) => (
              <Link key={node.id} to={"/health/" + node.slug}>{node.name}</Link>
            ))}
          </NavMenu>
        )
      case "Lifestyle":
        return (
          <NavMenu className="lifestyle-menu">
            <NavMenuArrow className="is-lifestyle" />
            {this.props.lifestyle.edges.map(({node}) => (
              <Link key={node.id} to={"/lifestyle/" + node.slug}>{node.name}</Link>
            ))}
          </NavMenu>
        )
      case "Presentation":
        return (
          <NavMenu className="presentation-menu">
            <NavMenuArrow className="is-presentation" />
            {this.props.presentation.edges.map(({node}) => (
              <Link key={node.id} to={"/presentation/" + node.slug}>{node.name}</Link>
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
    const navLinks = document.getElementsByClassName("nav-item")
    for (let link of navLinks) {
      link.classList.remove("is-active")
    }
    // Highlight the text of the currently hovered category
    event.target.classList.add("is-active")
  }

  // Handle mouse leaving a category link
  handlePointerLeave = (event) => {
    // Remove any highlighting from category links
    const navLinks = document.querySelector(".nav-item.is-active")
    if (navLinks) {
      navLinks.classList.remove("is-active")
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
              <NavLogo src={this.props.logo.url} alt={this.props.logo.alt} title={this.props.logo.title}  />
            </Link>
          </NavLeft>
          {this.state.showHamburger ? (
            <NavRight>
              <HamburgerMenu categories={this.props.categories} />
            </NavRight>
          ) : (
            <NavRight onPointerLeave={this.handlePointerLeave}>
              {this.props.categories.edges.map(({node}) => (
                <Link key={node.id} to={`/${node.name.toLowerCase()}`}>
                  <NavLink id={node.name} onPointerEnter={this.handlePointerEnter} className={"nav-item " + node.name.toLowerCase()}>{node.name}</NavLink>
                </Link>
              ))}
              {this.state.showMenu ? (
                <NavMenuContainer
                  category={this.state.currentCategory}
                  accessory={this.props.accessory}
                  presentation={this.props.presentation}
                  display={this.props.display}
                  creative={this.props.creative}
                  award={this.props.award}
                  beauty={this.props.beauty}
                  lifestyle={this.props.lifestyle}
                  health={this.props.health}
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
        datoCmsCompany {
          logo {
            alt
            title
            url
          }
        }
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
        allBeauty:allDatoCmsProduct(sort: {fields: [name], order: ASC} filter: {category: {eq: "Beauty"}}) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        allLifestyle:allDatoCmsProduct(sort: {fields: [name], order: ASC} filter: {category: {eq: "Lifestyle"}}) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        allHealth:allDatoCmsProduct(sort: {fields: [name], order: ASC} filter: {category: {eq: "Health"}}) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        allDatoCmsCategory(
          sort: {
            fields: [name]
            order: ASC
          }
        ) {
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
      <NavBar categories={data.allDatoCmsCategory} accessory={data.allAccessory} presentation={data.allPresentation} display={data.allDisplay} creative={data.allCreative} award={data.allAward} beauty={data.allBeauty} lifestyle={data.allLifestyle} health={data.allHealth} logo={data.datoCmsCompany.logo} />
    )}
  />
)
