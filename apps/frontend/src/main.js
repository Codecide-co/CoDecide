import "@/styles/index.css";
import { configureApi } from "@core/api";
import { getSessionToken } from "@core/helpers";
import { router } from "@router/index";

configureApi({ tokenGetter: getSessionToken });

router();
