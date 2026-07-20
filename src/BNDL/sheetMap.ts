import { lazy } from "react";

/**
 * A mapping of sheet slugs to their respective lazy-loaded components.
 * This object is used to look up components at runtime based on the slug.
 */
const sheetComponentMap = {

    history: {
        component: lazy(() => import("./BNDL_dashboard/CANV_dashboard/WRPR_desk/sheets/history")),
    },
    gdp: {
        component: lazy(() => import("./BNDL_dashboard/CANV_dashboard/WRPR_desk/sheets/gdp")),
    },
    modules: {
        component: lazy(() => import("./BNDL_dashboard/CANV_dashboard/WRPR_desk/sheets/modules")),
    },
    priority: {
        component: lazy(() => import("./BNDL_dashboard/CANV_dashboard/WRPR_desk/sheets/priority")),
    },
    normal: {
        component: lazy(() => import("./BNDL_Table/CANV_table/WRPR_desk/sheets/table_Linear_normal")),
        auxiliary: lazy(() => import("./BNDL_Table/CANV_table/WRPR_desk/sheets/table_Linear_normal/assistance")),
    },

};


export default sheetComponentMap