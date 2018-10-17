const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')


exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const createProperPage = (type, product) => {
    createPage({
      path: `${type}/${product.slug}`,
      component: path.resolve('./src/components/layouts/product-page.js'),
      context: {
        slug: product.slug,
      },
    })
  }

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allDatoCmsProduct {
          edges {
            node {
              slug
              category
            }
          }
        }
      }
    `).then(result => {
      result.data.allDatoCmsProduct.edges.map(({ node: product}) => {
        switch(product.category) {
          case "Accessory":
            createProperPage("accessory", product)
            break;
          case "Presentation":
            createProperPage("presentation", product)
            break;
          case "Display":
            createProperPage("display", product)
            break;
          case "Creative":
            createProperPage("creative", product)
            break;
          case "Award":
            createProperPage("award", product)
            break;
          default:
            createProperPage("product")
        }
      })
      resolve()
    })
  })
}
