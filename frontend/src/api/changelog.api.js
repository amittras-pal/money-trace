import axios from "../config/axios.config";
import endpoints from "../constants/endpoints";

export function getChangelog(version) {
  return axios.get(endpoints.CHANGELOG, { params: { version } });
}
