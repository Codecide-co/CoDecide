import { t } from "@core/i18n";

export function VotingWidgetView({ reportId, upvotes, downvotes, userVote, isOwnReport, isAdmin }) {
  const upActive = userVote === "up" ? "voting-btn--active" : "";
  const downActive = userVote === "down" ? "voting-btn--active" : "";
  const disabled = isOwnReport || isAdmin ? "voting-btn--disabled" : "";
  const disabledAttr = isOwnReport || isAdmin ? "disabled" : "";
  const title = isAdmin ? t("voting.admin_disabled") : isOwnReport ? t("voting.own_report") : t("voting.upvote");

  return `
    <div class="voting-widget" data-report-id="${reportId}" data-own-report="${isOwnReport}" data-user-vote="${userVote || ""}">
      <button class="voting-btn voting-btn--up ${upActive} ${disabled}" data-vote="up" ${disabledAttr} title="${title}">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
        <span class="voting-count">${upvotes}</span>
      </button>
      <button class="voting-btn voting-btn--down ${downActive} ${disabled}" data-vote="down" ${disabledAttr} title="${title}">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        <span class="voting-count">${downvotes}</span>
      </button>
    </div>
  `;
}

export function initVotingWidget({ onVote } = {}) {
  document.querySelectorAll(".voting-widget").forEach((widget) => {
    const reportId = widget.dataset.reportId;
    const isOwnReport = widget.dataset.ownReport === "true";
    if (isOwnReport) return;

    const upBtn = widget.querySelector(".voting-btn--up");
    const downBtn = widget.querySelector(".voting-btn--down");

    async function handleVote(voteType) {
      const btn = voteType === "up" ? upBtn : downBtn;
      const otherBtn = voteType === "up" ? downBtn : upBtn;
      const countEl = btn.querySelector(".voting-count");
      const otherCountEl = otherBtn.querySelector(".voting-count");
      const prevUserVote = widget.dataset.userVote;
      const prevUp = parseInt(upBtn.querySelector(".voting-count").textContent);
      const prevDown = parseInt(downBtn.querySelector(".voting-count").textContent);

      if (prevUserVote === voteType) return;
      if (prevUserVote === "up") {
        upBtn.querySelector(".voting-count").textContent = Math.max(0, prevUp - 1);
        upBtn.classList.remove("voting-btn--active");
      } else if (prevUserVote === "down") {
        downBtn.querySelector(".voting-count").textContent = Math.max(0, prevDown - 1);
        downBtn.classList.remove("voting-btn--active");
      }

      if (prevUserVote && prevUserVote !== voteType) {
        const otherCount = parseInt(otherBtn.querySelector(".voting-count").textContent);
        otherBtn.querySelector(".voting-count").textContent = Math.max(0, otherCount - 1);
        otherBtn.classList.remove("voting-btn--active");
      }

      const currentCount = parseInt(countEl.textContent);
      countEl.textContent = currentCount + 1;
      btn.classList.add("voting-btn--active");
      widget.dataset.userVote = voteType;

      try {
        const result = await onVote(reportId, voteType);
        upBtn.querySelector(".voting-count").textContent = result.upvotes;
        downBtn.querySelector(".voting-count").textContent = result.downvotes;
        widget.dataset.userVote = result.user_vote || "";
        if (result.user_vote === "up") {
          upBtn.classList.add("voting-btn--active");
          downBtn.classList.remove("voting-btn--active");
        } else if (result.user_vote === "down") {
          downBtn.classList.add("voting-btn--active");
          upBtn.classList.remove("voting-btn--active");
        } else {
          upBtn.classList.remove("voting-btn--active");
          downBtn.classList.remove("voting-btn--active");
        }
      } catch (error) {
        upBtn.querySelector(".voting-count").textContent = prevUp;
        downBtn.querySelector(".voting-count").textContent = prevDown;
        widget.dataset.userVote = prevUserVote;
        if (prevUserVote === "up") upBtn.classList.add("voting-btn--active");
        else upBtn.classList.remove("voting-btn--active");
        if (prevUserVote === "down") downBtn.classList.add("voting-btn--active");
        else downBtn.classList.remove("voting-btn--active");
      }
    }

    upBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleVote("up");
    });

    downBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleVote("down");
    });
  });
}
