#!/usr/bin/env bash
set -euo pipefail

ERRORS=0
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}✓${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; ERRORS=$((ERRORS + 1)); }

section() {
  echo ""
  echo "==> $1"
}

is_single_line_message() {
  local msg="$1"
  [[ "$msg" != *$'\n'* ]] && [[ "$msg" != *$'\r'* ]]
}

if [ "$BUILD_REASON" = "PullRequest" ]; then
  BRANCH_NAME="${SYSTEM_PULLREQUEST_SOURCEBRANCH#refs/heads/}"
  TARGET_BRANCH="${SYSTEM_PULLREQUEST_TARGETBRANCH#refs/heads/}"
  PR_NUMBER="${SYSTEM_PULLREQUEST_PULLREQUESTID}"
else
  BRANCH_NAME="${BUILD_SOURCEBRANCH#refs/heads/}"
  TARGET_BRANCH="${BUILD_SOURCEBRANCH#refs/heads/}"
  PR_NUMBER=""
fi

echo "Branch:       $BRANCH_NAME"
echo "Target:       $TARGET_BRANCH"
echo "PR Number:    $PR_NUMBER"
echo ""

if [ -n "$PR_NUMBER" ] && [ -n "$TARGET_BRANCH" ]; then
  git fetch origin "$TARGET_BRANCH" 2>/dev/null || true
  LOG_RANGE="origin/$TARGET_BRANCH..HEAD"
else
  LOG_RANGE="-10"
fi

section "1. Branch name validation"

BRANCH_REGEX='^(feature|feat|fix|refactor|chore|docs)\/[a-z0-9]+(-[a-z0-9]+)*$'

if [[ "$BRANCH_NAME" =~ $BRANCH_REGEX ]]; then
  pass "Branch name matches convention: <type>/<short-description>"
else
  fail "Branch name '$BRANCH_NAME' does not match allowed types: feature|feat|fix|refactor|chore|docs"
fi

section "2. Conventional commits check"

COMMIT_REGEX='^(feat|fix|refactor|style|docs|chore|test|perf)(\([a-z0-9_-]+\))?:\ .+$'

HAS_CONVENTIONAL=true
while IFS= read -r -d '' HASH && IFS= read -r -d '' MSG; do
  [ -z "$HASH" ] && continue

  if ! is_single_line_message "$MSG"; then
    fail "Commit ${HASH:0:7}: multiline commit message is not allowed"
    HAS_CONVENTIONAL=false
    continue
  fi

  if ! echo "$MSG" | grep -qE "$COMMIT_REGEX"; then
    fail "Commit ${HASH:0:7}: '$MSG'"
    HAS_CONVENTIONAL=false
  fi
done < <(git log "$LOG_RANGE" --format="%H%x00%B%x00" 2>/dev/null || true)

if [ "$HAS_CONVENTIONAL" = true ]; then
  while IFS= read -r -d '' HASH && IFS= read -r -d '' MSG; do
    [ -z "$HASH" ] && continue
    pass "Commit ${HASH:0:7}: $MSG"
  done < <(git log "$LOG_RANGE" --format="%H%x00%B%x00" 2>/dev/null || true)
fi

section "3. Commit size validation"

MAX_FILES=15
while IFS= read -r -d '' HASH && IFS= read -r -d '' MSG; do
  [ -z "$HASH" ] && continue
  FILES_CHANGED=$(git diff-tree --no-commit-id --name-only -r "$HASH" 2>/dev/null | wc -l)
  if [ "$FILES_CHANGED" -gt "$MAX_FILES" ]; then
    fail "Commit ${HASH:0:7}: $FILES_CHANGED files changed (max $MAX_FILES)"
  else
    pass "Commit ${HASH:0:7}: $FILES_CHANGED files"
  fi
done < <(git log "$LOG_RANGE" --format="%H%x00%B%x00" 2>/dev/null || true)

echo ""
echo "=============================================="
if [ "$ERRORS" -gt 0 ]; then
  echo -e "  ${RED}Validation FAILED: $ERRORS error(s)${NC}"
  echo "=============================================="
  exit 1
else
  echo -e "  ${GREEN}All validations passed${NC}"
  echo "=============================================="
  exit 0
fi
