import { ESLint } from "eslint";
import yaml from "js-yaml";
import Head from "next/head";
import React from "react";
import App from "src/App";

export default ({ rules }) => (
  <>
    <Head>
      <title>eslint config comparison</title>
    </Head>
    <App rules={rules} />
  </>
);

const configs = [
  "eslint:recommended",
  "airbnb-base",
  "google",
  "standard",
  "xo",
  "xo/esnext",
  "wikimedia",
  "wikimedia/server",
  "plugin:@shopify/esnext",
];

export async function getStaticProps() {
  const eslintRulesYaml = await (
    await fetch(
      "https://raw.githubusercontent.com/eslint/website/master/_data/rules.yml"
    )
  ).text();

  const eslintRules = await yaml.safeLoad(eslintRulesYaml);

  let highestCategory = 0;

  const flattenedRules = [
    ...eslintRules.categories,
    eslintRules.deprecated,
  ].reduce((acc, { description, name, rules }, categoryId) => {
    highestCategory = categoryId;
    return [
      ...acc,
      { description, name, categoryId: highestCategory },
      ...rules.map((rule) => ({
        ...rule,
        parentId: highestCategory,
      })),
    ];
  }, []);

  for (const config of configs) {
    const rules = await getRules([config]);

    Object.entries(rules).forEach(([key, value]) => {
      const existingRule = flattenedRules.find((rule) => rule.name === key);
      const ruleValue = getValue(value);
      if (ruleValue !== 0) {
        if (existingRule) {
          existingRule[config] = ruleValue;
          const existingCategory = flattenedRules.find(
            (rule) => rule.categoryId === existingRule.parentId
          );
          existingCategory[config] = (existingCategory[config] || 0) + 1;
        } else {
          if (key.includes("/")) {
            const category = key.split("/")[0];
            const existingCategory = flattenedRules.find(
              (rule) => rule.name === category
            );

            if (!existingCategory) {
              highestCategory = highestCategory + 1;

              flattenedRules.push(
                {
                  name: category,
                  categoryId: highestCategory,
                  [config]: 1,
                },
                {
                  name: key,
                  [config]: ruleValue,
                  parentId: highestCategory,
                }
              );
            } else {
              existingCategory[config] = (existingCategory[config] || 0) + 1;
              flattenedRules.push({
                name: key,
                [config]: ruleValue,
                parentId: existingCategory.categoryId,
              });
            }
          } else {
            flattenedRules.push({
              name: key,
              [config]: ruleValue,
            });
          }
        }
      }
    });
  }

  return {
    props: {
      rules: flattenedRules,
    },
  };
}

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
