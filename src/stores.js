import { configureStore } from "@reduxjs/toolkit";
import shareSlice from "./shares/shareSlice";
import adminSlice from "./modules/admin/adminSlice";
import userSlice from "./modules/user/userSlice";
import regionSlice from "./modules/region/regionSlice";
import dashboardSlice from "./modules/dashboard/dashboardSlice";
import settingSlice from "./modules/setting/settingSlice";
import countrySlice from "./modules/country/countrySlice";
import regionAndStateSlice from "./modules/regionAndState/regionAndStateSlice";
import citySlice from "./modules/city/citySlice";
import townshipSlice from "./modules/township/townshipSlice";

export const stores = configureStore({
   reducer: {

    share: shareSlice,
    admin: adminSlice,
    user: userSlice,
    region: regionSlice,
    dashboard: dashboardSlice,
    setting: settingSlice,
    country: countrySlice,
    regionAndState: regionAndStateSlice,
    city: citySlice,
    township: townshipSlice
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false
  })

})