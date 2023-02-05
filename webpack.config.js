const path = require("path");

module.exports = {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    entry: {
        init: "./src/init.ts",
        Game: "./src/Game.ts",
    },
    resolve: {
        extensions: [".ts"],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "js"),
    },
};
