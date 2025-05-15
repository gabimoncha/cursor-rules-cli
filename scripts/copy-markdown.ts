import fs from "node:fs/promises";
import path from "node:path";
import { detect } from "out-of-character";

export async function copyTemplates() {
	// Create the templates directory
	const templatesDir = path.join(
		process.cwd(),
		"lib",
		"templates",
		"rules-default",
	);
	await fs.mkdir(templatesDir, { recursive: true });

	// Copy default rules
	const rulesDefault = path.join(
		process.cwd(),
		"src",
		"templates",
		"rules-default",
	);
	const rulesDefaultFiles = await fs.readdir(rulesDefault, { recursive: true });

	for (const file of rulesDefaultFiles) {
		await fs.copyFile(
			path.join(rulesDefault, file),
			path.join(templatesDir, file),
		);
	}

	// Copy the awesome cursor rules after checking for vulnerabilities
	const awesomeRulesNew = path.join(
		process.cwd(),
		"..",
		"awesome-cursorrules",
		"rules-new",
	);
	const rulesNewFiles = await fs.readdir(awesomeRulesNew, { recursive: true });

	let count = 0;

	for (const file of rulesNewFiles) {
		const text = await Bun.file(path.join(awesomeRulesNew, file)).text();
		const result = detect(text);

		if (result?.length > 0) {
			console.log(`${"Vulnerable"} ${file}`);
			count++;
		} else {
			await fs.copyFile(
				path.join(awesomeRulesNew, file),
				path.join(templatesDir, file),
			);
		}
	}
}

export async function copyRepomixInstructions() {
	// Create the templates directory
	const repomixInstructionsDir = path.join(
		process.cwd(),
		"lib",
		"templates",
		"repomix-instructions",
	);
	await fs.mkdir(repomixInstructionsDir, { recursive: true });

	// Copy repomix instructions
	const repomixInstructions = path.join(
		process.cwd(),
		"src",
		"templates",
		"repomix-instructions",
	);

	await fs.copyFile(
		path.join(repomixInstructions, "instruction-project-structure.md"),
		path.join(repomixInstructionsDir, "instruction-project-structure.md"),
	);
}

(async () => {
	await copyTemplates();
	await copyRepomixInstructions();
})();
