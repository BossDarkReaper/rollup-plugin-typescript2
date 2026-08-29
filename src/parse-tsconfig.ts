import { dirname } from "path";

import { tsModule } from "./tsproxy";
import { RollupContext } from "./context";
import { convertDiagnostic, printDiagnostics } from "./diagnostics";
import { getOptionsOverrides } from "./get-options-overrides";
import { IOptions } from "./ioptions";

const blockedPrototypeKeys = new Set(["__proto__", "prototype", "constructor"]);

function isRecord(value: unknown): value is Record<string, unknown>
{
	return !!value && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(target: unknown, source: unknown): unknown
{
	if (Array.isArray(target) && Array.isArray(source))
	{
		const out = target.slice();
		source.forEach((sourceEntry, index) =>
		{
			const targetEntry = out[index];
			out[index] = (Array.isArray(targetEntry) || isRecord(targetEntry)) && (Array.isArray(sourceEntry) || isRecord(sourceEntry))
				? deepMerge(targetEntry, sourceEntry)
				: sourceEntry;
		});
		return out;
	}

	if (isRecord(target) && isRecord(source))
	{
		const out: Record<string, unknown> = { ...target };
		Object.entries(source).forEach(([key, sourceEntry]) =>
		{
			const targetEntry = out[key];
			out[key] = (Array.isArray(targetEntry) || isRecord(targetEntry)) && (Array.isArray(sourceEntry) || isRecord(sourceEntry))
				? deepMerge(targetEntry, sourceEntry)
				: sourceEntry;
		});
		return out;
	}

	return source;
}

function sanitizeConfigValue(value: unknown): unknown
{
	if (Array.isArray(value))
		return value.map(sanitizeConfigValue);

	if (!value || typeof value !== "object")
		return value;

	const out: Record<string, unknown> = {};
	Object.entries(value).forEach(([key, entry]) =>
	{
		if (blockedPrototypeKeys.has(key))
			return;

		out[key] = sanitizeConfigValue(entry);
	});
	return out;
}

export function parseTsConfig(context: RollupContext, pluginOptions: IOptions)
{
	const fileName = tsModule.findConfigFile(pluginOptions.cwd, tsModule.sys.fileExists, pluginOptions.tsconfig);

	// if the value was provided, but no file, fail hard
	if (pluginOptions.tsconfig !== undefined && !fileName)
		context.error(`failed to open '${pluginOptions.tsconfig}'`);

	let loadedConfig: any = {};
	let baseDir = pluginOptions.cwd;
	let configFileName;
	let pretty = true;
	if (fileName)
	{
		const text = tsModule.sys.readFile(fileName)!; // readFile only returns undefined when the file doesn't exist, which we already checked above
		const result = tsModule.parseConfigFileTextToJson(fileName, text);
		pretty = result.config?.pretty ?? pretty;

		if (result.error !== undefined)
		{
			printDiagnostics(context, convertDiagnostic("config", [result.error]), pretty);
			context.error(`failed to parse '${fileName}'`);
		}

		loadedConfig = result.config;
		baseDir = dirname(fileName);
		configFileName = fileName;
	}

	const mergedConfig = [pluginOptions.tsconfigDefaults, loadedConfig, pluginOptions.tsconfigOverride]
		.map(sanitizeConfigValue)
		.reduce((acc, entry) => isRecord(entry) ? deepMerge(acc, entry) as Record<string, unknown> : acc, {});

	const preParsedTsConfig = tsModule.parseJsonConfigFileContent(mergedConfig, tsModule.sys, baseDir, getOptionsOverrides(pluginOptions), configFileName);
	const compilerOptionsOverride = getOptionsOverrides(pluginOptions, preParsedTsConfig);
	const parsedTsConfig = tsModule.parseJsonConfigFileContent(mergedConfig, tsModule.sys, baseDir, compilerOptionsOverride, configFileName);

	const module = parsedTsConfig.options.module!;
	if (module !== tsModule.ModuleKind.ES2015 && module !== tsModule.ModuleKind.ES2020 && module !== tsModule.ModuleKind.ES2022 && module !== tsModule.ModuleKind.ESNext)
		context.error(`Incompatible tsconfig option. Module resolves to '${tsModule.ModuleKind[module]}'. This is incompatible with Rollup, please use 'module: "ES2015"', 'module: "ES2020"', 'module: "ES2022"', or 'module: "ESNext"'.`);

	printDiagnostics(context, convertDiagnostic("config", parsedTsConfig.errors), pretty);

	context.debug(`built-in options overrides: ${JSON.stringify(compilerOptionsOverride, undefined, 4)}`);
	context.debug(`parsed tsconfig: ${JSON.stringify(parsedTsConfig, undefined, 4)}`);

	return { parsedTsConfig, fileName };
}
