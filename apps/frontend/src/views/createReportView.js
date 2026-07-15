import { CreateReportView, initCreateReportView } from "@pages/reports/create";
import { navigateTo } from "@router/index";

export default function createReportView() {
  setTimeout(() => {
    initCreateReportView((report) => {
      sessionStorage.setItem("lastReport", JSON.stringify(report));
      navigateTo("/reports/success");
    });
  }, 0);

  return CreateReportView();
}
