module.exports = {
  plugins: [
    require('postcss-partial-import')(),
    require('postcss-advanced-variables')(),
    require('postcss-nested')(),
    require('autoprefixer')({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9', // React doesn't support IE8 anyway
      ]
    })
  ]
}
