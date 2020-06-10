import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import React from "react";
import RuleTable from "RuleTable";

export default () => (
  <Container maxWidth="lg">
    <Typography variant="h2" align="center">
      eslint config comparison
    </Typography>
    <Box m={2}>
      <Typography align="justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
        pellentesque maximus sapien euismod gravida. Sed eleifend dolor non dui
        posuere, tempus tincidunt est dignissim. Ut lorem lacus, sagittis nec
        varius sit amet, dignissim sit amet lectus. Etiam blandit sodales justo
        semper tincidunt. Proin quis efficitur dui. Praesent in mattis turpis, a
        suscipit quam. Phasellus tempus feugiat vulputate. Nulla nisi nibh,
        tincidunt accumsan justo sodales, euismod vulputate sapien.
      </Typography>
    </Box>
    <RuleTable />
  </Container>
);
