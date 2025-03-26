module.exports = {
  default: {
    formatOptions: {
      snippetInterface: "async-await",
    },
    paths: ["src/tests/features/"],
    dryRun: false,
    require: ["src/tests/steps/*.ts", "src/hooks/*.ts"],
    requireModule: ["ts-node/register"],
    format: [
      "progress-bar",
      "html:test-results/cucumber-report.html",
      "json:test-results/cucumber-report.json",
      "rerun:@rerun.txt",
    ],
    parallel: 1,
  },
};
