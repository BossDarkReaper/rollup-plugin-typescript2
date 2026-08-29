import * as tsTypes from "typescript-compat";
import { IOptions } from "./ioptions";
import { RollupContext } from "./context";
export declare function getOptionsOverrides({ useTsconfigDeclarationDir, cacheRoot }: IOptions, preParsedTsconfig?: tsTypes.ParsedCommandLine): tsTypes.CompilerOptions;
export declare function createFilter(context: RollupContext, pluginOptions: IOptions, parsedConfig: tsTypes.ParsedCommandLine): (id: string | unknown) => boolean;
//# sourceMappingURL=get-options-overrides.d.ts.map