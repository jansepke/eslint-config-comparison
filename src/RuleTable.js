import Link from "@material-ui/core/Link";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import Search from "@material-ui/icons/Search";
import MaterialTable from "material-table";
import React, { forwardRef } from "react";

const renderIcon = (column) => (rowData) => {
  if (rowData.categoryId !== undefined) {
    return "";
  }

  switch (rowData[column]) {
    case undefined:
    case 0:
      return "-";
    case 1:
      return <ErrorOutlineIcon />;
    case 2:
      return <CancelOutlinedIcon />;

    default:
      return rowData[column];
  }
};

const renderLink = (rowData) =>
  rowData.categoryId === undefined && !rowData.name.includes("/") ? (
    <Link
      href={`https://eslint.org/docs/rules/${rowData.name}`}
      target="_blank"
      rel="noopener"
    >
      {rowData.name}
    </Link>
  ) : (
    rowData.name
  );

const renderDescription = (rowData) =>
  rowData.description?.replace(/\<[^)]*?\> */g, "").replace(/:$/g, "");

const columns = [
  {
    field: "name",
    title: "Category / Name",
    render: renderLink,
  },
  { field: "description", title: "Description", render: renderDescription },
  {
    field: "eslint:recommended",
    title: "eslint :recommended",
    render: renderIcon("eslint:recommended"),
  },
  {
    field: "airbnb-base",
    title: "airbnb-base",
    render: renderIcon("airbnb-base"),
  },
  { field: "google", title: "google", render: renderIcon("google") },
  { field: "standard", title: "standard", render: renderIcon("standard") },
  { field: "xo", title: "xo", render: renderIcon("xo") },
  { field: "xo/esnext", title: "xo /esnext", render: renderIcon("xo/esnext") },
  { field: "wikimedia", title: "wikimedia", render: renderIcon("wikimedia") },
  {
    field: "wikimedia/server",
    title: "wikimedia /server",
    render: renderIcon("wikimedia/server"),
  },
  {
    field: "plugin:@shopify/esnext",
    title: "@shopify /esnext",
    render: renderIcon("plugin:@shopify/esnext"),
  },
];

const tableIcons = {
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
};

export default ({ rules }) => {
  const categories = rules.filter((rule) => rule.categoryId !== undefined);

  return (
    <MaterialTable
      options={{
        showTitle: false,
        draggable: false,
        paging: false,
        sorting: false,
        debounceInterval: 500,
      }}
      icons={tableIcons}
      data={rules}
      columns={columns}
      parentChildData={(row, rows) =>
        row.parentId !== undefined ? categories[row.parentId] : undefined
      }
    />
  );
};
