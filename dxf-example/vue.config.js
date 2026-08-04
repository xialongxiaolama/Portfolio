const path = require('path')
module.exports = {
    publicPath: process.env.NODE_ENV === "production"
        ? "/template/dxf/default/home"
        : "/",
    // outputDir: path.resolve(__dirname, 'template/dxf/default/home'),
    transpileDependencies: [
        /[\\\/]node_modules[\\\/]dxf-viewer[\\\/]/
    ],
    configureWebpack: {
        plugins: [
        ]
    }
}
