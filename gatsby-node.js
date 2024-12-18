const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const createProductPage = (category, product) => {
    let categorySlug = ""

    if (/\s/.test(category)) {
      categorySlug = category.split(" ").join("-")
    }
    else {
      categorySlug = category
    }

    createPage({
      path: `${categorySlug}/${product.slug}`,
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
        slug: slug,
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
              slug
              description
            }
          }
        }
      }
    `).then(result => {
      result.data.allDatoCmsProduct.edges.map(({ node: product}) => {
        createProductPage(product.category.toLowerCase(), product)
      })
      resolve(result.data.allDatoCmsCategory.edges)
    })
  }).then((categories) => {
    categories.map(({ node: category }) => {
      createCategoryPage(category.slug.toLowerCase(), category.name)
    })
  })
}
