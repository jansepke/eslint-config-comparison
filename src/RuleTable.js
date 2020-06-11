import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import rows from "data/data.json";
import React, { useState } from "react";

function descendingComparator(a, b, orderBy) {
  if (orderBy === "key") {
    if (b.key.includes("/") && !a.key.includes("/")) {
      return 1;
    }
    if (!b.key.includes("/") && a.key.includes("/")) {
      return -1;
    }
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "key",
    label: "eslint rule name",
  },
  { id: "airbnb-base", label: "airbnb-base" },
  { id: "eslint:recommended", label: "eslint:recommended" },
  { id: "google", label: "google" },
  { id: "standard", label: "standard" },
  { id: "xo", label: "xo" },
  { id: "xo/esnext", label: "xo/esnext" },
  { id: "wikimedia", label: "wikimedia" },
  { id: "wikimedia/server", label: "wikimedia/server" },
  { id: "plugin:@shopify/esnext", label: "@shopify/esnext" },
];

export default () => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("key");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id}>
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map(
              (row, index) => (
                <TableRow hover key={row.key}>
                  {headCells.map((headCell) => (
                    <TableCell key={headCell.id}>{row[headCell.id]}</TableCell>
                  ))}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
