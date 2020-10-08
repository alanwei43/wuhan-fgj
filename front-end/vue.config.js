module.exports = {
    // publicPath: process.env.NODE_ENV === 'production' ? '/my-project/' : '/'
    // publicPath: "../public"
    outputDir: "../public",
    filenameHashing: false,
    configureWebpack: {
        devServer: {
            port: 8085,
            proxy: {
                "/api": {
                    target: "http://localhost:8083"
                }
            }
        }
    }
}