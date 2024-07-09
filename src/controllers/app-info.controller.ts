import routeHandler from "express-async-handler";
import { App } from "octokit";
import { releasesQuery } from "../constants/gql";
import { getEnv } from "../env/config";
import { ReleaseResponse } from "../types/changelog";
import { TypedRequest, TypedResponse } from "../types/requests";

/**
 * @description This method retrieves the list of releases from github for the repository using the GraphQL API.
 * @method POST /api/app-info/changelog
 * @access public
 */
export const getChangelog = routeHandler(
  async (_req: TypedRequest, res: TypedResponse<ReleaseResponse>) => {
    const { OCTO_PK, OCTO_APP_ID, OCTO_INST_ID } = getEnv();
    if (!OCTO_PK) throw new Error("Config Error");

    const app = new App({ appId: OCTO_APP_ID, privateKey: OCTO_PK });
    const octokit = await app.getInstallationOctokit(OCTO_INST_ID);

    const ghRes = await octokit.graphql<ReleaseResponse>(releasesQuery, {
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
    });
    res.json({ message: "Releases Retrieved", response: ghRes });
  }
);
