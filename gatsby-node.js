const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')


exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const createProductPage = (category, product) => {
    createPage({
      path: `${category}/${product.slug}`,
      component: path.resolve('./src/components/layouts/product-page.js'),
      context: {
        slug: product.slug,
      },
    })
  }

  const createCategoryPage = (slug, category) => {
    createPage({
      path: slug,
      component: path.resolve('./src/components/layouts/category-page.js'),
      context: {
        category: category,
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
        allDatoCmsCategory {
          edges {
            node {
              name
              description
            }
          }
        }
      }
    `).then(result => {
      result.data.allDatoCmsProduct.edges.map(({ node: product}) => {
        switch(product.category) {
          case "Accessory":
            createProductPage("accessory", product)
            break;
          case "Presentation":
            createProductPage("presentation", product)
            break;
          case "Display":
            createProductPage("display", product)
            break;
          case "Creative":
            createProductPage("creative", product)
            break;
          case "Award":
            createProductPage("award", product)
            break;
          default:
            createProductPage("product")
        }
      })
      resolve(result.data.allDatoCmsCategory.edges)
    })
  }).then((categories) => {
    categories.map(({ node: category }) => {
      switch(category.name) {
        case "Accessory":
          createCategoryPage("accessory", category.name)
          break;
        case "Presentation":
          createCategoryPage("presentation", category.name)
          break;
        case "Display":
          createCategoryPage("display", category.name)
          break;
        case "Creative":
          createCategoryPage("creative", category.name)
          break;
        case "Award":
          createCategoryPage("award", category.name)
          break
        default:
          createCategoryPage("category")
      }
    })
  })
}
