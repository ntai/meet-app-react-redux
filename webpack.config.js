const path = require('path');

module.exports = {
    entry: "./src/index.tsx",

    output: {
	path: path.resolve(__dirname, "../cworg/reactui/static/ui/"),
	filename: "[name].js"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {configFile: path.resolve(__dirname, "./tsconfig.prod.json"),},
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [ "style-loader", "css-loader" ]
            },
            {
                test: /\.(mpg|mpg4|svg|png|jpe?g|gif)$/i,
                use: [ { loader: "file-loader" } ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

};
