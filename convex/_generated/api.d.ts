/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as boosts_mutations from "../boosts/mutations.js";
import type * as boosts_packages from "../boosts/packages.js";
import type * as boosts_queries from "../boosts/queries.js";
import type * as listings from "../listings.js";
import type * as listings_mutations from "../listings/mutations.js";
import type * as listings_queries from "../listings/queries.js";
import type * as messages_mutations from "../messages/mutations.js";
import type * as messages_queries from "../messages/queries.js";
import type * as ratings_mutations from "../ratings/mutations.js";
import type * as ratings_queries from "../ratings/queries.js";
import type * as savedListings from "../savedListings.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "boosts/mutations": typeof boosts_mutations;
  "boosts/packages": typeof boosts_packages;
  "boosts/queries": typeof boosts_queries;
  listings: typeof listings;
  "listings/mutations": typeof listings_mutations;
  "listings/queries": typeof listings_queries;
  "messages/mutations": typeof messages_mutations;
  "messages/queries": typeof messages_queries;
  "ratings/mutations": typeof ratings_mutations;
  "ratings/queries": typeof ratings_queries;
  savedListings: typeof savedListings;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
