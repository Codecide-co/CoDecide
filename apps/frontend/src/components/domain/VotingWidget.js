import { voteReport } from "@services/reports.service";

export function VotingWidgetView({ reportId, upvotes, downvotes, userVote, isOwnReport }) {
  const upActive = userVote === "up" ? "voting-btn--active" : "";
  const downActive = userVote === "down" ? "voting-btn--active" : "";
  const disabled = isOwnReport ? "voting-btn--disabled" : "";

  return `
    <div class="voting-widget" data-report-id="${reportId}" data-own-report="${isOwnReport}" data-user-vote="${userVote || ""}">
      <button class="voting-btn voting-btn--up ${upActive} ${disabled}" data-vote="up" ${isOwnReport ? "disabled" : ""} title="${isOwnReport ? "Cannot vote on your own report" : "Upvote"}">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
        <span class="voting-count">${upvotes}</span>
      </button>
      <button class="voting-btn voting-btn--down ${downActive} ${disabled}" data-vote="down" ${isOwnReport ? "disabled" : ""} title="${isOwnReport ? "Cannot vote on your own report" : "Downvote"}">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        <span class="voting-count">${downvotes}</span>
      </button>
    </div>
  `;
}

export function initVotingWidget() {
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

      // Optimistic update
      if (prevUserVote === voteType) return; // same vote, no-op
      if (prevUserVote === "up") {
        upBtn.querySelector(".voting-count").textContent = Math.max(0, prevUp - 1);
        upBtn.classList.remove("voting-btn--active");
      } else if (prevUserVote === "down") {
        downBtn.querySelector(".voting-count").textContent = Math.max(0, prevDown - 1);
        downBtn.classList.remove("voting-btn--active");
      }

      if (prevUserVote === voteType) return;

      if (prevUserVote && prevUserVote !== voteType) {
        // Changing vote: remove one from other, add one to new
        const otherCount = parseInt(otherBtn.querySelector(".voting-count").textContent);
        otherBtn.querySelector(".voting-count").textContent = Math.max(0, otherCount - 1);
        otherBtn.classList.remove("voting-btn--active");
      }

      const currentCount = parseInt(countEl.textContent);
      countEl.textContent = currentCount + 1;
      btn.classList.add("voting-btn--active");
      widget.dataset.userVote = voteType;

      try {
        const result = await voteReport(reportId, voteType);
        // Sync with server response
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
        // Revert on error
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
