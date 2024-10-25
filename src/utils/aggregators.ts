import { PipelineStage, Types } from "mongoose";
import {
  IListReqBody,
  IReportRequest,
  ISearchReqBody,
  ISummaryReqParams,
} from "../types/utility";

export function searchAggregator(request: ISearchReqBody, user: string) {
  const filter: PipelineStage.Match = {
    $match: { $and: [{ user: new Types.ObjectId(user) }, { plan: null }] },
  };

  const unwindCategories: PipelineStage.Unwind = { $unwind: "$category" };
  const loadCategories: PipelineStage.Lookup = {
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "category",
    },
  };

  const query: PipelineStage[] = [filter, loadCategories, unwindCategories];

  // Add Date Ranges
  if (request.startDate && request.endDate)
    filter.$match.$and?.push({
      date: {
        $gte: new Date(request.startDate),
        $lte: new Date(request.endDate),
      },
    });

  // Apply sort (defaults to date descending)
  const sort: PipelineStage.Sort = { $sort: { date: -1 } };
  if (request.sort) sort.$sort = request.sort;
  query.push(sort);

  // Add Categories
  if (request.categories?.length)
    filter.$match.$and?.push({
      categoryId: {
        $in: [...request.categories.map((c) => new Types.ObjectId(c))],
      },
    });

  // Add Search Query
  if (request.q)
    query.unshift({
      $search: {
        index: "expense_search",
        text: {
          query: request.q ?? "",
          path: ["title", "description"],
        },
      },
    });

  return query;
}

export function listAggregator(request: IListReqBody, user: string) {
  const matchPhase: PipelineStage.Match = {
    $match: {
      $and: [
        { user: new Types.ObjectId(user) },
        { plan: request.plan ? new Types.ObjectId(request.plan) : null },
      ],
    },
  };

  // Add start/end date and plan if available.
  if (request.startDate?.length && request.endDate?.length)
    matchPhase.$match.$and?.push({
      date: {
        $gte: new Date(request.startDate),
        $lte: new Date(request.endDate),
      },
    });

  const sortPhase: PipelineStage.Sort = { $sort: request.sort };
  const unwindPhase: PipelineStage.Unwind = { $unwind: "$category" };
  const lookupPhase: PipelineStage.Lookup = {
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "category",
    },
  };

  return [matchPhase, lookupPhase, unwindPhase, sortPhase];
}

export function SummaryAggregator(request: ISummaryReqParams, user: string) {
  const filter: PipelineStage.Match = {
    $match: {
      $and: [
        { user: new Types.ObjectId(user) },
        { reverted: false },
        { plan: request.plan ? new Types.ObjectId(request.plan) : null },
      ],
    },
  };
  if (request.firstDay?.length && request.lastDay?.length)
    filter.$match.$and?.push({
      date: {
        $gte: new Date(request.firstDay),
        $lte: new Date(request.lastDay),
      },
    });

  const group: PipelineStage.Group = {
    $group: { _id: "$categoryId", value: { $sum: "$amount" } },
  };

  const lookup: PipelineStage.Lookup = {
    $lookup: {
      from: "categories",
      localField: "_id",
      foreignField: "_id",
      as: "category",
    },
  };

  const unwind: PipelineStage.Unwind = { $unwind: "$category" };
  const sort: PipelineStage.Sort = { $sort: { value: -1 } };

  const projection: PipelineStage.Project[] = [
    {
      $project: {
        _id: false,
        amounts: false,
        "category._id": false,
        "category.__v": false,
      },
    },
    {
      $project: {
        value: "$value",
        label: "$category.label",
        color: "$category.color",
        group: "$category.group",
        icon: "$category.icon",
      },
    },
  ];

  return [filter, group, lookup, sort, unwind, ...projection];
}

export function reportExpenseAggregator(request: IReportRequest, user: string) {
  const search: PipelineStage.Match = {
    $match: {
      user: new Types.ObjectId(user),
      plan: null,
      date: {
        $gte: new Date(request.startDate),
        $lte: new Date(request.endDate),
      },
    },
  };
  const dateSort: PipelineStage.Sort = { $sort: { date: 1 } };
  const groupByMonth: PipelineStage.Group = {
    $group: {
      _id: { $substrCP: ["$date", 0, 7] },
      expenses: { $push: "$$ROOT" },
      total: { $sum: "$amount" },
    },
  };
  const monthSort: PipelineStage.Sort = { $sort: { _id: 1 } };
  const categoryLookup: PipelineStage.Lookup = {
    $lookup: {
      from: "categories",
      localField: "expenses.categoryId",
      foreignField: "_id",
      as: "categories",
    },
  };

  return [search, dateSort, groupByMonth, monthSort, categoryLookup];
}

export function budgetAggregator(request: IReportRequest, user: string) {
  const search: PipelineStage.Match = {
    $match: {
      user: new Types.ObjectId(user),
      month: {
        $gte: new Date(request.startDate).getMonth() - 1,
        $lte: new Date(request.endDate).getMonth() + 1,
      },
      year: {
        $gte: new Date(request.startDate).getFullYear(),
        $lte: new Date(request.endDate).getFullYear(),
      },
    },
  };
  const project: PipelineStage.Project = {
    $project: { _id: false, user: false, __v: false },
  };

  return [search, project];
}
