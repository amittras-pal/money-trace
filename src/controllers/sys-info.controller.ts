import routeHandler from "express-async-handler";
import { MongoClient } from "mongodb";
import { App } from "octokit";
import { appInfoMessages } from "../constants/apimessages";
import { releasesQuery, userQuery } from "../constants/git-queries";
import { getEnv } from "../env/config";
import User from "../models/user.model";
import { ContributorInfo, ReleaseResponse } from "../types/app-info";
import { TypedRequest, TypedResponse } from "../types/requests";
import { cloneCollection } from "../utils/system";

/**
 * @description This method retrieves the list of releases from github for the repository using the GraphQL API.
 * @method POST /api/sys-info/changelog
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
 * @method POST /api/sys-info/contributor
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
 * @method POST /api/sys-info/new-release
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

/**
 * @description This method clones the data in the "prod" database into the "dev" database.
 * @method POST /api/sys-info/backup
 * @access private
 */
export const dataBackup = routeHandler(
  async (_req: TypedRequest, _res: TypedResponse) => {
    const { DB_URI } = getEnv();
    const url = new URL(DB_URI ?? "");
    url.searchParams.set("authSource", "admin");
    const clientUrl = `${url.protocol}//${url.username}:${url.password}@${
      url.hostname
    }/?${url.searchParams.toString()}`;

    const client = new MongoClient(clientUrl);
    await client.connect();

    const prod = client.db("ts-prod");
    const dev = client.db("ts-dev");

    const collections = [
      "budgets",
      "categories",
      "expenseplans",
      "expenses",
      "users",
    ];

    const results = await Promise.all(
      collections.map((coll) => cloneCollection(prod, dev, coll))
    );

    await client.close();

    _res.json({ message: "Data Cloned to 'dev' database", response: results });
  }
);
