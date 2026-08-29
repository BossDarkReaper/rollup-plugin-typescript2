import * as tsTypes from "typescript-compat";
import { TransformerFactoryCreator } from "./ioptions";
export declare class LanguageServiceHost implements tsTypes.LanguageServiceHost {
    private parsedConfig;
    private transformers;
    private cwd;
    private snapshots;
    private versions;
    private service?;
    private fileNames;
    constructor(parsedConfig: tsTypes.ParsedCommandLine, transformers: TransformerFactoryCreator[], cwd: string);
    reset(): void;
    setLanguageService(service: tsTypes.LanguageService): void;
    setSnapshot(fileName: string, source: string): tsTypes.IScriptSnapshot;
    getScriptSnapshot(fileName: string): tsTypes.IScriptSnapshot | undefined;
    getScriptFileNames: () => string[];
    getScriptVersion(fileName: string): string;
    getCustomTransformers(): tsTypes.CustomTransformers | undefined;
    getCompilationSettings: () => tsTypes.CompilerOptions;
    getTypeRootsVersion: () => number;
    getCurrentDirectory: () => string;
    useCaseSensitiveFileNames: () => boolean;
    getDefaultLibFileName: typeof tsTypes.getDefaultLibFilePath;
    readDirectory: (path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number) => string[];
    readFile: (path: string, encoding?: string) => string | undefined;
    fileExists: (path: string) => boolean;
    directoryExists: (path: string) => boolean;
    getDirectories: (path: string) => string[];
    realpath: (path: string) => string;
    trace: (...data: any[]) => void;
}
//# sourceMappingURL=host.d.ts.map