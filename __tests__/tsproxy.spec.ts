import { test, expect } from "@jest/globals";

import { hasRequiredCompilerApi } from "../src/tsproxy";

test("hasRequiredCompilerApi", () =>
{
	expect(hasRequiredCompilerApi({ version: "7.0.2" })).toBe(false);
	expect(hasRequiredCompilerApi({
		createDocumentRegistry: () => undefined,
		createLanguageService: () => undefined,
		parseJsonConfigFileContent: () => undefined,
		parseConfigFileTextToJson: () => undefined,
		findConfigFile: () => undefined,
		nodeModuleNameResolver: () => undefined,
		ScriptSnapshot: {},
		sys: {},
	})).toBe(true);
});
