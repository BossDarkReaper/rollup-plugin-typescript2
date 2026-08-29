import * as tsTypes from "typescript-compat";

export let tsModule: typeof tsTypes;

const REQUIRED_COMPILER_API = [
	"createDocumentRegistry",
	"createLanguageService",
	"parseJsonConfigFileContent",
	"parseConfigFileTextToJson",
	"findConfigFile",
	"nodeModuleNameResolver",
	"ScriptSnapshot",
	"sys",
] as const;

export function hasRequiredCompilerApi(mod: unknown): mod is typeof tsTypes
{
	if (!mod || typeof mod !== "object")
		return false;

	return REQUIRED_COMPILER_API.every((entry) => entry in mod);
}

export function resolveTypescriptModule(override?: unknown): typeof tsTypes
{
	if (hasRequiredCompilerApi(override))
		return override;

	const defaultTs = require("typescript");
	if (hasRequiredCompilerApi(defaultTs))
		return defaultTs;

	const compatTs = require("typescript-compat");
	if (hasRequiredCompilerApi(compatTs))
		return compatTs;

	throw new Error("Unable to find a compatible TypeScript compiler API. Install a supported TypeScript version or pass one via the plugin's 'typescript' option.");
}

export function setTypescriptModule(override: typeof tsTypes)
{
	tsModule = override;
}
