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
        const category = product.category.toLowerCase()
        createProductPage(category, product)
      })
      resolve(result.data.allDatoCmsCategory.edges)
    })
  }).then((categories) => {
    categories.map(({ node: category }) => {
      createCategoryPage(category.name.toLowerCase(), category.name)
    })
  })
}
