import * as path from "path";
import * as tsTypes from "typescript-compat";
export declare class FormatHost implements tsTypes.FormatDiagnosticsHost {
    getCurrentDirectory(): string;
    getCanonicalFileName: typeof path.normalize;
    getNewLine: () => string;
}
export declare const formatHost: FormatHost;
//# sourceMappingURL=diagnostics-format-host.d.ts.map