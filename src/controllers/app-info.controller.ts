import routeHandler from "express-async-handler";
import { App } from "octokit";
import { appInfoMessages } from "../constants/apimessages";
import { releasesQuery, userQuery } from "../constants/git-queries";
import { getEnv } from "../env/config";
import User from "../models/user.model";
import { ContributorInfo, ReleaseResponse } from "../types/app-info";
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

    const ghRes = await octokit.graphql<ReleaseResponse>(releasesQuery(), {
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
    });
    res.json({ message: appInfoMessages.releaseRetrieved, response: ghRes });
  }
);

/**
 * @description This method retrieves contributor info from github using the GraphQL API.
 * @method POST /api/app-info/contributor
 * @access public
 */
export const getContributor = routeHandler(
  async (
    req: TypedRequest<{ username: string }>,
    res: TypedResponse<ContributorInfo>
  ) => {
    const { OCTO_PK, OCTO_APP_ID, OCTO_INST_ID } = getEnv();
    if (!OCTO_PK) throw new Error("Config Error");

    const app = new App({ appId: OCTO_APP_ID, privateKey: OCTO_PK });
    const octokit = await app.getInstallationOctokit(OCTO_INST_ID);

    const ghRes = await octokit.graphql<ContributorInfo>(
      userQuery(req.query.username),
      { headers: { "X-GitHub-Api-Version": "2022-11-28" } }
    );
    res.json({
      message: appInfoMessages.contributorDetailsRetrieved,
      response: ghRes,
    });
  }
);

/**
 * @description This method retrieves contributor info from github using the GraphQL API.
 * @method POST /api/app-info/new-release
 * @access private
 */
export const updateUsersOnNewRelease = routeHandler(
  async (_req: TypedRequest, res: TypedResponse) => {
    const result = await User.updateMany(
      { seenChangelog: true },
      { $set: { seenChangelog: false } }
    );
    res.json({
      message: `Changelog Viewership Status of ${result.modifiedCount} user(s) is Updated.`,
    });
  }
);
