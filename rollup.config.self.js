import ts from "./build-self/dist/rollup-plugin-typescript2.es";

import config from "./rollup.config.base.js";

config.plugins.push(ts({ verbosity: 2, abortOnError: false, clean: false, typescript: require("typescript-compat") }));

export default config;
