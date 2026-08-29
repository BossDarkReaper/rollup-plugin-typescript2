import ts from "rollup-plugin-typescript2";

import config from "./rollup.config.base.js";

config.plugins.push(ts({ verbosity: 2, abortOnError: false, typescript: require("typescript-compat") }));

export default config;
