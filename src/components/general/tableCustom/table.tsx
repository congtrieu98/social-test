import React from "react";
import { Table } from "antd";
import PropTypes from "prop-types";

const TableCustom = ({ ...props }) => {
  const { columns } = props;
  const columnsFil = columns?.filter(
    (col: { hideInTable: any }) => !col?.hideInTable
  );
  delete props.columns;
  return <Table columns={columnsFil} size="small" {...props} />;
};

TableCustom.propTypes = {
  columns: PropTypes.array,
};
export default TableCustom;
