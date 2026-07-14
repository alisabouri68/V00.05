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

    sheet_1: {
        component: lazy(() => import("./BNDL_medical/CANV_medical/WRPR_desk/sheets/sheet1")),
        auxiliary: lazy(() => import("./BNDL_medical/CANV_medical/WRPR_desk/sheets/sheet1/assistance")),
    },
    sheet_2: {
        component: lazy(() => import("./BNDL_medical/CANV_medical/WRPR_desk/sheets/sheet2")),
    },
    sheet_3: {
        component: lazy(() => import("./BNDL_medical/CANV_medical/WRPR_desk/sheets/sheet3")),
    },
    sheet_4: {
        component: lazy(() => import("./BNDL_medical/CANV_medical/WRPR_desk/sheets/sheet4")),
    },
};


export default sheetComponentMap