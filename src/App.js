import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import React, { useState } from "react";
import RuleTable from "src/RuleTable";
import { CONFIGS } from "./Config";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

export default ({ rules }) => {
  const classes = useStyles();
  const [configs, setConfigs] = useState(
    CONFIGS.map((config) => ({ key: config, enabled: true }))
  );

  const handleClick = (key) => () => {
    const newConfig = configs.map((c) =>
      c.key === key ? { key: c.key, enabled: !c.enabled } : c
    );
    setConfigs(newConfig);
  };

  const enabledConfigs = configs.filter((c) => c.enabled).map((c) => c.key);

  return (
    <Container maxWidth="xl">
      <Typography variant="h2" align="center">
        eslint config comparison
      </Typography>
      <Box m={2}>
        <Typography align="justify">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          pellentesque maximus sapien euismod gravida. Sed eleifend dolor non
          dui posuere, tempus tincidunt est dignissim. Ut lorem lacus, sagittis
          nec varius sit amet, dignissim sit amet lectus. Etiam blandit sodales
          justo semper tincidunt. Proin quis efficitur dui. Praesent in mattis
          turpis, a suscipit quam. Phasellus tempus feugiat vulputate. Nulla
          nisi nibh, tincidunt accumsan justo sodales, euismod vulputate sapien.
        </Typography>
      </Box>
      <Box m={2} className={classes.root}>
        {configs.map(({ key, enabled }) => (
          <Chip
            label={key}
            clickable
            color={enabled ? "primary" : ""}
            onClick={handleClick(key)}
            icon={enabled ? <DoneIcon /> : <ClearIcon />}
            variant="outlined"
          />
        ))}
      </Box>
      <RuleTable rules={rules} configs={enabledConfigs} />
    </Container>
  );
};
