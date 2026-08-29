import * as tsTypes from "typescript-compat";
export declare let tsModule: typeof tsTypes;
export declare function hasRequiredCompilerApi(mod: unknown): mod is typeof tsTypes;
export declare function resolveTypescriptModule(override?: unknown): typeof tsTypes;
export declare function setTypescriptModule(override: typeof tsTypes): void;
//# sourceMappingURL=tsproxy.d.ts.map