import { useQuery } from "react-query";
import { getChangelog } from "../api/changelog.api";
import { APP_VERSION } from "../constants/app.constants";

export function useChangelog(options) {
  return useQuery(
    ["changelog", APP_VERSION],
    () => getChangelog(APP_VERSION),
    options
  );
}
