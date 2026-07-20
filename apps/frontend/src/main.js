import "@/styles/index.css";
import { configureApi } from "@core/api";
import { getSessionToken, removeSession } from "@core/helpers";
import { toast } from "@core/toast";
import { router, navigateTo } from "@router/index";
import { initLangToggle } from "@core/i18n";

configureApi({
  tokenGetter: getSessionToken,
  unauthorizedHandler: (msg) => {
    removeSession();
    toast(msg || "Your session has expired. Please log in again.", "warning", 5000);
    setTimeout(() => navigateTo("/login"), 500);
  },
});

initLangToggle();
router();
