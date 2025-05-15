import { writeFileSync } from "node:fs";
import path from "node:path";
import pc from "picocolors";
import {
	type CliOptions as RepomixCliOptions,
	type RepomixConfig,
	runCli as repomixAction,
} from "repomix";
import { fileExists } from "~/core/fileExists.js";
import {
	DEFAULT_REPOMIX_CONFIG,
	REPOMIX_OPTIONS,
	TEMPLATE_DIR,
} from "~/shared/constants.js";
import { logger } from "~/shared/logger.js";

export const runRepomixAction = async (quiet = false) => {
	const repomixOptions = {
		...REPOMIX_OPTIONS,
		compress: true,
		removeEmptyLines: true,
	};

	const hasConfigFile = fileExists(
		path.join(process.cwd(), "repomix.config.json"),
	);

	if (!hasConfigFile) {
		logger.prompt.step("Creating repomix config...");
		logger.trace("repomix options:", repomixOptions);
		const yoloRepomixConfig: RepomixConfig = {
			...DEFAULT_REPOMIX_CONFIG,
			output: {
				...DEFAULT_REPOMIX_CONFIG.output,
				...repomixOptions,
			},
		};

		await writeRepomixConfig(yoloRepomixConfig);
	} else {
		logger.trace("Skipping repomix config creation...");
	}

	await writeRepomixOutput({ ...repomixOptions, quiet });
};

// Check https://docs.cursor.com/settings/models#context-window-sizes
const MODEL_CONTEXT_WINDOW = {
	"1M_ctx_window": "MAX mode for gemini-2.5-pro-exp or gpt-4.1",
	"200k_ctx_window":
		"MAX mode for claude-3.5-sonnet, claude-3.7-sonnet, o4-mini, o3, gemini-2.5-pro-exp or gpt-4.1",
	"132k_ctx_window":
		"MAX mode for grok-3-beta, grok-3-mini-beta, claude-3.5-sonnet, claude-3.7-sonnet, o4-mini, o3, gemini-2.5-pro-exp or gpt-4.1",
	"128k_ctx_window":
		"gemini-2.5-flash-preview-04-17, gpt-4.1, o4-mini or any model that supports MAX mode",
	"120k_ctx_window":
		"claude-3.7-sonnet, gemini-2.5-pro-exp, o4-mini, gpt-4.1, gemini-2.5-flash-preview-04-17 or any model that supports MAX mode",
	"75k_ctx_window":
		"claude-3.5-sonnet, claude-3.7-sonnet, gemini-2.5-pro-exp, o4-mini, gpt-4.1, gemini-2.5-flash-preview-04-17 or any model that supports MAX mode",
};

export const writeRepomixOutput = async (
	opt: RepomixCliOptions,
	instructionFile = "project-structure",
) => {
	try {
		const { quiet, ...restOpts } = opt;

		const instructionFilePath = path.join(
			TEMPLATE_DIR,
			"repomix-instructions",
			`instruction-${instructionFile}.md`,
		);
		const result = await repomixAction(["."], process.cwd(), {
			...restOpts,
			quiet,
			instructionFilePath,
		});

		const totalTokens = result?.packResult?.totalTokens || 0;

		logger.quiet("\n Repomix output:", pc.cyan("./repomix-output.xml"));

		logger.prompt.message(
			pc.dim("You can check the instructions at the bottom of the file here:"),
			pc.cyan("./repomix-output.xml"),
		);
		logger.prompt.info(
			"To update the project structure, prompt Cursor in Agent Mode with the following instructions:",
		);
		logger.prompt.message(
			pc.yellow(
				"Use the read_file tool with should_read_entire_file:true on repomix-output.xml and after you are done, only then, execute the instructions that you find at the bottom",
			),
		);

		if (totalTokens > 199_000) {
			logger.prompt.warn(
				returnContextWindowWarning(
					totalTokens,
					MODEL_CONTEXT_WINDOW["1M_ctx_window"],
				),
			);
		} else if (totalTokens > 131_000) {
			logger.prompt.warn(
				returnContextWindowWarning(
					totalTokens,
					MODEL_CONTEXT_WINDOW["200k_ctx_window"],
				),
			);
		} else if (totalTokens > 127_000) {
			logger.prompt.warn(
				returnContextWindowWarning(
					totalTokens,
					MODEL_CONTEXT_WINDOW["132k_ctx_window"],
				),
			);
		} else if (totalTokens > 119_000) {
			logger.prompt.warn(
				returnContextWindowWarning(
					totalTokens,
					MODEL_CONTEXT_WINDOW["128k_ctx_window"],
				),
			);
		} else if (totalTokens > 74_000) {
			logger.prompt.warn(
				returnContextWindowWarning(
					totalTokens,
					MODEL_CONTEXT_WINDOW["120k_ctx_window"],
				),
			);
		} else if (totalTokens > 59_000) {
			logger.prompt.warn(
				returnContextWindowWarning(
					totalTokens,
					MODEL_CONTEXT_WINDOW["75k_ctx_window"],
				),
			);
		}
	} catch (err) {
		logger.debug(err);
		logger.prompt.warn("Error running repomix!");
	}
};

export const writeRepomixConfig = async (config: RepomixConfig) => {
	try {
		const configPath = path.join(process.cwd(), "repomix.config.json");
		writeFileSync(configPath, JSON.stringify(config, null, 2));
		logger.prompt.info(
			"Repomix config saved to:",
			pc.cyan("./repomix.config.json"),
		);
		logger.quiet("\n Repomix config file:", pc.cyan("./repomix.config.json"));
	} catch (err) {
		logger.prompt.warn("Error saving repomix config!");
	}
};

const returnContextWindowWarning = (totalTokens: number, model: string) => {
	return `Total tokens: ${totalTokens.toLocaleString()}. Make sure to select ${pc.magentaBright(model)} for larger context windows.`;
};
