import { ESLint } from "eslint";
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

export async function getStaticProps() {
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

  return {
    props: {
      rules: output,
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
