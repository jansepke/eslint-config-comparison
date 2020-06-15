import { ESLint } from "eslint";
import yaml from "js-yaml";
import Head from "next/head";
import React from "react";
import App from "src/App";
import { CONFIGS } from "src/Config";

export default ({ rules }) => (
  <>
    <Head>
      <title>eslint config comparison</title>
    </Head>
    <App rules={rules} />
  </>
);

export async function getStaticProps() {
  const eslintRulesYaml = await (
    await fetch(
      "https://raw.githubusercontent.com/eslint/website/master/_data/rules.yml"
    )
  ).text();

  const eslintRules = await yaml.safeLoad(eslintRulesYaml);

  const categoryData = [...eslintRules.categories, eslintRules.deprecated].map(
    ({ description, name }, categoryId) => ({
      description,
      name,
      categoryId,
    })
  );

  const ruleData = [
    ...eslintRules.categories,
    eslintRules.deprecated,
  ].flatMap(({ rules }, categoryId) =>
    rules.map((rule) => ({ ...rule, parentId: categoryId }))
  );

  let highestCategory = categoryData.length - 1;

  const rules = [];

  for (const config of CONFIGS) {
    const configRules = await getRules([config]);

    Object.entries(configRules).forEach(([key, value]) => {
      const existingRuleData = ruleData.find((rule) => rule.name === key);
      const existingRule = rules.find((rule) => rule.name === key);
      const ruleValue = getValue(value);

      if (ruleValue !== 0) {
        if (existingRule) {
          // existing rule will be updated
          existingRule[config] = ruleValue;
          const existingCategory = rules.find(
            (rule) => rule.categoryId === existingRule.parentId
          );
          existingCategory[config] = (existingCategory[config] || 0) + 1;
        } else {
          const category = key.split("/")[0];
          const existingCategory = rules.find(
            (rule) =>
              rule.name === category ||
              (existingRuleData && existingRuleData.parentId == rule.categoryId)
          );

          if (existingCategory) {
            // new rule will be added to existing category
            existingCategory[config] = (existingCategory[config] || 0) + 1;
            rules.push({
              name: key,
              [config]: ruleValue,
              description: existingRuleData?.description ?? null,
              parentId: existingCategory.categoryId,
            });
          } else if (existingRuleData) {
            // new standard rule and category will be added
            const existingCategoryData = categoryData.find(
              (rule) => rule.categoryId === existingRuleData.parentId
            );
            rules.push(
              {
                ...existingCategoryData,
                [config]: 1,
              },
              {
                name: key,
                [config]: ruleValue,
                description: existingRuleData.description ?? null,
                parentId: existingCategoryData.categoryId,
              }
            );
          } else {
            // new plugin rule and category will be added
            highestCategory = highestCategory + 1;

            rules.push(
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
          }
        }
      }
    });
  }

  const sortedRules = rules.sort(
    (a, b) => (a.categoryId || a.parentId) - (b.categoryId || b.parentId)
  );

  return {
    props: {
      rules: sortedRules,
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
