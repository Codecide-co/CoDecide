import { RegisterView, initRegisterView } from "@pages/auth/register.view";
import { navigateTo } from "@/utils/navigate.js";

export default function registerView() {
  setTimeout(() => initRegisterView(() => navigateTo("/")), 0);
  return RegisterView();
}
