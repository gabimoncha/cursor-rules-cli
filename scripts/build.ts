import Bun from 'bun';
import dts from 'bun-plugin-dts'

await Bun.$`rm -rf dist`;
const result = await Bun.build({
	entrypoints: ["src/index.ts"],
	outdir: "dist",
	target: "node",
	sourcemap: "external",
	packages: "external",
	plugins: [dts()],
});
if (!result.success) {
	for (const log of result.logs) {
		console.error(log);
	}
}