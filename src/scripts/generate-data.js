const { ESLint } = require("eslint");
const fs = require("fs").promises;

async function getRules(extendsConfig) {
  const eslint = new ESLint({
    overrideConfig: {
      extends: extendsConfig,
    },
  });

  const config = await eslint.calculateConfigForFile("index.js");
  return Object.fromEntries(
    Object.entries(config.rules).map(([key, value]) => [key, value[0]])
  );
}

const configs = [
  "airbnb-base",
  "eslint:recommended",
  "google",
  "standard",
  "xo",
  "xo/esnext",
  "wikimedia",
  "wikimedia/server",
  "plugin:@shopify/esnext",
];

(async function main() {
  const mergedRules = {};

  for (const config of configs) {
    const rules = await getRules([config]);

    Object.entries(rules).forEach(([key, value]) => {
      mergedRules[key] = {
        ...(mergedRules[key] || {}),
        [config]: getValue(value),
      };
    });
  }

  const output = [
    ...Object.entries(mergedRules).map(([key, values]) => ({
      key,
      ...configs.reduce(
        (result, config) => ({ ...result, [config]: values[config] || 0 }),
        {}
      ),
    })),
  ];

  await fs.writeFile("data/data.json", JSON.stringify(output));
})();

function getValue(value) {
  switch (value) {
    case "off":
      return 0;
    case "warn":
      return 1;
    case "error":
      return 2;

    default:
      return value;
  }
}
