import { AgGridReact } from "ag-grid-react";
import React from "react";
import "./AgGridMod.scss";
import { ColumnHeader, NoDataOverlay } from "./plugins/components";

/**
 * Central Mod for Ag Grid community, Material Theme.
 * @param {import("ag-grid-react").AgGridReactProps} param0
 * @returns
 */
export default function AgGridMod({ height, ...props }) {
  return (
    <div
      className="ag-theme-material mtrace-ag-mod"
      style={{ width: "100%", height }}
    >
      <AgGridReact
        rowHeight={60}
        headerHeight={60}
        animateRows={false}
        noRowsOverlayComponent={NoDataOverlay}
        defaultColDef={{
          flex: 1,
          resizable: true,
          headerComponent: ColumnHeader,
        }}
        {...props}
      />
    </div>
  );
}
