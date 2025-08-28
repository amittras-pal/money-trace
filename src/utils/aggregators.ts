import dayjs from "dayjs";
import { padStart } from "lodash";
import { PipelineStage, Types } from "mongoose";
import { IUser } from "../types/user";
import {
  IListReqBody,
  IReportRequest,
  ISearchReqBody,
  ISummaryReqParams,
  MonthTrendRequest,
  YearTrendRequest,
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

export function monthSummaryAggregator(
  request: ISummaryReqParams,
  user: string
) {
  const filter: PipelineStage.Match = {
    $match: {
      $and: [
        { user: new Types.ObjectId(user) },
        { reverted: false },
        { plan: request.plan ? new Types.ObjectId(request.plan) : null },
      ],
    },
  };
  if (request.startDate?.length && request.endDate?.length)
    filter.$match.$and?.push({
      date: {
        $gte: new Date(request.startDate),
        $lte: new Date(request.endDate),
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

export function yearTrendAggregator(req: YearTrendRequest, user: IUser | null) {
  const prepareDocuments: PipelineStage[] = [
    {
      $match: {
        $and: [
          { user: new Types.ObjectId(req.userId) },
          { plan: null },
          { reverted: false },
          {
            date: {
              $gte: dayjs(req.query.year).tz(user?.timeZone).toDate(),
              $lte: dayjs(req.query.year)
                .tz(user?.timeZone)
                .endOf("year")
                .toDate(),
            },
          },
        ],
      },
    },
    {
      $addFields: {
        month: { $month: { date: "$date", timezone: user?.timeZone } },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
  ];

  const groupByCategory: PipelineStage[] = [
    {
      $group: {
        _id: {
          category: "$category.group",
          color: "$category.color",
          month: "$month",
        },
        amount: { $sum: "$amount" },
        items: { $count: {} },
      },
    },
    {
      $project: {
        _id: 0,
        amount: 1,
        items: 1,
        name: "$_id.category",
        month: "$_id.month",
        color: "$_id.color",
      },
    },
  ];

  const groupByMonth: PipelineStage[] = [
    {
      $group: {
        _id: "$month",
        total: { $sum: "$amount" },
        categories: { $addToSet: "$$ROOT" },
      },
    },
    { $project: { "categories.month": 0 } },
  ];

  const prepareOutput: PipelineStage[] = [
    { $sort: { _id: 1 } },
    {
      $project: {
        month: "$_id",
        _id: 0,
        total: 1,
        categories: 1,
      },
    },
  ];

  return [
    ...prepareDocuments,
    ...groupByCategory,
    ...groupByMonth,
    ...prepareOutput,
  ];
}

export function monthTrendAggregator(
  req: MonthTrendRequest,
  user: IUser | null
) {
  const { month, year } = req.query;
  const dateStr = `${year}-${padStart(month, 2, "0")}-01`;
  const prepareDocuments: PipelineStage[] = [
    {
      $match: {
        $and: [
          { user: new Types.ObjectId(req.userId) },
          { plan: null },
          { reverted: false },
          {
            date: {
              $gte: dayjs(dateStr).startOf("month").toDate(),
              $lte: dayjs(dateStr).endOf("month").toDate(),
            },
          },
        ],
      },
    },
    {
      $addFields: {
        month: { $month: { date: "$date", timezone: user?.timeZone } },
        dayOfMonth: {
          $dayOfMonth: { date: "$date", timezone: user?.timeZone },
        },
      },
    },
  ];

  const groupByDate: PipelineStage.Group = {
    $group: {
      _id: "$dayOfMonth",
      amount: { $sum: "$amount" },
      items: { $count: {} },
    },
  };

  const prepareOutput: PipelineStage[] = [
    { $project: { day: "$_id", amount: 1, items: 1, _id: 0 } },
    { $sort: { day: 1 } },
  ];

  return [...prepareDocuments, groupByDate, ...prepareOutput];
}

export function budgetsOfYearAggregator(req: YearTrendRequest) {
  return [
    {
      $match: {
        user: new Types.ObjectId(req.userId),
        year: parseInt(req.query.year),
      },
    },
    { $addFields: { month: { $sum: ["$month", 1] } } },
    { $project: { month: 1, amount: 1, remarks: 1, _id: 0 } },
  ];
}
