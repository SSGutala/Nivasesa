
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Listing
 * 
 */
export type Listing = $Result.DefaultSelection<Prisma.$ListingPayload>
/**
 * Model Photo
 * 
 */
export type Photo = $Result.DefaultSelection<Prisma.$PhotoPayload>
/**
 * Model Roommate
 * 
 */
export type Roommate = $Result.DefaultSelection<Prisma.$RoommatePayload>
/**
 * Model Availability
 * 
 */
export type Availability = $Result.DefaultSelection<Prisma.$AvailabilityPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Listings
 * const listings = await prisma.listing.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Listings
   * const listings = await prisma.listing.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.listing`: Exposes CRUD operations for the **Listing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Listings
    * const listings = await prisma.listing.findMany()
    * ```
    */
  get listing(): Prisma.ListingDelegate<ExtArgs>;

  /**
   * `prisma.photo`: Exposes CRUD operations for the **Photo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Photos
    * const photos = await prisma.photo.findMany()
    * ```
    */
  get photo(): Prisma.PhotoDelegate<ExtArgs>;

  /**
   * `prisma.roommate`: Exposes CRUD operations for the **Roommate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roommates
    * const roommates = await prisma.roommate.findMany()
    * ```
    */
  get roommate(): Prisma.RoommateDelegate<ExtArgs>;

  /**
   * `prisma.availability`: Exposes CRUD operations for the **Availability** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Availabilities
    * const availabilities = await prisma.availability.findMany()
    * ```
    */
  get availability(): Prisma.AvailabilityDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Listing: 'Listing',
    Photo: 'Photo',
    Roommate: 'Roommate',
    Availability: 'Availability'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "listing" | "photo" | "roommate" | "availability"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Listing: {
        payload: Prisma.$ListingPayload<ExtArgs>
        fields: Prisma.ListingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ListingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ListingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          findFirst: {
            args: Prisma.ListingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ListingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          findMany: {
            args: Prisma.ListingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>[]
          }
          create: {
            args: Prisma.ListingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          createMany: {
            args: Prisma.ListingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ListingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>[]
          }
          delete: {
            args: Prisma.ListingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          update: {
            args: Prisma.ListingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          deleteMany: {
            args: Prisma.ListingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ListingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ListingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListingPayload>
          }
          aggregate: {
            args: Prisma.ListingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateListing>
          }
          groupBy: {
            args: Prisma.ListingGroupByArgs<ExtArgs>
            result: $Utils.Optional<ListingGroupByOutputType>[]
          }
          count: {
            args: Prisma.ListingCountArgs<ExtArgs>
            result: $Utils.Optional<ListingCountAggregateOutputType> | number
          }
        }
      }
      Photo: {
        payload: Prisma.$PhotoPayload<ExtArgs>
        fields: Prisma.PhotoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PhotoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PhotoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          findFirst: {
            args: Prisma.PhotoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PhotoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          findMany: {
            args: Prisma.PhotoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>[]
          }
          create: {
            args: Prisma.PhotoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          createMany: {
            args: Prisma.PhotoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PhotoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>[]
          }
          delete: {
            args: Prisma.PhotoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          update: {
            args: Prisma.PhotoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          deleteMany: {
            args: Prisma.PhotoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PhotoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PhotoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          aggregate: {
            args: Prisma.PhotoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePhoto>
          }
          groupBy: {
            args: Prisma.PhotoGroupByArgs<ExtArgs>
            result: $Utils.Optional<PhotoGroupByOutputType>[]
          }
          count: {
            args: Prisma.PhotoCountArgs<ExtArgs>
            result: $Utils.Optional<PhotoCountAggregateOutputType> | number
          }
        }
      }
      Roommate: {
        payload: Prisma.$RoommatePayload<ExtArgs>
        fields: Prisma.RoommateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoommateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoommatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoommateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoommatePayload>
          }
          findFirst: {
            args: Prisma.RoommateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoommatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoommateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoommatePayload>
          }
          findMany: {
            args: Prisma.RoommateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoommatePayload>[]
          }
          create: {
            args: Prisma.RoommateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoommatePayload>
          }
          createMany: {
            args: Prisma.RoommateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoommateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoommatePayload>[]
          }
          delete: {
            args: Prisma.RoommateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoommatePayload>
          }
          update: {
            args: Prisma.RoommateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoommatePayload>
          }
          deleteMany: {
            args: Prisma.RoommateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoommateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RoommateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoommatePayload>
          }
          aggregate: {
            args: Prisma.RoommateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoommate>
          }
          groupBy: {
            args: Prisma.RoommateGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoommateGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoommateCountArgs<ExtArgs>
            result: $Utils.Optional<RoommateCountAggregateOutputType> | number
          }
        }
      }
      Availability: {
        payload: Prisma.$AvailabilityPayload<ExtArgs>
        fields: Prisma.AvailabilityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AvailabilityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AvailabilityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>
          }
          findFirst: {
            args: Prisma.AvailabilityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AvailabilityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>
          }
          findMany: {
            args: Prisma.AvailabilityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>[]
          }
          create: {
            args: Prisma.AvailabilityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>
          }
          createMany: {
            args: Prisma.AvailabilityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AvailabilityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>[]
          }
          delete: {
            args: Prisma.AvailabilityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>
          }
          update: {
            args: Prisma.AvailabilityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>
          }
          deleteMany: {
            args: Prisma.AvailabilityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AvailabilityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AvailabilityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>
          }
          aggregate: {
            args: Prisma.AvailabilityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAvailability>
          }
          groupBy: {
            args: Prisma.AvailabilityGroupByArgs<ExtArgs>
            result: $Utils.Optional<AvailabilityGroupByOutputType>[]
          }
          count: {
            args: Prisma.AvailabilityCountArgs<ExtArgs>
            result: $Utils.Optional<AvailabilityCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ListingCountOutputType
   */

  export type ListingCountOutputType = {
    photos: number
    roommates: number
    availability: number
  }

  export type ListingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photos?: boolean | ListingCountOutputTypeCountPhotosArgs
    roommates?: boolean | ListingCountOutputTypeCountRoommatesArgs
    availability?: boolean | ListingCountOutputTypeCountAvailabilityArgs
  }

  // Custom InputTypes
  /**
   * ListingCountOutputType without action
   */
  export type ListingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListingCountOutputType
     */
    select?: ListingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ListingCountOutputType without action
   */
  export type ListingCountOutputTypeCountPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhotoWhereInput
  }

  /**
   * ListingCountOutputType without action
   */
  export type ListingCountOutputTypeCountRoommatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoommateWhereInput
  }

  /**
   * ListingCountOutputType without action
   */
  export type ListingCountOutputTypeCountAvailabilityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AvailabilityWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Listing
   */

  export type AggregateListing = {
    _count: ListingCountAggregateOutputType | null
    _avg: ListingAvgAggregateOutputType | null
    _sum: ListingSumAggregateOutputType | null
    _min: ListingMinAggregateOutputType | null
    _max: ListingMaxAggregateOutputType | null
  }

  export type ListingAvgAggregateOutputType = {
    lat: number | null
    lng: number | null
    price: number | null
    depositAmount: number | null
    bedrooms: number | null
    bathrooms: number | null
    squareFeet: number | null
    freedomScore: number | null
    minStay: number | null
    maxStay: number | null
    viewCount: number | null
    favoriteCount: number | null
  }

  export type ListingSumAggregateOutputType = {
    lat: number | null
    lng: number | null
    price: number | null
    depositAmount: number | null
    bedrooms: number | null
    bathrooms: number | null
    squareFeet: number | null
    freedomScore: number | null
    minStay: number | null
    maxStay: number | null
    viewCount: number | null
    favoriteCount: number | null
  }

  export type ListingMinAggregateOutputType = {
    id: string | null
    hostId: string | null
    title: string | null
    description: string | null
    type: string | null
    status: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    neighborhood: string | null
    lat: number | null
    lng: number | null
    price: number | null
    currency: string | null
    depositAmount: number | null
    utilitiesIncluded: boolean | null
    bedrooms: number | null
    bathrooms: number | null
    squareFeet: number | null
    furnished: boolean | null
    freedomScore: number | null
    smokingAllowed: boolean | null
    petsAllowed: boolean | null
    partyFriendly: boolean | null
    dietaryPreference: string | null
    virtualTourUrl: string | null
    availableFrom: Date | null
    availableUntil: Date | null
    minStay: number | null
    maxStay: number | null
    instantBook: boolean | null
    amenities: string | null
    houseRules: string | null
    viewCount: number | null
    favoriteCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ListingMaxAggregateOutputType = {
    id: string | null
    hostId: string | null
    title: string | null
    description: string | null
    type: string | null
    status: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    neighborhood: string | null
    lat: number | null
    lng: number | null
    price: number | null
    currency: string | null
    depositAmount: number | null
    utilitiesIncluded: boolean | null
    bedrooms: number | null
    bathrooms: number | null
    squareFeet: number | null
    furnished: boolean | null
    freedomScore: number | null
    smokingAllowed: boolean | null
    petsAllowed: boolean | null
    partyFriendly: boolean | null
    dietaryPreference: string | null
    virtualTourUrl: string | null
    availableFrom: Date | null
    availableUntil: Date | null
    minStay: number | null
    maxStay: number | null
    instantBook: boolean | null
    amenities: string | null
    houseRules: string | null
    viewCount: number | null
    favoriteCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ListingCountAggregateOutputType = {
    id: number
    hostId: number
    title: number
    description: number
    type: number
    status: number
    address: number
    city: number
    state: number
    zipCode: number
    neighborhood: number
    lat: number
    lng: number
    price: number
    currency: number
    depositAmount: number
    utilitiesIncluded: number
    bedrooms: number
    bathrooms: number
    squareFeet: number
    furnished: number
    freedomScore: number
    smokingAllowed: number
    petsAllowed: number
    partyFriendly: number
    dietaryPreference: number
    virtualTourUrl: number
    availableFrom: number
    availableUntil: number
    minStay: number
    maxStay: number
    instantBook: number
    amenities: number
    houseRules: number
    viewCount: number
    favoriteCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ListingAvgAggregateInputType = {
    lat?: true
    lng?: true
    price?: true
    depositAmount?: true
    bedrooms?: true
    bathrooms?: true
    squareFeet?: true
    freedomScore?: true
    minStay?: true
    maxStay?: true
    viewCount?: true
    favoriteCount?: true
  }

  export type ListingSumAggregateInputType = {
    lat?: true
    lng?: true
    price?: true
    depositAmount?: true
    bedrooms?: true
    bathrooms?: true
    squareFeet?: true
    freedomScore?: true
    minStay?: true
    maxStay?: true
    viewCount?: true
    favoriteCount?: true
  }

  export type ListingMinAggregateInputType = {
    id?: true
    hostId?: true
    title?: true
    description?: true
    type?: true
    status?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    neighborhood?: true
    lat?: true
    lng?: true
    price?: true
    currency?: true
    depositAmount?: true
    utilitiesIncluded?: true
    bedrooms?: true
    bathrooms?: true
    squareFeet?: true
    furnished?: true
    freedomScore?: true
    smokingAllowed?: true
    petsAllowed?: true
    partyFriendly?: true
    dietaryPreference?: true
    virtualTourUrl?: true
    availableFrom?: true
    availableUntil?: true
    minStay?: true
    maxStay?: true
    instantBook?: true
    amenities?: true
    houseRules?: true
    viewCount?: true
    favoriteCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ListingMaxAggregateInputType = {
    id?: true
    hostId?: true
    title?: true
    description?: true
    type?: true
    status?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    neighborhood?: true
    lat?: true
    lng?: true
    price?: true
    currency?: true
    depositAmount?: true
    utilitiesIncluded?: true
    bedrooms?: true
    bathrooms?: true
    squareFeet?: true
    furnished?: true
    freedomScore?: true
    smokingAllowed?: true
    petsAllowed?: true
    partyFriendly?: true
    dietaryPreference?: true
    virtualTourUrl?: true
    availableFrom?: true
    availableUntil?: true
    minStay?: true
    maxStay?: true
    instantBook?: true
    amenities?: true
    houseRules?: true
    viewCount?: true
    favoriteCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ListingCountAggregateInputType = {
    id?: true
    hostId?: true
    title?: true
    description?: true
    type?: true
    status?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    neighborhood?: true
    lat?: true
    lng?: true
    price?: true
    currency?: true
    depositAmount?: true
    utilitiesIncluded?: true
    bedrooms?: true
    bathrooms?: true
    squareFeet?: true
    furnished?: true
    freedomScore?: true
    smokingAllowed?: true
    petsAllowed?: true
    partyFriendly?: true
    dietaryPreference?: true
    virtualTourUrl?: true
    availableFrom?: true
    availableUntil?: true
    minStay?: true
    maxStay?: true
    instantBook?: true
    amenities?: true
    houseRules?: true
    viewCount?: true
    favoriteCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ListingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Listing to aggregate.
     */
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     */
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Listings
    **/
    _count?: true | ListingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ListingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ListingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ListingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ListingMaxAggregateInputType
  }

  export type GetListingAggregateType<T extends ListingAggregateArgs> = {
        [P in keyof T & keyof AggregateListing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateListing[P]>
      : GetScalarType<T[P], AggregateListing[P]>
  }




  export type ListingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ListingWhereInput
    orderBy?: ListingOrderByWithAggregationInput | ListingOrderByWithAggregationInput[]
    by: ListingScalarFieldEnum[] | ListingScalarFieldEnum
    having?: ListingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ListingCountAggregateInputType | true
    _avg?: ListingAvgAggregateInputType
    _sum?: ListingSumAggregateInputType
    _min?: ListingMinAggregateInputType
    _max?: ListingMaxAggregateInputType
  }

  export type ListingGroupByOutputType = {
    id: string
    hostId: string
    title: string
    description: string
    type: string
    status: string
    address: string | null
    city: string
    state: string
    zipCode: string | null
    neighborhood: string | null
    lat: number | null
    lng: number | null
    price: number
    currency: string
    depositAmount: number | null
    utilitiesIncluded: boolean
    bedrooms: number
    bathrooms: number
    squareFeet: number | null
    furnished: boolean
    freedomScore: number
    smokingAllowed: boolean
    petsAllowed: boolean
    partyFriendly: boolean
    dietaryPreference: string | null
    virtualTourUrl: string | null
    availableFrom: Date
    availableUntil: Date | null
    minStay: number | null
    maxStay: number | null
    instantBook: boolean
    amenities: string
    houseRules: string
    viewCount: number
    favoriteCount: number
    createdAt: Date
    updatedAt: Date
    _count: ListingCountAggregateOutputType | null
    _avg: ListingAvgAggregateOutputType | null
    _sum: ListingSumAggregateOutputType | null
    _min: ListingMinAggregateOutputType | null
    _max: ListingMaxAggregateOutputType | null
  }

  type GetListingGroupByPayload<T extends ListingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ListingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ListingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ListingGroupByOutputType[P]>
            : GetScalarType<T[P], ListingGroupByOutputType[P]>
        }
      >
    >


  export type ListingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hostId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    neighborhood?: boolean
    lat?: boolean
    lng?: boolean
    price?: boolean
    currency?: boolean
    depositAmount?: boolean
    utilitiesIncluded?: boolean
    bedrooms?: boolean
    bathrooms?: boolean
    squareFeet?: boolean
    furnished?: boolean
    freedomScore?: boolean
    smokingAllowed?: boolean
    petsAllowed?: boolean
    partyFriendly?: boolean
    dietaryPreference?: boolean
    virtualTourUrl?: boolean
    availableFrom?: boolean
    availableUntil?: boolean
    minStay?: boolean
    maxStay?: boolean
    instantBook?: boolean
    amenities?: boolean
    houseRules?: boolean
    viewCount?: boolean
    favoriteCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    photos?: boolean | Listing$photosArgs<ExtArgs>
    roommates?: boolean | Listing$roommatesArgs<ExtArgs>
    availability?: boolean | Listing$availabilityArgs<ExtArgs>
    _count?: boolean | ListingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["listing"]>

  export type ListingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hostId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    neighborhood?: boolean
    lat?: boolean
    lng?: boolean
    price?: boolean
    currency?: boolean
    depositAmount?: boolean
    utilitiesIncluded?: boolean
    bedrooms?: boolean
    bathrooms?: boolean
    squareFeet?: boolean
    furnished?: boolean
    freedomScore?: boolean
    smokingAllowed?: boolean
    petsAllowed?: boolean
    partyFriendly?: boolean
    dietaryPreference?: boolean
    virtualTourUrl?: boolean
    availableFrom?: boolean
    availableUntil?: boolean
    minStay?: boolean
    maxStay?: boolean
    instantBook?: boolean
    amenities?: boolean
    houseRules?: boolean
    viewCount?: boolean
    favoriteCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["listing"]>

  export type ListingSelectScalar = {
    id?: boolean
    hostId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    neighborhood?: boolean
    lat?: boolean
    lng?: boolean
    price?: boolean
    currency?: boolean
    depositAmount?: boolean
    utilitiesIncluded?: boolean
    bedrooms?: boolean
    bathrooms?: boolean
    squareFeet?: boolean
    furnished?: boolean
    freedomScore?: boolean
    smokingAllowed?: boolean
    petsAllowed?: boolean
    partyFriendly?: boolean
    dietaryPreference?: boolean
    virtualTourUrl?: boolean
    availableFrom?: boolean
    availableUntil?: boolean
    minStay?: boolean
    maxStay?: boolean
    instantBook?: boolean
    amenities?: boolean
    houseRules?: boolean
    viewCount?: boolean
    favoriteCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ListingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photos?: boolean | Listing$photosArgs<ExtArgs>
    roommates?: boolean | Listing$roommatesArgs<ExtArgs>
    availability?: boolean | Listing$availabilityArgs<ExtArgs>
    _count?: boolean | ListingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ListingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ListingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Listing"
    objects: {
      photos: Prisma.$PhotoPayload<ExtArgs>[]
      roommates: Prisma.$RoommatePayload<ExtArgs>[]
      availability: Prisma.$AvailabilityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      hostId: string
      title: string
      description: string
      type: string
      status: string
      address: string | null
      city: string
      state: string
      zipCode: string | null
      neighborhood: string | null
      lat: number | null
      lng: number | null
      price: number
      currency: string
      depositAmount: number | null
      utilitiesIncluded: boolean
      bedrooms: number
      bathrooms: number
      squareFeet: number | null
      furnished: boolean
      freedomScore: number
      smokingAllowed: boolean
      petsAllowed: boolean
      partyFriendly: boolean
      dietaryPreference: string | null
      virtualTourUrl: string | null
      availableFrom: Date
      availableUntil: Date | null
      minStay: number | null
      maxStay: number | null
      instantBook: boolean
      amenities: string
      houseRules: string
      viewCount: number
      favoriteCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["listing"]>
    composites: {}
  }

  type ListingGetPayload<S extends boolean | null | undefined | ListingDefaultArgs> = $Result.GetResult<Prisma.$ListingPayload, S>

  type ListingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ListingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ListingCountAggregateInputType | true
    }

  export interface ListingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Listing'], meta: { name: 'Listing' } }
    /**
     * Find zero or one Listing that matches the filter.
     * @param {ListingFindUniqueArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ListingFindUniqueArgs>(args: SelectSubset<T, ListingFindUniqueArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Listing that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ListingFindUniqueOrThrowArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ListingFindUniqueOrThrowArgs>(args: SelectSubset<T, ListingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Listing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindFirstArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ListingFindFirstArgs>(args?: SelectSubset<T, ListingFindFirstArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Listing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindFirstOrThrowArgs} args - Arguments to find a Listing
     * @example
     * // Get one Listing
     * const listing = await prisma.listing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ListingFindFirstOrThrowArgs>(args?: SelectSubset<T, ListingFindFirstOrThrowArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Listings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Listings
     * const listings = await prisma.listing.findMany()
     * 
     * // Get first 10 Listings
     * const listings = await prisma.listing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const listingWithIdOnly = await prisma.listing.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ListingFindManyArgs>(args?: SelectSubset<T, ListingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Listing.
     * @param {ListingCreateArgs} args - Arguments to create a Listing.
     * @example
     * // Create one Listing
     * const Listing = await prisma.listing.create({
     *   data: {
     *     // ... data to create a Listing
     *   }
     * })
     * 
     */
    create<T extends ListingCreateArgs>(args: SelectSubset<T, ListingCreateArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Listings.
     * @param {ListingCreateManyArgs} args - Arguments to create many Listings.
     * @example
     * // Create many Listings
     * const listing = await prisma.listing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ListingCreateManyArgs>(args?: SelectSubset<T, ListingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Listings and returns the data saved in the database.
     * @param {ListingCreateManyAndReturnArgs} args - Arguments to create many Listings.
     * @example
     * // Create many Listings
     * const listing = await prisma.listing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Listings and only return the `id`
     * const listingWithIdOnly = await prisma.listing.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ListingCreateManyAndReturnArgs>(args?: SelectSubset<T, ListingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Listing.
     * @param {ListingDeleteArgs} args - Arguments to delete one Listing.
     * @example
     * // Delete one Listing
     * const Listing = await prisma.listing.delete({
     *   where: {
     *     // ... filter to delete one Listing
     *   }
     * })
     * 
     */
    delete<T extends ListingDeleteArgs>(args: SelectSubset<T, ListingDeleteArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Listing.
     * @param {ListingUpdateArgs} args - Arguments to update one Listing.
     * @example
     * // Update one Listing
     * const listing = await prisma.listing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ListingUpdateArgs>(args: SelectSubset<T, ListingUpdateArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Listings.
     * @param {ListingDeleteManyArgs} args - Arguments to filter Listings to delete.
     * @example
     * // Delete a few Listings
     * const { count } = await prisma.listing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ListingDeleteManyArgs>(args?: SelectSubset<T, ListingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Listings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Listings
     * const listing = await prisma.listing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ListingUpdateManyArgs>(args: SelectSubset<T, ListingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Listing.
     * @param {ListingUpsertArgs} args - Arguments to update or create a Listing.
     * @example
     * // Update or create a Listing
     * const listing = await prisma.listing.upsert({
     *   create: {
     *     // ... data to create a Listing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Listing we want to update
     *   }
     * })
     */
    upsert<T extends ListingUpsertArgs>(args: SelectSubset<T, ListingUpsertArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Listings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingCountArgs} args - Arguments to filter Listings to count.
     * @example
     * // Count the number of Listings
     * const count = await prisma.listing.count({
     *   where: {
     *     // ... the filter for the Listings we want to count
     *   }
     * })
    **/
    count<T extends ListingCountArgs>(
      args?: Subset<T, ListingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ListingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Listing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ListingAggregateArgs>(args: Subset<T, ListingAggregateArgs>): Prisma.PrismaPromise<GetListingAggregateType<T>>

    /**
     * Group by Listing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ListingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ListingGroupByArgs['orderBy'] }
        : { orderBy?: ListingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ListingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Listing model
   */
  readonly fields: ListingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Listing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ListingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    photos<T extends Listing$photosArgs<ExtArgs> = {}>(args?: Subset<T, Listing$photosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findMany"> | Null>
    roommates<T extends Listing$roommatesArgs<ExtArgs> = {}>(args?: Subset<T, Listing$roommatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoommatePayload<ExtArgs>, T, "findMany"> | Null>
    availability<T extends Listing$availabilityArgs<ExtArgs> = {}>(args?: Subset<T, Listing$availabilityArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Listing model
   */ 
  interface ListingFieldRefs {
    readonly id: FieldRef<"Listing", 'String'>
    readonly hostId: FieldRef<"Listing", 'String'>
    readonly title: FieldRef<"Listing", 'String'>
    readonly description: FieldRef<"Listing", 'String'>
    readonly type: FieldRef<"Listing", 'String'>
    readonly status: FieldRef<"Listing", 'String'>
    readonly address: FieldRef<"Listing", 'String'>
    readonly city: FieldRef<"Listing", 'String'>
    readonly state: FieldRef<"Listing", 'String'>
    readonly zipCode: FieldRef<"Listing", 'String'>
    readonly neighborhood: FieldRef<"Listing", 'String'>
    readonly lat: FieldRef<"Listing", 'Float'>
    readonly lng: FieldRef<"Listing", 'Float'>
    readonly price: FieldRef<"Listing", 'Int'>
    readonly currency: FieldRef<"Listing", 'String'>
    readonly depositAmount: FieldRef<"Listing", 'Int'>
    readonly utilitiesIncluded: FieldRef<"Listing", 'Boolean'>
    readonly bedrooms: FieldRef<"Listing", 'Int'>
    readonly bathrooms: FieldRef<"Listing", 'Float'>
    readonly squareFeet: FieldRef<"Listing", 'Int'>
    readonly furnished: FieldRef<"Listing", 'Boolean'>
    readonly freedomScore: FieldRef<"Listing", 'Int'>
    readonly smokingAllowed: FieldRef<"Listing", 'Boolean'>
    readonly petsAllowed: FieldRef<"Listing", 'Boolean'>
    readonly partyFriendly: FieldRef<"Listing", 'Boolean'>
    readonly dietaryPreference: FieldRef<"Listing", 'String'>
    readonly virtualTourUrl: FieldRef<"Listing", 'String'>
    readonly availableFrom: FieldRef<"Listing", 'DateTime'>
    readonly availableUntil: FieldRef<"Listing", 'DateTime'>
    readonly minStay: FieldRef<"Listing", 'Int'>
    readonly maxStay: FieldRef<"Listing", 'Int'>
    readonly instantBook: FieldRef<"Listing", 'Boolean'>
    readonly amenities: FieldRef<"Listing", 'String'>
    readonly houseRules: FieldRef<"Listing", 'String'>
    readonly viewCount: FieldRef<"Listing", 'Int'>
    readonly favoriteCount: FieldRef<"Listing", 'Int'>
    readonly createdAt: FieldRef<"Listing", 'DateTime'>
    readonly updatedAt: FieldRef<"Listing", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Listing findUnique
   */
  export type ListingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listing to fetch.
     */
    where: ListingWhereUniqueInput
  }

  /**
   * Listing findUniqueOrThrow
   */
  export type ListingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listing to fetch.
     */
    where: ListingWhereUniqueInput
  }

  /**
   * Listing findFirst
   */
  export type ListingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listing to fetch.
     */
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     */
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Listings.
     */
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Listings.
     */
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[]
  }

  /**
   * Listing findFirstOrThrow
   */
  export type ListingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listing to fetch.
     */
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     */
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Listings.
     */
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Listings.
     */
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[]
  }

  /**
   * Listing findMany
   */
  export type ListingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter, which Listings to fetch.
     */
    where?: ListingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Listings to fetch.
     */
    orderBy?: ListingOrderByWithRelationInput | ListingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Listings.
     */
    cursor?: ListingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Listings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Listings.
     */
    skip?: number
    distinct?: ListingScalarFieldEnum | ListingScalarFieldEnum[]
  }

  /**
   * Listing create
   */
  export type ListingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * The data needed to create a Listing.
     */
    data: XOR<ListingCreateInput, ListingUncheckedCreateInput>
  }

  /**
   * Listing createMany
   */
  export type ListingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Listings.
     */
    data: ListingCreateManyInput | ListingCreateManyInput[]
  }

  /**
   * Listing createManyAndReturn
   */
  export type ListingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Listings.
     */
    data: ListingCreateManyInput | ListingCreateManyInput[]
  }

  /**
   * Listing update
   */
  export type ListingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * The data needed to update a Listing.
     */
    data: XOR<ListingUpdateInput, ListingUncheckedUpdateInput>
    /**
     * Choose, which Listing to update.
     */
    where: ListingWhereUniqueInput
  }

  /**
   * Listing updateMany
   */
  export type ListingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Listings.
     */
    data: XOR<ListingUpdateManyMutationInput, ListingUncheckedUpdateManyInput>
    /**
     * Filter which Listings to update
     */
    where?: ListingWhereInput
  }

  /**
   * Listing upsert
   */
  export type ListingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * The filter to search for the Listing to update in case it exists.
     */
    where: ListingWhereUniqueInput
    /**
     * In case the Listing found by the `where` argument doesn't exist, create a new Listing with this data.
     */
    create: XOR<ListingCreateInput, ListingUncheckedCreateInput>
    /**
     * In case the Listing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ListingUpdateInput, ListingUncheckedUpdateInput>
  }

  /**
   * Listing delete
   */
  export type ListingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
    /**
     * Filter which Listing to delete.
     */
    where: ListingWhereUniqueInput
  }

  /**
   * Listing deleteMany
   */
  export type ListingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Listings to delete
     */
    where?: ListingWhereInput
  }

  /**
   * Listing.photos
   */
  export type Listing$photosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    where?: PhotoWhereInput
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    cursor?: PhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Listing.roommates
   */
  export type Listing$roommatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roommate
     */
    select?: RoommateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoommateInclude<ExtArgs> | null
    where?: RoommateWhereInput
    orderBy?: RoommateOrderByWithRelationInput | RoommateOrderByWithRelationInput[]
    cursor?: RoommateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoommateScalarFieldEnum | RoommateScalarFieldEnum[]
  }

  /**
   * Listing.availability
   */
  export type Listing$availabilityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    where?: AvailabilityWhereInput
    orderBy?: AvailabilityOrderByWithRelationInput | AvailabilityOrderByWithRelationInput[]
    cursor?: AvailabilityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AvailabilityScalarFieldEnum | AvailabilityScalarFieldEnum[]
  }

  /**
   * Listing without action
   */
  export type ListingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Listing
     */
    select?: ListingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ListingInclude<ExtArgs> | null
  }


  /**
   * Model Photo
   */

  export type AggregatePhoto = {
    _count: PhotoCountAggregateOutputType | null
    _avg: PhotoAvgAggregateOutputType | null
    _sum: PhotoSumAggregateOutputType | null
    _min: PhotoMinAggregateOutputType | null
    _max: PhotoMaxAggregateOutputType | null
  }

  export type PhotoAvgAggregateOutputType = {
    order: number | null
  }

  export type PhotoSumAggregateOutputType = {
    order: number | null
  }

  export type PhotoMinAggregateOutputType = {
    id: string | null
    listingId: string | null
    url: string | null
    caption: string | null
    isPrimary: boolean | null
    order: number | null
    createdAt: Date | null
  }

  export type PhotoMaxAggregateOutputType = {
    id: string | null
    listingId: string | null
    url: string | null
    caption: string | null
    isPrimary: boolean | null
    order: number | null
    createdAt: Date | null
  }

  export type PhotoCountAggregateOutputType = {
    id: number
    listingId: number
    url: number
    caption: number
    isPrimary: number
    order: number
    createdAt: number
    _all: number
  }


  export type PhotoAvgAggregateInputType = {
    order?: true
  }

  export type PhotoSumAggregateInputType = {
    order?: true
  }

  export type PhotoMinAggregateInputType = {
    id?: true
    listingId?: true
    url?: true
    caption?: true
    isPrimary?: true
    order?: true
    createdAt?: true
  }

  export type PhotoMaxAggregateInputType = {
    id?: true
    listingId?: true
    url?: true
    caption?: true
    isPrimary?: true
    order?: true
    createdAt?: true
  }

  export type PhotoCountAggregateInputType = {
    id?: true
    listingId?: true
    url?: true
    caption?: true
    isPrimary?: true
    order?: true
    createdAt?: true
    _all?: true
  }

  export type PhotoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Photo to aggregate.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Photos
    **/
    _count?: true | PhotoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PhotoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PhotoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PhotoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PhotoMaxAggregateInputType
  }

  export type GetPhotoAggregateType<T extends PhotoAggregateArgs> = {
        [P in keyof T & keyof AggregatePhoto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePhoto[P]>
      : GetScalarType<T[P], AggregatePhoto[P]>
  }




  export type PhotoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhotoWhereInput
    orderBy?: PhotoOrderByWithAggregationInput | PhotoOrderByWithAggregationInput[]
    by: PhotoScalarFieldEnum[] | PhotoScalarFieldEnum
    having?: PhotoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PhotoCountAggregateInputType | true
    _avg?: PhotoAvgAggregateInputType
    _sum?: PhotoSumAggregateInputType
    _min?: PhotoMinAggregateInputType
    _max?: PhotoMaxAggregateInputType
  }

  export type PhotoGroupByOutputType = {
    id: string
    listingId: string
    url: string
    caption: string | null
    isPrimary: boolean
    order: number
    createdAt: Date
    _count: PhotoCountAggregateOutputType | null
    _avg: PhotoAvgAggregateOutputType | null
    _sum: PhotoSumAggregateOutputType | null
    _min: PhotoMinAggregateOutputType | null
    _max: PhotoMaxAggregateOutputType | null
  }

  type GetPhotoGroupByPayload<T extends PhotoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PhotoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PhotoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PhotoGroupByOutputType[P]>
            : GetScalarType<T[P], PhotoGroupByOutputType[P]>
        }
      >
    >


  export type PhotoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    listingId?: boolean
    url?: boolean
    caption?: boolean
    isPrimary?: boolean
    order?: boolean
    createdAt?: boolean
    listing?: boolean | ListingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["photo"]>

  export type PhotoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    listingId?: boolean
    url?: boolean
    caption?: boolean
    isPrimary?: boolean
    order?: boolean
    createdAt?: boolean
    listing?: boolean | ListingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["photo"]>

  export type PhotoSelectScalar = {
    id?: boolean
    listingId?: boolean
    url?: boolean
    caption?: boolean
    isPrimary?: boolean
    order?: boolean
    createdAt?: boolean
  }

  export type PhotoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    listing?: boolean | ListingDefaultArgs<ExtArgs>
  }
  export type PhotoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    listing?: boolean | ListingDefaultArgs<ExtArgs>
  }

  export type $PhotoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Photo"
    objects: {
      listing: Prisma.$ListingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      listingId: string
      url: string
      caption: string | null
      isPrimary: boolean
      order: number
      createdAt: Date
    }, ExtArgs["result"]["photo"]>
    composites: {}
  }

  type PhotoGetPayload<S extends boolean | null | undefined | PhotoDefaultArgs> = $Result.GetResult<Prisma.$PhotoPayload, S>

  type PhotoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PhotoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PhotoCountAggregateInputType | true
    }

  export interface PhotoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Photo'], meta: { name: 'Photo' } }
    /**
     * Find zero or one Photo that matches the filter.
     * @param {PhotoFindUniqueArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PhotoFindUniqueArgs>(args: SelectSubset<T, PhotoFindUniqueArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Photo that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PhotoFindUniqueOrThrowArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PhotoFindUniqueOrThrowArgs>(args: SelectSubset<T, PhotoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Photo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFindFirstArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PhotoFindFirstArgs>(args?: SelectSubset<T, PhotoFindFirstArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Photo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFindFirstOrThrowArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PhotoFindFirstOrThrowArgs>(args?: SelectSubset<T, PhotoFindFirstOrThrowArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Photos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Photos
     * const photos = await prisma.photo.findMany()
     * 
     * // Get first 10 Photos
     * const photos = await prisma.photo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const photoWithIdOnly = await prisma.photo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PhotoFindManyArgs>(args?: SelectSubset<T, PhotoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Photo.
     * @param {PhotoCreateArgs} args - Arguments to create a Photo.
     * @example
     * // Create one Photo
     * const Photo = await prisma.photo.create({
     *   data: {
     *     // ... data to create a Photo
     *   }
     * })
     * 
     */
    create<T extends PhotoCreateArgs>(args: SelectSubset<T, PhotoCreateArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Photos.
     * @param {PhotoCreateManyArgs} args - Arguments to create many Photos.
     * @example
     * // Create many Photos
     * const photo = await prisma.photo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PhotoCreateManyArgs>(args?: SelectSubset<T, PhotoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Photos and returns the data saved in the database.
     * @param {PhotoCreateManyAndReturnArgs} args - Arguments to create many Photos.
     * @example
     * // Create many Photos
     * const photo = await prisma.photo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Photos and only return the `id`
     * const photoWithIdOnly = await prisma.photo.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PhotoCreateManyAndReturnArgs>(args?: SelectSubset<T, PhotoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Photo.
     * @param {PhotoDeleteArgs} args - Arguments to delete one Photo.
     * @example
     * // Delete one Photo
     * const Photo = await prisma.photo.delete({
     *   where: {
     *     // ... filter to delete one Photo
     *   }
     * })
     * 
     */
    delete<T extends PhotoDeleteArgs>(args: SelectSubset<T, PhotoDeleteArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Photo.
     * @param {PhotoUpdateArgs} args - Arguments to update one Photo.
     * @example
     * // Update one Photo
     * const photo = await prisma.photo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PhotoUpdateArgs>(args: SelectSubset<T, PhotoUpdateArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Photos.
     * @param {PhotoDeleteManyArgs} args - Arguments to filter Photos to delete.
     * @example
     * // Delete a few Photos
     * const { count } = await prisma.photo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PhotoDeleteManyArgs>(args?: SelectSubset<T, PhotoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Photos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Photos
     * const photo = await prisma.photo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PhotoUpdateManyArgs>(args: SelectSubset<T, PhotoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Photo.
     * @param {PhotoUpsertArgs} args - Arguments to update or create a Photo.
     * @example
     * // Update or create a Photo
     * const photo = await prisma.photo.upsert({
     *   create: {
     *     // ... data to create a Photo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Photo we want to update
     *   }
     * })
     */
    upsert<T extends PhotoUpsertArgs>(args: SelectSubset<T, PhotoUpsertArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Photos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoCountArgs} args - Arguments to filter Photos to count.
     * @example
     * // Count the number of Photos
     * const count = await prisma.photo.count({
     *   where: {
     *     // ... the filter for the Photos we want to count
     *   }
     * })
    **/
    count<T extends PhotoCountArgs>(
      args?: Subset<T, PhotoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PhotoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Photo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PhotoAggregateArgs>(args: Subset<T, PhotoAggregateArgs>): Prisma.PrismaPromise<GetPhotoAggregateType<T>>

    /**
     * Group by Photo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PhotoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PhotoGroupByArgs['orderBy'] }
        : { orderBy?: PhotoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PhotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPhotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Photo model
   */
  readonly fields: PhotoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Photo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PhotoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    listing<T extends ListingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ListingDefaultArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Photo model
   */ 
  interface PhotoFieldRefs {
    readonly id: FieldRef<"Photo", 'String'>
    readonly listingId: FieldRef<"Photo", 'String'>
    readonly url: FieldRef<"Photo", 'String'>
    readonly caption: FieldRef<"Photo", 'String'>
    readonly isPrimary: FieldRef<"Photo", 'Boolean'>
    readonly order: FieldRef<"Photo", 'Int'>
    readonly createdAt: FieldRef<"Photo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Photo findUnique
   */
  export type PhotoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo findUniqueOrThrow
   */
  export type PhotoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo findFirst
   */
  export type PhotoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Photos.
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Photos.
     */
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Photo findFirstOrThrow
   */
  export type PhotoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Photos.
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Photos.
     */
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Photo findMany
   */
  export type PhotoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photos to fetch.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Photos.
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Photo create
   */
  export type PhotoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * The data needed to create a Photo.
     */
    data: XOR<PhotoCreateInput, PhotoUncheckedCreateInput>
  }

  /**
   * Photo createMany
   */
  export type PhotoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Photos.
     */
    data: PhotoCreateManyInput | PhotoCreateManyInput[]
  }

  /**
   * Photo createManyAndReturn
   */
  export type PhotoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Photos.
     */
    data: PhotoCreateManyInput | PhotoCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Photo update
   */
  export type PhotoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * The data needed to update a Photo.
     */
    data: XOR<PhotoUpdateInput, PhotoUncheckedUpdateInput>
    /**
     * Choose, which Photo to update.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo updateMany
   */
  export type PhotoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Photos.
     */
    data: XOR<PhotoUpdateManyMutationInput, PhotoUncheckedUpdateManyInput>
    /**
     * Filter which Photos to update
     */
    where?: PhotoWhereInput
  }

  /**
   * Photo upsert
   */
  export type PhotoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * The filter to search for the Photo to update in case it exists.
     */
    where: PhotoWhereUniqueInput
    /**
     * In case the Photo found by the `where` argument doesn't exist, create a new Photo with this data.
     */
    create: XOR<PhotoCreateInput, PhotoUncheckedCreateInput>
    /**
     * In case the Photo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PhotoUpdateInput, PhotoUncheckedUpdateInput>
  }

  /**
   * Photo delete
   */
  export type PhotoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter which Photo to delete.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo deleteMany
   */
  export type PhotoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Photos to delete
     */
    where?: PhotoWhereInput
  }

  /**
   * Photo without action
   */
  export type PhotoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
  }


  /**
   * Model Roommate
   */

  export type AggregateRoommate = {
    _count: RoommateCountAggregateOutputType | null
    _avg: RoommateAvgAggregateOutputType | null
    _sum: RoommateSumAggregateOutputType | null
    _min: RoommateMinAggregateOutputType | null
    _max: RoommateMaxAggregateOutputType | null
  }

  export type RoommateAvgAggregateOutputType = {
    age: number | null
  }

  export type RoommateSumAggregateOutputType = {
    age: number | null
  }

  export type RoommateMinAggregateOutputType = {
    id: string | null
    listingId: string | null
    name: string | null
    age: number | null
    occupation: string | null
    bio: string | null
    image: string | null
    languages: string | null
    moveInDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoommateMaxAggregateOutputType = {
    id: string | null
    listingId: string | null
    name: string | null
    age: number | null
    occupation: string | null
    bio: string | null
    image: string | null
    languages: string | null
    moveInDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoommateCountAggregateOutputType = {
    id: number
    listingId: number
    name: number
    age: number
    occupation: number
    bio: number
    image: number
    languages: number
    moveInDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoommateAvgAggregateInputType = {
    age?: true
  }

  export type RoommateSumAggregateInputType = {
    age?: true
  }

  export type RoommateMinAggregateInputType = {
    id?: true
    listingId?: true
    name?: true
    age?: true
    occupation?: true
    bio?: true
    image?: true
    languages?: true
    moveInDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoommateMaxAggregateInputType = {
    id?: true
    listingId?: true
    name?: true
    age?: true
    occupation?: true
    bio?: true
    image?: true
    languages?: true
    moveInDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoommateCountAggregateInputType = {
    id?: true
    listingId?: true
    name?: true
    age?: true
    occupation?: true
    bio?: true
    image?: true
    languages?: true
    moveInDate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoommateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roommate to aggregate.
     */
    where?: RoommateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roommates to fetch.
     */
    orderBy?: RoommateOrderByWithRelationInput | RoommateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoommateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roommates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roommates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roommates
    **/
    _count?: true | RoommateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoommateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoommateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoommateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoommateMaxAggregateInputType
  }

  export type GetRoommateAggregateType<T extends RoommateAggregateArgs> = {
        [P in keyof T & keyof AggregateRoommate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoommate[P]>
      : GetScalarType<T[P], AggregateRoommate[P]>
  }




  export type RoommateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoommateWhereInput
    orderBy?: RoommateOrderByWithAggregationInput | RoommateOrderByWithAggregationInput[]
    by: RoommateScalarFieldEnum[] | RoommateScalarFieldEnum
    having?: RoommateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoommateCountAggregateInputType | true
    _avg?: RoommateAvgAggregateInputType
    _sum?: RoommateSumAggregateInputType
    _min?: RoommateMinAggregateInputType
    _max?: RoommateMaxAggregateInputType
  }

  export type RoommateGroupByOutputType = {
    id: string
    listingId: string
    name: string
    age: number | null
    occupation: string | null
    bio: string | null
    image: string | null
    languages: string
    moveInDate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: RoommateCountAggregateOutputType | null
    _avg: RoommateAvgAggregateOutputType | null
    _sum: RoommateSumAggregateOutputType | null
    _min: RoommateMinAggregateOutputType | null
    _max: RoommateMaxAggregateOutputType | null
  }

  type GetRoommateGroupByPayload<T extends RoommateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoommateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoommateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoommateGroupByOutputType[P]>
            : GetScalarType<T[P], RoommateGroupByOutputType[P]>
        }
      >
    >


  export type RoommateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    listingId?: boolean
    name?: boolean
    age?: boolean
    occupation?: boolean
    bio?: boolean
    image?: boolean
    languages?: boolean
    moveInDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    listing?: boolean | ListingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roommate"]>

  export type RoommateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    listingId?: boolean
    name?: boolean
    age?: boolean
    occupation?: boolean
    bio?: boolean
    image?: boolean
    languages?: boolean
    moveInDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    listing?: boolean | ListingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roommate"]>

  export type RoommateSelectScalar = {
    id?: boolean
    listingId?: boolean
    name?: boolean
    age?: boolean
    occupation?: boolean
    bio?: boolean
    image?: boolean
    languages?: boolean
    moveInDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoommateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    listing?: boolean | ListingDefaultArgs<ExtArgs>
  }
  export type RoommateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    listing?: boolean | ListingDefaultArgs<ExtArgs>
  }

  export type $RoommatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Roommate"
    objects: {
      listing: Prisma.$ListingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      listingId: string
      name: string
      age: number | null
      occupation: string | null
      bio: string | null
      image: string | null
      languages: string
      moveInDate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["roommate"]>
    composites: {}
  }

  type RoommateGetPayload<S extends boolean | null | undefined | RoommateDefaultArgs> = $Result.GetResult<Prisma.$RoommatePayload, S>

  type RoommateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RoommateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RoommateCountAggregateInputType | true
    }

  export interface RoommateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Roommate'], meta: { name: 'Roommate' } }
    /**
     * Find zero or one Roommate that matches the filter.
     * @param {RoommateFindUniqueArgs} args - Arguments to find a Roommate
     * @example
     * // Get one Roommate
     * const roommate = await prisma.roommate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoommateFindUniqueArgs>(args: SelectSubset<T, RoommateFindUniqueArgs<ExtArgs>>): Prisma__RoommateClient<$Result.GetResult<Prisma.$RoommatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Roommate that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RoommateFindUniqueOrThrowArgs} args - Arguments to find a Roommate
     * @example
     * // Get one Roommate
     * const roommate = await prisma.roommate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoommateFindUniqueOrThrowArgs>(args: SelectSubset<T, RoommateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoommateClient<$Result.GetResult<Prisma.$RoommatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Roommate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoommateFindFirstArgs} args - Arguments to find a Roommate
     * @example
     * // Get one Roommate
     * const roommate = await prisma.roommate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoommateFindFirstArgs>(args?: SelectSubset<T, RoommateFindFirstArgs<ExtArgs>>): Prisma__RoommateClient<$Result.GetResult<Prisma.$RoommatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Roommate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoommateFindFirstOrThrowArgs} args - Arguments to find a Roommate
     * @example
     * // Get one Roommate
     * const roommate = await prisma.roommate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoommateFindFirstOrThrowArgs>(args?: SelectSubset<T, RoommateFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoommateClient<$Result.GetResult<Prisma.$RoommatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Roommates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoommateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roommates
     * const roommates = await prisma.roommate.findMany()
     * 
     * // Get first 10 Roommates
     * const roommates = await prisma.roommate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roommateWithIdOnly = await prisma.roommate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoommateFindManyArgs>(args?: SelectSubset<T, RoommateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoommatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Roommate.
     * @param {RoommateCreateArgs} args - Arguments to create a Roommate.
     * @example
     * // Create one Roommate
     * const Roommate = await prisma.roommate.create({
     *   data: {
     *     // ... data to create a Roommate
     *   }
     * })
     * 
     */
    create<T extends RoommateCreateArgs>(args: SelectSubset<T, RoommateCreateArgs<ExtArgs>>): Prisma__RoommateClient<$Result.GetResult<Prisma.$RoommatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Roommates.
     * @param {RoommateCreateManyArgs} args - Arguments to create many Roommates.
     * @example
     * // Create many Roommates
     * const roommate = await prisma.roommate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoommateCreateManyArgs>(args?: SelectSubset<T, RoommateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roommates and returns the data saved in the database.
     * @param {RoommateCreateManyAndReturnArgs} args - Arguments to create many Roommates.
     * @example
     * // Create many Roommates
     * const roommate = await prisma.roommate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roommates and only return the `id`
     * const roommateWithIdOnly = await prisma.roommate.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoommateCreateManyAndReturnArgs>(args?: SelectSubset<T, RoommateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoommatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Roommate.
     * @param {RoommateDeleteArgs} args - Arguments to delete one Roommate.
     * @example
     * // Delete one Roommate
     * const Roommate = await prisma.roommate.delete({
     *   where: {
     *     // ... filter to delete one Roommate
     *   }
     * })
     * 
     */
    delete<T extends RoommateDeleteArgs>(args: SelectSubset<T, RoommateDeleteArgs<ExtArgs>>): Prisma__RoommateClient<$Result.GetResult<Prisma.$RoommatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Roommate.
     * @param {RoommateUpdateArgs} args - Arguments to update one Roommate.
     * @example
     * // Update one Roommate
     * const roommate = await prisma.roommate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoommateUpdateArgs>(args: SelectSubset<T, RoommateUpdateArgs<ExtArgs>>): Prisma__RoommateClient<$Result.GetResult<Prisma.$RoommatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Roommates.
     * @param {RoommateDeleteManyArgs} args - Arguments to filter Roommates to delete.
     * @example
     * // Delete a few Roommates
     * const { count } = await prisma.roommate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoommateDeleteManyArgs>(args?: SelectSubset<T, RoommateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roommates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoommateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roommates
     * const roommate = await prisma.roommate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoommateUpdateManyArgs>(args: SelectSubset<T, RoommateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Roommate.
     * @param {RoommateUpsertArgs} args - Arguments to update or create a Roommate.
     * @example
     * // Update or create a Roommate
     * const roommate = await prisma.roommate.upsert({
     *   create: {
     *     // ... data to create a Roommate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Roommate we want to update
     *   }
     * })
     */
    upsert<T extends RoommateUpsertArgs>(args: SelectSubset<T, RoommateUpsertArgs<ExtArgs>>): Prisma__RoommateClient<$Result.GetResult<Prisma.$RoommatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Roommates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoommateCountArgs} args - Arguments to filter Roommates to count.
     * @example
     * // Count the number of Roommates
     * const count = await prisma.roommate.count({
     *   where: {
     *     // ... the filter for the Roommates we want to count
     *   }
     * })
    **/
    count<T extends RoommateCountArgs>(
      args?: Subset<T, RoommateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoommateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Roommate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoommateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoommateAggregateArgs>(args: Subset<T, RoommateAggregateArgs>): Prisma.PrismaPromise<GetRoommateAggregateType<T>>

    /**
     * Group by Roommate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoommateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoommateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoommateGroupByArgs['orderBy'] }
        : { orderBy?: RoommateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoommateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoommateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Roommate model
   */
  readonly fields: RoommateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Roommate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoommateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    listing<T extends ListingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ListingDefaultArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Roommate model
   */ 
  interface RoommateFieldRefs {
    readonly id: FieldRef<"Roommate", 'String'>
    readonly listingId: FieldRef<"Roommate", 'String'>
    readonly name: FieldRef<"Roommate", 'String'>
    readonly age: FieldRef<"Roommate", 'Int'>
    readonly occupation: FieldRef<"Roommate", 'String'>
    readonly bio: FieldRef<"Roommate", 'String'>
    readonly image: FieldRef<"Roommate", 'String'>
    readonly languages: FieldRef<"Roommate", 'String'>
    readonly moveInDate: FieldRef<"Roommate", 'DateTime'>
    readonly createdAt: FieldRef<"Roommate", 'DateTime'>
    readonly updatedAt: FieldRef<"Roommate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Roommate findUnique
   */
  export type RoommateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roommate
     */
    select?: RoommateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoommateInclude<ExtArgs> | null
    /**
     * Filter, which Roommate to fetch.
     */
    where: RoommateWhereUniqueInput
  }

  /**
   * Roommate findUniqueOrThrow
   */
  export type RoommateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roommate
     */
    select?: RoommateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoommateInclude<ExtArgs> | null
    /**
     * Filter, which Roommate to fetch.
     */
    where: RoommateWhereUniqueInput
  }

  /**
   * Roommate findFirst
   */
  export type RoommateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roommate
     */
    select?: RoommateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoommateInclude<ExtArgs> | null
    /**
     * Filter, which Roommate to fetch.
     */
    where?: RoommateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roommates to fetch.
     */
    orderBy?: RoommateOrderByWithRelationInput | RoommateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roommates.
     */
    cursor?: RoommateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roommates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roommates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roommates.
     */
    distinct?: RoommateScalarFieldEnum | RoommateScalarFieldEnum[]
  }

  /**
   * Roommate findFirstOrThrow
   */
  export type RoommateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roommate
     */
    select?: RoommateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoommateInclude<ExtArgs> | null
    /**
     * Filter, which Roommate to fetch.
     */
    where?: RoommateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roommates to fetch.
     */
    orderBy?: RoommateOrderByWithRelationInput | RoommateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roommates.
     */
    cursor?: RoommateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roommates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roommates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roommates.
     */
    distinct?: RoommateScalarFieldEnum | RoommateScalarFieldEnum[]
  }

  /**
   * Roommate findMany
   */
  export type RoommateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roommate
     */
    select?: RoommateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoommateInclude<ExtArgs> | null
    /**
     * Filter, which Roommates to fetch.
     */
    where?: RoommateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roommates to fetch.
     */
    orderBy?: RoommateOrderByWithRelationInput | RoommateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roommates.
     */
    cursor?: RoommateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roommates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roommates.
     */
    skip?: number
    distinct?: RoommateScalarFieldEnum | RoommateScalarFieldEnum[]
  }

  /**
   * Roommate create
   */
  export type RoommateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roommate
     */
    select?: RoommateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoommateInclude<ExtArgs> | null
    /**
     * The data needed to create a Roommate.
     */
    data: XOR<RoommateCreateInput, RoommateUncheckedCreateInput>
  }

  /**
   * Roommate createMany
   */
  export type RoommateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roommates.
     */
    data: RoommateCreateManyInput | RoommateCreateManyInput[]
  }

  /**
   * Roommate createManyAndReturn
   */
  export type RoommateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roommate
     */
    select?: RoommateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Roommates.
     */
    data: RoommateCreateManyInput | RoommateCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoommateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Roommate update
   */
  export type RoommateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roommate
     */
    select?: RoommateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoommateInclude<ExtArgs> | null
    /**
     * The data needed to update a Roommate.
     */
    data: XOR<RoommateUpdateInput, RoommateUncheckedUpdateInput>
    /**
     * Choose, which Roommate to update.
     */
    where: RoommateWhereUniqueInput
  }

  /**
   * Roommate updateMany
   */
  export type RoommateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roommates.
     */
    data: XOR<RoommateUpdateManyMutationInput, RoommateUncheckedUpdateManyInput>
    /**
     * Filter which Roommates to update
     */
    where?: RoommateWhereInput
  }

  /**
   * Roommate upsert
   */
  export type RoommateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roommate
     */
    select?: RoommateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoommateInclude<ExtArgs> | null
    /**
     * The filter to search for the Roommate to update in case it exists.
     */
    where: RoommateWhereUniqueInput
    /**
     * In case the Roommate found by the `where` argument doesn't exist, create a new Roommate with this data.
     */
    create: XOR<RoommateCreateInput, RoommateUncheckedCreateInput>
    /**
     * In case the Roommate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoommateUpdateInput, RoommateUncheckedUpdateInput>
  }

  /**
   * Roommate delete
   */
  export type RoommateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roommate
     */
    select?: RoommateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoommateInclude<ExtArgs> | null
    /**
     * Filter which Roommate to delete.
     */
    where: RoommateWhereUniqueInput
  }

  /**
   * Roommate deleteMany
   */
  export type RoommateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roommates to delete
     */
    where?: RoommateWhereInput
  }

  /**
   * Roommate without action
   */
  export type RoommateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Roommate
     */
    select?: RoommateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoommateInclude<ExtArgs> | null
  }


  /**
   * Model Availability
   */

  export type AggregateAvailability = {
    _count: AvailabilityCountAggregateOutputType | null
    _avg: AvailabilityAvgAggregateOutputType | null
    _sum: AvailabilitySumAggregateOutputType | null
    _min: AvailabilityMinAggregateOutputType | null
    _max: AvailabilityMaxAggregateOutputType | null
  }

  export type AvailabilityAvgAggregateOutputType = {
    priceOverride: number | null
    minStay: number | null
  }

  export type AvailabilitySumAggregateOutputType = {
    priceOverride: number | null
    minStay: number | null
  }

  export type AvailabilityMinAggregateOutputType = {
    id: string | null
    listingId: string | null
    date: Date | null
    available: boolean | null
    priceOverride: number | null
    minStay: number | null
    note: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AvailabilityMaxAggregateOutputType = {
    id: string | null
    listingId: string | null
    date: Date | null
    available: boolean | null
    priceOverride: number | null
    minStay: number | null
    note: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AvailabilityCountAggregateOutputType = {
    id: number
    listingId: number
    date: number
    available: number
    priceOverride: number
    minStay: number
    note: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AvailabilityAvgAggregateInputType = {
    priceOverride?: true
    minStay?: true
  }

  export type AvailabilitySumAggregateInputType = {
    priceOverride?: true
    minStay?: true
  }

  export type AvailabilityMinAggregateInputType = {
    id?: true
    listingId?: true
    date?: true
    available?: true
    priceOverride?: true
    minStay?: true
    note?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AvailabilityMaxAggregateInputType = {
    id?: true
    listingId?: true
    date?: true
    available?: true
    priceOverride?: true
    minStay?: true
    note?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AvailabilityCountAggregateInputType = {
    id?: true
    listingId?: true
    date?: true
    available?: true
    priceOverride?: true
    minStay?: true
    note?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AvailabilityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Availability to aggregate.
     */
    where?: AvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Availabilities to fetch.
     */
    orderBy?: AvailabilityOrderByWithRelationInput | AvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Availabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Availabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Availabilities
    **/
    _count?: true | AvailabilityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AvailabilityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AvailabilitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AvailabilityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AvailabilityMaxAggregateInputType
  }

  export type GetAvailabilityAggregateType<T extends AvailabilityAggregateArgs> = {
        [P in keyof T & keyof AggregateAvailability]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAvailability[P]>
      : GetScalarType<T[P], AggregateAvailability[P]>
  }




  export type AvailabilityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AvailabilityWhereInput
    orderBy?: AvailabilityOrderByWithAggregationInput | AvailabilityOrderByWithAggregationInput[]
    by: AvailabilityScalarFieldEnum[] | AvailabilityScalarFieldEnum
    having?: AvailabilityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AvailabilityCountAggregateInputType | true
    _avg?: AvailabilityAvgAggregateInputType
    _sum?: AvailabilitySumAggregateInputType
    _min?: AvailabilityMinAggregateInputType
    _max?: AvailabilityMaxAggregateInputType
  }

  export type AvailabilityGroupByOutputType = {
    id: string
    listingId: string
    date: Date
    available: boolean
    priceOverride: number | null
    minStay: number | null
    note: string | null
    createdAt: Date
    updatedAt: Date
    _count: AvailabilityCountAggregateOutputType | null
    _avg: AvailabilityAvgAggregateOutputType | null
    _sum: AvailabilitySumAggregateOutputType | null
    _min: AvailabilityMinAggregateOutputType | null
    _max: AvailabilityMaxAggregateOutputType | null
  }

  type GetAvailabilityGroupByPayload<T extends AvailabilityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AvailabilityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AvailabilityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AvailabilityGroupByOutputType[P]>
            : GetScalarType<T[P], AvailabilityGroupByOutputType[P]>
        }
      >
    >


  export type AvailabilitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    listingId?: boolean
    date?: boolean
    available?: boolean
    priceOverride?: boolean
    minStay?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    listing?: boolean | ListingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["availability"]>

  export type AvailabilitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    listingId?: boolean
    date?: boolean
    available?: boolean
    priceOverride?: boolean
    minStay?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    listing?: boolean | ListingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["availability"]>

  export type AvailabilitySelectScalar = {
    id?: boolean
    listingId?: boolean
    date?: boolean
    available?: boolean
    priceOverride?: boolean
    minStay?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AvailabilityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    listing?: boolean | ListingDefaultArgs<ExtArgs>
  }
  export type AvailabilityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    listing?: boolean | ListingDefaultArgs<ExtArgs>
  }

  export type $AvailabilityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Availability"
    objects: {
      listing: Prisma.$ListingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      listingId: string
      date: Date
      available: boolean
      priceOverride: number | null
      minStay: number | null
      note: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["availability"]>
    composites: {}
  }

  type AvailabilityGetPayload<S extends boolean | null | undefined | AvailabilityDefaultArgs> = $Result.GetResult<Prisma.$AvailabilityPayload, S>

  type AvailabilityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AvailabilityFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AvailabilityCountAggregateInputType | true
    }

  export interface AvailabilityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Availability'], meta: { name: 'Availability' } }
    /**
     * Find zero or one Availability that matches the filter.
     * @param {AvailabilityFindUniqueArgs} args - Arguments to find a Availability
     * @example
     * // Get one Availability
     * const availability = await prisma.availability.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AvailabilityFindUniqueArgs>(args: SelectSubset<T, AvailabilityFindUniqueArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Availability that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AvailabilityFindUniqueOrThrowArgs} args - Arguments to find a Availability
     * @example
     * // Get one Availability
     * const availability = await prisma.availability.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AvailabilityFindUniqueOrThrowArgs>(args: SelectSubset<T, AvailabilityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Availability that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityFindFirstArgs} args - Arguments to find a Availability
     * @example
     * // Get one Availability
     * const availability = await prisma.availability.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AvailabilityFindFirstArgs>(args?: SelectSubset<T, AvailabilityFindFirstArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Availability that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityFindFirstOrThrowArgs} args - Arguments to find a Availability
     * @example
     * // Get one Availability
     * const availability = await prisma.availability.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AvailabilityFindFirstOrThrowArgs>(args?: SelectSubset<T, AvailabilityFindFirstOrThrowArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Availabilities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Availabilities
     * const availabilities = await prisma.availability.findMany()
     * 
     * // Get first 10 Availabilities
     * const availabilities = await prisma.availability.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const availabilityWithIdOnly = await prisma.availability.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AvailabilityFindManyArgs>(args?: SelectSubset<T, AvailabilityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Availability.
     * @param {AvailabilityCreateArgs} args - Arguments to create a Availability.
     * @example
     * // Create one Availability
     * const Availability = await prisma.availability.create({
     *   data: {
     *     // ... data to create a Availability
     *   }
     * })
     * 
     */
    create<T extends AvailabilityCreateArgs>(args: SelectSubset<T, AvailabilityCreateArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Availabilities.
     * @param {AvailabilityCreateManyArgs} args - Arguments to create many Availabilities.
     * @example
     * // Create many Availabilities
     * const availability = await prisma.availability.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AvailabilityCreateManyArgs>(args?: SelectSubset<T, AvailabilityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Availabilities and returns the data saved in the database.
     * @param {AvailabilityCreateManyAndReturnArgs} args - Arguments to create many Availabilities.
     * @example
     * // Create many Availabilities
     * const availability = await prisma.availability.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Availabilities and only return the `id`
     * const availabilityWithIdOnly = await prisma.availability.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AvailabilityCreateManyAndReturnArgs>(args?: SelectSubset<T, AvailabilityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Availability.
     * @param {AvailabilityDeleteArgs} args - Arguments to delete one Availability.
     * @example
     * // Delete one Availability
     * const Availability = await prisma.availability.delete({
     *   where: {
     *     // ... filter to delete one Availability
     *   }
     * })
     * 
     */
    delete<T extends AvailabilityDeleteArgs>(args: SelectSubset<T, AvailabilityDeleteArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Availability.
     * @param {AvailabilityUpdateArgs} args - Arguments to update one Availability.
     * @example
     * // Update one Availability
     * const availability = await prisma.availability.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AvailabilityUpdateArgs>(args: SelectSubset<T, AvailabilityUpdateArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Availabilities.
     * @param {AvailabilityDeleteManyArgs} args - Arguments to filter Availabilities to delete.
     * @example
     * // Delete a few Availabilities
     * const { count } = await prisma.availability.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AvailabilityDeleteManyArgs>(args?: SelectSubset<T, AvailabilityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Availabilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Availabilities
     * const availability = await prisma.availability.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AvailabilityUpdateManyArgs>(args: SelectSubset<T, AvailabilityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Availability.
     * @param {AvailabilityUpsertArgs} args - Arguments to update or create a Availability.
     * @example
     * // Update or create a Availability
     * const availability = await prisma.availability.upsert({
     *   create: {
     *     // ... data to create a Availability
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Availability we want to update
     *   }
     * })
     */
    upsert<T extends AvailabilityUpsertArgs>(args: SelectSubset<T, AvailabilityUpsertArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Availabilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityCountArgs} args - Arguments to filter Availabilities to count.
     * @example
     * // Count the number of Availabilities
     * const count = await prisma.availability.count({
     *   where: {
     *     // ... the filter for the Availabilities we want to count
     *   }
     * })
    **/
    count<T extends AvailabilityCountArgs>(
      args?: Subset<T, AvailabilityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AvailabilityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Availability.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AvailabilityAggregateArgs>(args: Subset<T, AvailabilityAggregateArgs>): Prisma.PrismaPromise<GetAvailabilityAggregateType<T>>

    /**
     * Group by Availability.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AvailabilityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AvailabilityGroupByArgs['orderBy'] }
        : { orderBy?: AvailabilityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AvailabilityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAvailabilityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Availability model
   */
  readonly fields: AvailabilityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Availability.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AvailabilityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    listing<T extends ListingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ListingDefaultArgs<ExtArgs>>): Prisma__ListingClient<$Result.GetResult<Prisma.$ListingPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Availability model
   */ 
  interface AvailabilityFieldRefs {
    readonly id: FieldRef<"Availability", 'String'>
    readonly listingId: FieldRef<"Availability", 'String'>
    readonly date: FieldRef<"Availability", 'DateTime'>
    readonly available: FieldRef<"Availability", 'Boolean'>
    readonly priceOverride: FieldRef<"Availability", 'Int'>
    readonly minStay: FieldRef<"Availability", 'Int'>
    readonly note: FieldRef<"Availability", 'String'>
    readonly createdAt: FieldRef<"Availability", 'DateTime'>
    readonly updatedAt: FieldRef<"Availability", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Availability findUnique
   */
  export type AvailabilityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which Availability to fetch.
     */
    where: AvailabilityWhereUniqueInput
  }

  /**
   * Availability findUniqueOrThrow
   */
  export type AvailabilityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which Availability to fetch.
     */
    where: AvailabilityWhereUniqueInput
  }

  /**
   * Availability findFirst
   */
  export type AvailabilityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which Availability to fetch.
     */
    where?: AvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Availabilities to fetch.
     */
    orderBy?: AvailabilityOrderByWithRelationInput | AvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Availabilities.
     */
    cursor?: AvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Availabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Availabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Availabilities.
     */
    distinct?: AvailabilityScalarFieldEnum | AvailabilityScalarFieldEnum[]
  }

  /**
   * Availability findFirstOrThrow
   */
  export type AvailabilityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which Availability to fetch.
     */
    where?: AvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Availabilities to fetch.
     */
    orderBy?: AvailabilityOrderByWithRelationInput | AvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Availabilities.
     */
    cursor?: AvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Availabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Availabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Availabilities.
     */
    distinct?: AvailabilityScalarFieldEnum | AvailabilityScalarFieldEnum[]
  }

  /**
   * Availability findMany
   */
  export type AvailabilityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which Availabilities to fetch.
     */
    where?: AvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Availabilities to fetch.
     */
    orderBy?: AvailabilityOrderByWithRelationInput | AvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Availabilities.
     */
    cursor?: AvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Availabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Availabilities.
     */
    skip?: number
    distinct?: AvailabilityScalarFieldEnum | AvailabilityScalarFieldEnum[]
  }

  /**
   * Availability create
   */
  export type AvailabilityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * The data needed to create a Availability.
     */
    data: XOR<AvailabilityCreateInput, AvailabilityUncheckedCreateInput>
  }

  /**
   * Availability createMany
   */
  export type AvailabilityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Availabilities.
     */
    data: AvailabilityCreateManyInput | AvailabilityCreateManyInput[]
  }

  /**
   * Availability createManyAndReturn
   */
  export type AvailabilityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Availabilities.
     */
    data: AvailabilityCreateManyInput | AvailabilityCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Availability update
   */
  export type AvailabilityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * The data needed to update a Availability.
     */
    data: XOR<AvailabilityUpdateInput, AvailabilityUncheckedUpdateInput>
    /**
     * Choose, which Availability to update.
     */
    where: AvailabilityWhereUniqueInput
  }

  /**
   * Availability updateMany
   */
  export type AvailabilityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Availabilities.
     */
    data: XOR<AvailabilityUpdateManyMutationInput, AvailabilityUncheckedUpdateManyInput>
    /**
     * Filter which Availabilities to update
     */
    where?: AvailabilityWhereInput
  }

  /**
   * Availability upsert
   */
  export type AvailabilityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * The filter to search for the Availability to update in case it exists.
     */
    where: AvailabilityWhereUniqueInput
    /**
     * In case the Availability found by the `where` argument doesn't exist, create a new Availability with this data.
     */
    create: XOR<AvailabilityCreateInput, AvailabilityUncheckedCreateInput>
    /**
     * In case the Availability was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AvailabilityUpdateInput, AvailabilityUncheckedUpdateInput>
  }

  /**
   * Availability delete
   */
  export type AvailabilityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * Filter which Availability to delete.
     */
    where: AvailabilityWhereUniqueInput
  }

  /**
   * Availability deleteMany
   */
  export type AvailabilityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Availabilities to delete
     */
    where?: AvailabilityWhereInput
  }

  /**
   * Availability without action
   */
  export type AvailabilityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ListingScalarFieldEnum: {
    id: 'id',
    hostId: 'hostId',
    title: 'title',
    description: 'description',
    type: 'type',
    status: 'status',
    address: 'address',
    city: 'city',
    state: 'state',
    zipCode: 'zipCode',
    neighborhood: 'neighborhood',
    lat: 'lat',
    lng: 'lng',
    price: 'price',
    currency: 'currency',
    depositAmount: 'depositAmount',
    utilitiesIncluded: 'utilitiesIncluded',
    bedrooms: 'bedrooms',
    bathrooms: 'bathrooms',
    squareFeet: 'squareFeet',
    furnished: 'furnished',
    freedomScore: 'freedomScore',
    smokingAllowed: 'smokingAllowed',
    petsAllowed: 'petsAllowed',
    partyFriendly: 'partyFriendly',
    dietaryPreference: 'dietaryPreference',
    virtualTourUrl: 'virtualTourUrl',
    availableFrom: 'availableFrom',
    availableUntil: 'availableUntil',
    minStay: 'minStay',
    maxStay: 'maxStay',
    instantBook: 'instantBook',
    amenities: 'amenities',
    houseRules: 'houseRules',
    viewCount: 'viewCount',
    favoriteCount: 'favoriteCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ListingScalarFieldEnum = (typeof ListingScalarFieldEnum)[keyof typeof ListingScalarFieldEnum]


  export const PhotoScalarFieldEnum: {
    id: 'id',
    listingId: 'listingId',
    url: 'url',
    caption: 'caption',
    isPrimary: 'isPrimary',
    order: 'order',
    createdAt: 'createdAt'
  };

  export type PhotoScalarFieldEnum = (typeof PhotoScalarFieldEnum)[keyof typeof PhotoScalarFieldEnum]


  export const RoommateScalarFieldEnum: {
    id: 'id',
    listingId: 'listingId',
    name: 'name',
    age: 'age',
    occupation: 'occupation',
    bio: 'bio',
    image: 'image',
    languages: 'languages',
    moveInDate: 'moveInDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoommateScalarFieldEnum = (typeof RoommateScalarFieldEnum)[keyof typeof RoommateScalarFieldEnum]


  export const AvailabilityScalarFieldEnum: {
    id: 'id',
    listingId: 'listingId',
    date: 'date',
    available: 'available',
    priceOverride: 'priceOverride',
    minStay: 'minStay',
    note: 'note',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AvailabilityScalarFieldEnum = (typeof AvailabilityScalarFieldEnum)[keyof typeof AvailabilityScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    
  /**
   * Deep Input Types
   */


  export type ListingWhereInput = {
    AND?: ListingWhereInput | ListingWhereInput[]
    OR?: ListingWhereInput[]
    NOT?: ListingWhereInput | ListingWhereInput[]
    id?: StringFilter<"Listing"> | string
    hostId?: StringFilter<"Listing"> | string
    title?: StringFilter<"Listing"> | string
    description?: StringFilter<"Listing"> | string
    type?: StringFilter<"Listing"> | string
    status?: StringFilter<"Listing"> | string
    address?: StringNullableFilter<"Listing"> | string | null
    city?: StringFilter<"Listing"> | string
    state?: StringFilter<"Listing"> | string
    zipCode?: StringNullableFilter<"Listing"> | string | null
    neighborhood?: StringNullableFilter<"Listing"> | string | null
    lat?: FloatNullableFilter<"Listing"> | number | null
    lng?: FloatNullableFilter<"Listing"> | number | null
    price?: IntFilter<"Listing"> | number
    currency?: StringFilter<"Listing"> | string
    depositAmount?: IntNullableFilter<"Listing"> | number | null
    utilitiesIncluded?: BoolFilter<"Listing"> | boolean
    bedrooms?: IntFilter<"Listing"> | number
    bathrooms?: FloatFilter<"Listing"> | number
    squareFeet?: IntNullableFilter<"Listing"> | number | null
    furnished?: BoolFilter<"Listing"> | boolean
    freedomScore?: IntFilter<"Listing"> | number
    smokingAllowed?: BoolFilter<"Listing"> | boolean
    petsAllowed?: BoolFilter<"Listing"> | boolean
    partyFriendly?: BoolFilter<"Listing"> | boolean
    dietaryPreference?: StringNullableFilter<"Listing"> | string | null
    virtualTourUrl?: StringNullableFilter<"Listing"> | string | null
    availableFrom?: DateTimeFilter<"Listing"> | Date | string
    availableUntil?: DateTimeNullableFilter<"Listing"> | Date | string | null
    minStay?: IntNullableFilter<"Listing"> | number | null
    maxStay?: IntNullableFilter<"Listing"> | number | null
    instantBook?: BoolFilter<"Listing"> | boolean
    amenities?: StringFilter<"Listing"> | string
    houseRules?: StringFilter<"Listing"> | string
    viewCount?: IntFilter<"Listing"> | number
    favoriteCount?: IntFilter<"Listing"> | number
    createdAt?: DateTimeFilter<"Listing"> | Date | string
    updatedAt?: DateTimeFilter<"Listing"> | Date | string
    photos?: PhotoListRelationFilter
    roommates?: RoommateListRelationFilter
    availability?: AvailabilityListRelationFilter
  }

  export type ListingOrderByWithRelationInput = {
    id?: SortOrder
    hostId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrderInput | SortOrder
    neighborhood?: SortOrderInput | SortOrder
    lat?: SortOrderInput | SortOrder
    lng?: SortOrderInput | SortOrder
    price?: SortOrder
    currency?: SortOrder
    depositAmount?: SortOrderInput | SortOrder
    utilitiesIncluded?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    squareFeet?: SortOrderInput | SortOrder
    furnished?: SortOrder
    freedomScore?: SortOrder
    smokingAllowed?: SortOrder
    petsAllowed?: SortOrder
    partyFriendly?: SortOrder
    dietaryPreference?: SortOrderInput | SortOrder
    virtualTourUrl?: SortOrderInput | SortOrder
    availableFrom?: SortOrder
    availableUntil?: SortOrderInput | SortOrder
    minStay?: SortOrderInput | SortOrder
    maxStay?: SortOrderInput | SortOrder
    instantBook?: SortOrder
    amenities?: SortOrder
    houseRules?: SortOrder
    viewCount?: SortOrder
    favoriteCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    photos?: PhotoOrderByRelationAggregateInput
    roommates?: RoommateOrderByRelationAggregateInput
    availability?: AvailabilityOrderByRelationAggregateInput
  }

  export type ListingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ListingWhereInput | ListingWhereInput[]
    OR?: ListingWhereInput[]
    NOT?: ListingWhereInput | ListingWhereInput[]
    hostId?: StringFilter<"Listing"> | string
    title?: StringFilter<"Listing"> | string
    description?: StringFilter<"Listing"> | string
    type?: StringFilter<"Listing"> | string
    status?: StringFilter<"Listing"> | string
    address?: StringNullableFilter<"Listing"> | string | null
    city?: StringFilter<"Listing"> | string
    state?: StringFilter<"Listing"> | string
    zipCode?: StringNullableFilter<"Listing"> | string | null
    neighborhood?: StringNullableFilter<"Listing"> | string | null
    lat?: FloatNullableFilter<"Listing"> | number | null
    lng?: FloatNullableFilter<"Listing"> | number | null
    price?: IntFilter<"Listing"> | number
    currency?: StringFilter<"Listing"> | string
    depositAmount?: IntNullableFilter<"Listing"> | number | null
    utilitiesIncluded?: BoolFilter<"Listing"> | boolean
    bedrooms?: IntFilter<"Listing"> | number
    bathrooms?: FloatFilter<"Listing"> | number
    squareFeet?: IntNullableFilter<"Listing"> | number | null
    furnished?: BoolFilter<"Listing"> | boolean
    freedomScore?: IntFilter<"Listing"> | number
    smokingAllowed?: BoolFilter<"Listing"> | boolean
    petsAllowed?: BoolFilter<"Listing"> | boolean
    partyFriendly?: BoolFilter<"Listing"> | boolean
    dietaryPreference?: StringNullableFilter<"Listing"> | string | null
    virtualTourUrl?: StringNullableFilter<"Listing"> | string | null
    availableFrom?: DateTimeFilter<"Listing"> | Date | string
    availableUntil?: DateTimeNullableFilter<"Listing"> | Date | string | null
    minStay?: IntNullableFilter<"Listing"> | number | null
    maxStay?: IntNullableFilter<"Listing"> | number | null
    instantBook?: BoolFilter<"Listing"> | boolean
    amenities?: StringFilter<"Listing"> | string
    houseRules?: StringFilter<"Listing"> | string
    viewCount?: IntFilter<"Listing"> | number
    favoriteCount?: IntFilter<"Listing"> | number
    createdAt?: DateTimeFilter<"Listing"> | Date | string
    updatedAt?: DateTimeFilter<"Listing"> | Date | string
    photos?: PhotoListRelationFilter
    roommates?: RoommateListRelationFilter
    availability?: AvailabilityListRelationFilter
  }, "id">

  export type ListingOrderByWithAggregationInput = {
    id?: SortOrder
    hostId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrderInput | SortOrder
    neighborhood?: SortOrderInput | SortOrder
    lat?: SortOrderInput | SortOrder
    lng?: SortOrderInput | SortOrder
    price?: SortOrder
    currency?: SortOrder
    depositAmount?: SortOrderInput | SortOrder
    utilitiesIncluded?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    squareFeet?: SortOrderInput | SortOrder
    furnished?: SortOrder
    freedomScore?: SortOrder
    smokingAllowed?: SortOrder
    petsAllowed?: SortOrder
    partyFriendly?: SortOrder
    dietaryPreference?: SortOrderInput | SortOrder
    virtualTourUrl?: SortOrderInput | SortOrder
    availableFrom?: SortOrder
    availableUntil?: SortOrderInput | SortOrder
    minStay?: SortOrderInput | SortOrder
    maxStay?: SortOrderInput | SortOrder
    instantBook?: SortOrder
    amenities?: SortOrder
    houseRules?: SortOrder
    viewCount?: SortOrder
    favoriteCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ListingCountOrderByAggregateInput
    _avg?: ListingAvgOrderByAggregateInput
    _max?: ListingMaxOrderByAggregateInput
    _min?: ListingMinOrderByAggregateInput
    _sum?: ListingSumOrderByAggregateInput
  }

  export type ListingScalarWhereWithAggregatesInput = {
    AND?: ListingScalarWhereWithAggregatesInput | ListingScalarWhereWithAggregatesInput[]
    OR?: ListingScalarWhereWithAggregatesInput[]
    NOT?: ListingScalarWhereWithAggregatesInput | ListingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Listing"> | string
    hostId?: StringWithAggregatesFilter<"Listing"> | string
    title?: StringWithAggregatesFilter<"Listing"> | string
    description?: StringWithAggregatesFilter<"Listing"> | string
    type?: StringWithAggregatesFilter<"Listing"> | string
    status?: StringWithAggregatesFilter<"Listing"> | string
    address?: StringNullableWithAggregatesFilter<"Listing"> | string | null
    city?: StringWithAggregatesFilter<"Listing"> | string
    state?: StringWithAggregatesFilter<"Listing"> | string
    zipCode?: StringNullableWithAggregatesFilter<"Listing"> | string | null
    neighborhood?: StringNullableWithAggregatesFilter<"Listing"> | string | null
    lat?: FloatNullableWithAggregatesFilter<"Listing"> | number | null
    lng?: FloatNullableWithAggregatesFilter<"Listing"> | number | null
    price?: IntWithAggregatesFilter<"Listing"> | number
    currency?: StringWithAggregatesFilter<"Listing"> | string
    depositAmount?: IntNullableWithAggregatesFilter<"Listing"> | number | null
    utilitiesIncluded?: BoolWithAggregatesFilter<"Listing"> | boolean
    bedrooms?: IntWithAggregatesFilter<"Listing"> | number
    bathrooms?: FloatWithAggregatesFilter<"Listing"> | number
    squareFeet?: IntNullableWithAggregatesFilter<"Listing"> | number | null
    furnished?: BoolWithAggregatesFilter<"Listing"> | boolean
    freedomScore?: IntWithAggregatesFilter<"Listing"> | number
    smokingAllowed?: BoolWithAggregatesFilter<"Listing"> | boolean
    petsAllowed?: BoolWithAggregatesFilter<"Listing"> | boolean
    partyFriendly?: BoolWithAggregatesFilter<"Listing"> | boolean
    dietaryPreference?: StringNullableWithAggregatesFilter<"Listing"> | string | null
    virtualTourUrl?: StringNullableWithAggregatesFilter<"Listing"> | string | null
    availableFrom?: DateTimeWithAggregatesFilter<"Listing"> | Date | string
    availableUntil?: DateTimeNullableWithAggregatesFilter<"Listing"> | Date | string | null
    minStay?: IntNullableWithAggregatesFilter<"Listing"> | number | null
    maxStay?: IntNullableWithAggregatesFilter<"Listing"> | number | null
    instantBook?: BoolWithAggregatesFilter<"Listing"> | boolean
    amenities?: StringWithAggregatesFilter<"Listing"> | string
    houseRules?: StringWithAggregatesFilter<"Listing"> | string
    viewCount?: IntWithAggregatesFilter<"Listing"> | number
    favoriteCount?: IntWithAggregatesFilter<"Listing"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Listing"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Listing"> | Date | string
  }

  export type PhotoWhereInput = {
    AND?: PhotoWhereInput | PhotoWhereInput[]
    OR?: PhotoWhereInput[]
    NOT?: PhotoWhereInput | PhotoWhereInput[]
    id?: StringFilter<"Photo"> | string
    listingId?: StringFilter<"Photo"> | string
    url?: StringFilter<"Photo"> | string
    caption?: StringNullableFilter<"Photo"> | string | null
    isPrimary?: BoolFilter<"Photo"> | boolean
    order?: IntFilter<"Photo"> | number
    createdAt?: DateTimeFilter<"Photo"> | Date | string
    listing?: XOR<ListingRelationFilter, ListingWhereInput>
  }

  export type PhotoOrderByWithRelationInput = {
    id?: SortOrder
    listingId?: SortOrder
    url?: SortOrder
    caption?: SortOrderInput | SortOrder
    isPrimary?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    listing?: ListingOrderByWithRelationInput
  }

  export type PhotoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PhotoWhereInput | PhotoWhereInput[]
    OR?: PhotoWhereInput[]
    NOT?: PhotoWhereInput | PhotoWhereInput[]
    listingId?: StringFilter<"Photo"> | string
    url?: StringFilter<"Photo"> | string
    caption?: StringNullableFilter<"Photo"> | string | null
    isPrimary?: BoolFilter<"Photo"> | boolean
    order?: IntFilter<"Photo"> | number
    createdAt?: DateTimeFilter<"Photo"> | Date | string
    listing?: XOR<ListingRelationFilter, ListingWhereInput>
  }, "id">

  export type PhotoOrderByWithAggregationInput = {
    id?: SortOrder
    listingId?: SortOrder
    url?: SortOrder
    caption?: SortOrderInput | SortOrder
    isPrimary?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    _count?: PhotoCountOrderByAggregateInput
    _avg?: PhotoAvgOrderByAggregateInput
    _max?: PhotoMaxOrderByAggregateInput
    _min?: PhotoMinOrderByAggregateInput
    _sum?: PhotoSumOrderByAggregateInput
  }

  export type PhotoScalarWhereWithAggregatesInput = {
    AND?: PhotoScalarWhereWithAggregatesInput | PhotoScalarWhereWithAggregatesInput[]
    OR?: PhotoScalarWhereWithAggregatesInput[]
    NOT?: PhotoScalarWhereWithAggregatesInput | PhotoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Photo"> | string
    listingId?: StringWithAggregatesFilter<"Photo"> | string
    url?: StringWithAggregatesFilter<"Photo"> | string
    caption?: StringNullableWithAggregatesFilter<"Photo"> | string | null
    isPrimary?: BoolWithAggregatesFilter<"Photo"> | boolean
    order?: IntWithAggregatesFilter<"Photo"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Photo"> | Date | string
  }

  export type RoommateWhereInput = {
    AND?: RoommateWhereInput | RoommateWhereInput[]
    OR?: RoommateWhereInput[]
    NOT?: RoommateWhereInput | RoommateWhereInput[]
    id?: StringFilter<"Roommate"> | string
    listingId?: StringFilter<"Roommate"> | string
    name?: StringFilter<"Roommate"> | string
    age?: IntNullableFilter<"Roommate"> | number | null
    occupation?: StringNullableFilter<"Roommate"> | string | null
    bio?: StringNullableFilter<"Roommate"> | string | null
    image?: StringNullableFilter<"Roommate"> | string | null
    languages?: StringFilter<"Roommate"> | string
    moveInDate?: DateTimeNullableFilter<"Roommate"> | Date | string | null
    createdAt?: DateTimeFilter<"Roommate"> | Date | string
    updatedAt?: DateTimeFilter<"Roommate"> | Date | string
    listing?: XOR<ListingRelationFilter, ListingWhereInput>
  }

  export type RoommateOrderByWithRelationInput = {
    id?: SortOrder
    listingId?: SortOrder
    name?: SortOrder
    age?: SortOrderInput | SortOrder
    occupation?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    languages?: SortOrder
    moveInDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    listing?: ListingOrderByWithRelationInput
  }

  export type RoommateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RoommateWhereInput | RoommateWhereInput[]
    OR?: RoommateWhereInput[]
    NOT?: RoommateWhereInput | RoommateWhereInput[]
    listingId?: StringFilter<"Roommate"> | string
    name?: StringFilter<"Roommate"> | string
    age?: IntNullableFilter<"Roommate"> | number | null
    occupation?: StringNullableFilter<"Roommate"> | string | null
    bio?: StringNullableFilter<"Roommate"> | string | null
    image?: StringNullableFilter<"Roommate"> | string | null
    languages?: StringFilter<"Roommate"> | string
    moveInDate?: DateTimeNullableFilter<"Roommate"> | Date | string | null
    createdAt?: DateTimeFilter<"Roommate"> | Date | string
    updatedAt?: DateTimeFilter<"Roommate"> | Date | string
    listing?: XOR<ListingRelationFilter, ListingWhereInput>
  }, "id">

  export type RoommateOrderByWithAggregationInput = {
    id?: SortOrder
    listingId?: SortOrder
    name?: SortOrder
    age?: SortOrderInput | SortOrder
    occupation?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    languages?: SortOrder
    moveInDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoommateCountOrderByAggregateInput
    _avg?: RoommateAvgOrderByAggregateInput
    _max?: RoommateMaxOrderByAggregateInput
    _min?: RoommateMinOrderByAggregateInput
    _sum?: RoommateSumOrderByAggregateInput
  }

  export type RoommateScalarWhereWithAggregatesInput = {
    AND?: RoommateScalarWhereWithAggregatesInput | RoommateScalarWhereWithAggregatesInput[]
    OR?: RoommateScalarWhereWithAggregatesInput[]
    NOT?: RoommateScalarWhereWithAggregatesInput | RoommateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Roommate"> | string
    listingId?: StringWithAggregatesFilter<"Roommate"> | string
    name?: StringWithAggregatesFilter<"Roommate"> | string
    age?: IntNullableWithAggregatesFilter<"Roommate"> | number | null
    occupation?: StringNullableWithAggregatesFilter<"Roommate"> | string | null
    bio?: StringNullableWithAggregatesFilter<"Roommate"> | string | null
    image?: StringNullableWithAggregatesFilter<"Roommate"> | string | null
    languages?: StringWithAggregatesFilter<"Roommate"> | string
    moveInDate?: DateTimeNullableWithAggregatesFilter<"Roommate"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Roommate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Roommate"> | Date | string
  }

  export type AvailabilityWhereInput = {
    AND?: AvailabilityWhereInput | AvailabilityWhereInput[]
    OR?: AvailabilityWhereInput[]
    NOT?: AvailabilityWhereInput | AvailabilityWhereInput[]
    id?: StringFilter<"Availability"> | string
    listingId?: StringFilter<"Availability"> | string
    date?: DateTimeFilter<"Availability"> | Date | string
    available?: BoolFilter<"Availability"> | boolean
    priceOverride?: IntNullableFilter<"Availability"> | number | null
    minStay?: IntNullableFilter<"Availability"> | number | null
    note?: StringNullableFilter<"Availability"> | string | null
    createdAt?: DateTimeFilter<"Availability"> | Date | string
    updatedAt?: DateTimeFilter<"Availability"> | Date | string
    listing?: XOR<ListingRelationFilter, ListingWhereInput>
  }

  export type AvailabilityOrderByWithRelationInput = {
    id?: SortOrder
    listingId?: SortOrder
    date?: SortOrder
    available?: SortOrder
    priceOverride?: SortOrderInput | SortOrder
    minStay?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    listing?: ListingOrderByWithRelationInput
  }

  export type AvailabilityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    listingId_date?: AvailabilityListingIdDateCompoundUniqueInput
    AND?: AvailabilityWhereInput | AvailabilityWhereInput[]
    OR?: AvailabilityWhereInput[]
    NOT?: AvailabilityWhereInput | AvailabilityWhereInput[]
    listingId?: StringFilter<"Availability"> | string
    date?: DateTimeFilter<"Availability"> | Date | string
    available?: BoolFilter<"Availability"> | boolean
    priceOverride?: IntNullableFilter<"Availability"> | number | null
    minStay?: IntNullableFilter<"Availability"> | number | null
    note?: StringNullableFilter<"Availability"> | string | null
    createdAt?: DateTimeFilter<"Availability"> | Date | string
    updatedAt?: DateTimeFilter<"Availability"> | Date | string
    listing?: XOR<ListingRelationFilter, ListingWhereInput>
  }, "id" | "listingId_date">

  export type AvailabilityOrderByWithAggregationInput = {
    id?: SortOrder
    listingId?: SortOrder
    date?: SortOrder
    available?: SortOrder
    priceOverride?: SortOrderInput | SortOrder
    minStay?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AvailabilityCountOrderByAggregateInput
    _avg?: AvailabilityAvgOrderByAggregateInput
    _max?: AvailabilityMaxOrderByAggregateInput
    _min?: AvailabilityMinOrderByAggregateInput
    _sum?: AvailabilitySumOrderByAggregateInput
  }

  export type AvailabilityScalarWhereWithAggregatesInput = {
    AND?: AvailabilityScalarWhereWithAggregatesInput | AvailabilityScalarWhereWithAggregatesInput[]
    OR?: AvailabilityScalarWhereWithAggregatesInput[]
    NOT?: AvailabilityScalarWhereWithAggregatesInput | AvailabilityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Availability"> | string
    listingId?: StringWithAggregatesFilter<"Availability"> | string
    date?: DateTimeWithAggregatesFilter<"Availability"> | Date | string
    available?: BoolWithAggregatesFilter<"Availability"> | boolean
    priceOverride?: IntNullableWithAggregatesFilter<"Availability"> | number | null
    minStay?: IntNullableWithAggregatesFilter<"Availability"> | number | null
    note?: StringNullableWithAggregatesFilter<"Availability"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Availability"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Availability"> | Date | string
  }

  export type ListingCreateInput = {
    id?: string
    hostId: string
    title: string
    description: string
    type: string
    status?: string
    address?: string | null
    city: string
    state: string
    zipCode?: string | null
    neighborhood?: string | null
    lat?: number | null
    lng?: number | null
    price: number
    currency?: string
    depositAmount?: number | null
    utilitiesIncluded?: boolean
    bedrooms: number
    bathrooms: number
    squareFeet?: number | null
    furnished?: boolean
    freedomScore?: number
    smokingAllowed?: boolean
    petsAllowed?: boolean
    partyFriendly?: boolean
    dietaryPreference?: string | null
    virtualTourUrl?: string | null
    availableFrom: Date | string
    availableUntil?: Date | string | null
    minStay?: number | null
    maxStay?: number | null
    instantBook?: boolean
    amenities?: string
    houseRules?: string
    viewCount?: number
    favoriteCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutListingInput
    roommates?: RoommateCreateNestedManyWithoutListingInput
    availability?: AvailabilityCreateNestedManyWithoutListingInput
  }

  export type ListingUncheckedCreateInput = {
    id?: string
    hostId: string
    title: string
    description: string
    type: string
    status?: string
    address?: string | null
    city: string
    state: string
    zipCode?: string | null
    neighborhood?: string | null
    lat?: number | null
    lng?: number | null
    price: number
    currency?: string
    depositAmount?: number | null
    utilitiesIncluded?: boolean
    bedrooms: number
    bathrooms: number
    squareFeet?: number | null
    furnished?: boolean
    freedomScore?: number
    smokingAllowed?: boolean
    petsAllowed?: boolean
    partyFriendly?: boolean
    dietaryPreference?: string | null
    virtualTourUrl?: string | null
    availableFrom: Date | string
    availableUntil?: Date | string | null
    minStay?: number | null
    maxStay?: number | null
    instantBook?: boolean
    amenities?: string
    houseRules?: string
    viewCount?: number
    favoriteCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutListingInput
    roommates?: RoommateUncheckedCreateNestedManyWithoutListingInput
    availability?: AvailabilityUncheckedCreateNestedManyWithoutListingInput
  }

  export type ListingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    neighborhood?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    depositAmount?: NullableIntFieldUpdateOperationsInput | number | null
    utilitiesIncluded?: BoolFieldUpdateOperationsInput | boolean
    bedrooms?: IntFieldUpdateOperationsInput | number
    bathrooms?: FloatFieldUpdateOperationsInput | number
    squareFeet?: NullableIntFieldUpdateOperationsInput | number | null
    furnished?: BoolFieldUpdateOperationsInput | boolean
    freedomScore?: IntFieldUpdateOperationsInput | number
    smokingAllowed?: BoolFieldUpdateOperationsInput | boolean
    petsAllowed?: BoolFieldUpdateOperationsInput | boolean
    partyFriendly?: BoolFieldUpdateOperationsInput | boolean
    dietaryPreference?: NullableStringFieldUpdateOperationsInput | string | null
    virtualTourUrl?: NullableStringFieldUpdateOperationsInput | string | null
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    availableUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    maxStay?: NullableIntFieldUpdateOperationsInput | number | null
    instantBook?: BoolFieldUpdateOperationsInput | boolean
    amenities?: StringFieldUpdateOperationsInput | string
    houseRules?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    favoriteCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutListingNestedInput
    roommates?: RoommateUpdateManyWithoutListingNestedInput
    availability?: AvailabilityUpdateManyWithoutListingNestedInput
  }

  export type ListingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    neighborhood?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    depositAmount?: NullableIntFieldUpdateOperationsInput | number | null
    utilitiesIncluded?: BoolFieldUpdateOperationsInput | boolean
    bedrooms?: IntFieldUpdateOperationsInput | number
    bathrooms?: FloatFieldUpdateOperationsInput | number
    squareFeet?: NullableIntFieldUpdateOperationsInput | number | null
    furnished?: BoolFieldUpdateOperationsInput | boolean
    freedomScore?: IntFieldUpdateOperationsInput | number
    smokingAllowed?: BoolFieldUpdateOperationsInput | boolean
    petsAllowed?: BoolFieldUpdateOperationsInput | boolean
    partyFriendly?: BoolFieldUpdateOperationsInput | boolean
    dietaryPreference?: NullableStringFieldUpdateOperationsInput | string | null
    virtualTourUrl?: NullableStringFieldUpdateOperationsInput | string | null
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    availableUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    maxStay?: NullableIntFieldUpdateOperationsInput | number | null
    instantBook?: BoolFieldUpdateOperationsInput | boolean
    amenities?: StringFieldUpdateOperationsInput | string
    houseRules?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    favoriteCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutListingNestedInput
    roommates?: RoommateUncheckedUpdateManyWithoutListingNestedInput
    availability?: AvailabilityUncheckedUpdateManyWithoutListingNestedInput
  }

  export type ListingCreateManyInput = {
    id?: string
    hostId: string
    title: string
    description: string
    type: string
    status?: string
    address?: string | null
    city: string
    state: string
    zipCode?: string | null
    neighborhood?: string | null
    lat?: number | null
    lng?: number | null
    price: number
    currency?: string
    depositAmount?: number | null
    utilitiesIncluded?: boolean
    bedrooms: number
    bathrooms: number
    squareFeet?: number | null
    furnished?: boolean
    freedomScore?: number
    smokingAllowed?: boolean
    petsAllowed?: boolean
    partyFriendly?: boolean
    dietaryPreference?: string | null
    virtualTourUrl?: string | null
    availableFrom: Date | string
    availableUntil?: Date | string | null
    minStay?: number | null
    maxStay?: number | null
    instantBook?: boolean
    amenities?: string
    houseRules?: string
    viewCount?: number
    favoriteCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ListingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    neighborhood?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    depositAmount?: NullableIntFieldUpdateOperationsInput | number | null
    utilitiesIncluded?: BoolFieldUpdateOperationsInput | boolean
    bedrooms?: IntFieldUpdateOperationsInput | number
    bathrooms?: FloatFieldUpdateOperationsInput | number
    squareFeet?: NullableIntFieldUpdateOperationsInput | number | null
    furnished?: BoolFieldUpdateOperationsInput | boolean
    freedomScore?: IntFieldUpdateOperationsInput | number
    smokingAllowed?: BoolFieldUpdateOperationsInput | boolean
    petsAllowed?: BoolFieldUpdateOperationsInput | boolean
    partyFriendly?: BoolFieldUpdateOperationsInput | boolean
    dietaryPreference?: NullableStringFieldUpdateOperationsInput | string | null
    virtualTourUrl?: NullableStringFieldUpdateOperationsInput | string | null
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    availableUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    maxStay?: NullableIntFieldUpdateOperationsInput | number | null
    instantBook?: BoolFieldUpdateOperationsInput | boolean
    amenities?: StringFieldUpdateOperationsInput | string
    houseRules?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    favoriteCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    neighborhood?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    depositAmount?: NullableIntFieldUpdateOperationsInput | number | null
    utilitiesIncluded?: BoolFieldUpdateOperationsInput | boolean
    bedrooms?: IntFieldUpdateOperationsInput | number
    bathrooms?: FloatFieldUpdateOperationsInput | number
    squareFeet?: NullableIntFieldUpdateOperationsInput | number | null
    furnished?: BoolFieldUpdateOperationsInput | boolean
    freedomScore?: IntFieldUpdateOperationsInput | number
    smokingAllowed?: BoolFieldUpdateOperationsInput | boolean
    petsAllowed?: BoolFieldUpdateOperationsInput | boolean
    partyFriendly?: BoolFieldUpdateOperationsInput | boolean
    dietaryPreference?: NullableStringFieldUpdateOperationsInput | string | null
    virtualTourUrl?: NullableStringFieldUpdateOperationsInput | string | null
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    availableUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    maxStay?: NullableIntFieldUpdateOperationsInput | number | null
    instantBook?: BoolFieldUpdateOperationsInput | boolean
    amenities?: StringFieldUpdateOperationsInput | string
    houseRules?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    favoriteCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoCreateInput = {
    id?: string
    url: string
    caption?: string | null
    isPrimary?: boolean
    order?: number
    createdAt?: Date | string
    listing: ListingCreateNestedOneWithoutPhotosInput
  }

  export type PhotoUncheckedCreateInput = {
    id?: string
    listingId: string
    url: string
    caption?: string | null
    isPrimary?: boolean
    order?: number
    createdAt?: Date | string
  }

  export type PhotoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    listing?: ListingUpdateOneRequiredWithoutPhotosNestedInput
  }

  export type PhotoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoCreateManyInput = {
    id?: string
    listingId: string
    url: string
    caption?: string | null
    isPrimary?: boolean
    order?: number
    createdAt?: Date | string
  }

  export type PhotoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoommateCreateInput = {
    id?: string
    name: string
    age?: number | null
    occupation?: string | null
    bio?: string | null
    image?: string | null
    languages?: string
    moveInDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    listing: ListingCreateNestedOneWithoutRoommatesInput
  }

  export type RoommateUncheckedCreateInput = {
    id?: string
    listingId: string
    name: string
    age?: number | null
    occupation?: string | null
    bio?: string | null
    image?: string | null
    languages?: string
    moveInDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoommateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    languages?: StringFieldUpdateOperationsInput | string
    moveInDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    listing?: ListingUpdateOneRequiredWithoutRoommatesNestedInput
  }

  export type RoommateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    languages?: StringFieldUpdateOperationsInput | string
    moveInDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoommateCreateManyInput = {
    id?: string
    listingId: string
    name: string
    age?: number | null
    occupation?: string | null
    bio?: string | null
    image?: string | null
    languages?: string
    moveInDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoommateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    languages?: StringFieldUpdateOperationsInput | string
    moveInDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoommateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    languages?: StringFieldUpdateOperationsInput | string
    moveInDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AvailabilityCreateInput = {
    id?: string
    date: Date | string
    available?: boolean
    priceOverride?: number | null
    minStay?: number | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    listing: ListingCreateNestedOneWithoutAvailabilityInput
  }

  export type AvailabilityUncheckedCreateInput = {
    id?: string
    listingId: string
    date: Date | string
    available?: boolean
    priceOverride?: number | null
    minStay?: number | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AvailabilityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    available?: BoolFieldUpdateOperationsInput | boolean
    priceOverride?: NullableIntFieldUpdateOperationsInput | number | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    listing?: ListingUpdateOneRequiredWithoutAvailabilityNestedInput
  }

  export type AvailabilityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    available?: BoolFieldUpdateOperationsInput | boolean
    priceOverride?: NullableIntFieldUpdateOperationsInput | number | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AvailabilityCreateManyInput = {
    id?: string
    listingId: string
    date: Date | string
    available?: boolean
    priceOverride?: number | null
    minStay?: number | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AvailabilityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    available?: BoolFieldUpdateOperationsInput | boolean
    priceOverride?: NullableIntFieldUpdateOperationsInput | number | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AvailabilityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    listingId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    available?: BoolFieldUpdateOperationsInput | boolean
    priceOverride?: NullableIntFieldUpdateOperationsInput | number | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type PhotoListRelationFilter = {
    every?: PhotoWhereInput
    some?: PhotoWhereInput
    none?: PhotoWhereInput
  }

  export type RoommateListRelationFilter = {
    every?: RoommateWhereInput
    some?: RoommateWhereInput
    none?: RoommateWhereInput
  }

  export type AvailabilityListRelationFilter = {
    every?: AvailabilityWhereInput
    some?: AvailabilityWhereInput
    none?: AvailabilityWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PhotoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoommateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AvailabilityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ListingCountOrderByAggregateInput = {
    id?: SortOrder
    hostId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    neighborhood?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    price?: SortOrder
    currency?: SortOrder
    depositAmount?: SortOrder
    utilitiesIncluded?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    squareFeet?: SortOrder
    furnished?: SortOrder
    freedomScore?: SortOrder
    smokingAllowed?: SortOrder
    petsAllowed?: SortOrder
    partyFriendly?: SortOrder
    dietaryPreference?: SortOrder
    virtualTourUrl?: SortOrder
    availableFrom?: SortOrder
    availableUntil?: SortOrder
    minStay?: SortOrder
    maxStay?: SortOrder
    instantBook?: SortOrder
    amenities?: SortOrder
    houseRules?: SortOrder
    viewCount?: SortOrder
    favoriteCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ListingAvgOrderByAggregateInput = {
    lat?: SortOrder
    lng?: SortOrder
    price?: SortOrder
    depositAmount?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    squareFeet?: SortOrder
    freedomScore?: SortOrder
    minStay?: SortOrder
    maxStay?: SortOrder
    viewCount?: SortOrder
    favoriteCount?: SortOrder
  }

  export type ListingMaxOrderByAggregateInput = {
    id?: SortOrder
    hostId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    neighborhood?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    price?: SortOrder
    currency?: SortOrder
    depositAmount?: SortOrder
    utilitiesIncluded?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    squareFeet?: SortOrder
    furnished?: SortOrder
    freedomScore?: SortOrder
    smokingAllowed?: SortOrder
    petsAllowed?: SortOrder
    partyFriendly?: SortOrder
    dietaryPreference?: SortOrder
    virtualTourUrl?: SortOrder
    availableFrom?: SortOrder
    availableUntil?: SortOrder
    minStay?: SortOrder
    maxStay?: SortOrder
    instantBook?: SortOrder
    amenities?: SortOrder
    houseRules?: SortOrder
    viewCount?: SortOrder
    favoriteCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ListingMinOrderByAggregateInput = {
    id?: SortOrder
    hostId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    neighborhood?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    price?: SortOrder
    currency?: SortOrder
    depositAmount?: SortOrder
    utilitiesIncluded?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    squareFeet?: SortOrder
    furnished?: SortOrder
    freedomScore?: SortOrder
    smokingAllowed?: SortOrder
    petsAllowed?: SortOrder
    partyFriendly?: SortOrder
    dietaryPreference?: SortOrder
    virtualTourUrl?: SortOrder
    availableFrom?: SortOrder
    availableUntil?: SortOrder
    minStay?: SortOrder
    maxStay?: SortOrder
    instantBook?: SortOrder
    amenities?: SortOrder
    houseRules?: SortOrder
    viewCount?: SortOrder
    favoriteCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ListingSumOrderByAggregateInput = {
    lat?: SortOrder
    lng?: SortOrder
    price?: SortOrder
    depositAmount?: SortOrder
    bedrooms?: SortOrder
    bathrooms?: SortOrder
    squareFeet?: SortOrder
    freedomScore?: SortOrder
    minStay?: SortOrder
    maxStay?: SortOrder
    viewCount?: SortOrder
    favoriteCount?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ListingRelationFilter = {
    is?: ListingWhereInput
    isNot?: ListingWhereInput
  }

  export type PhotoCountOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    url?: SortOrder
    caption?: SortOrder
    isPrimary?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type PhotoMaxOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    url?: SortOrder
    caption?: SortOrder
    isPrimary?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoMinOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    url?: SortOrder
    caption?: SortOrder
    isPrimary?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type RoommateCountOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    name?: SortOrder
    age?: SortOrder
    occupation?: SortOrder
    bio?: SortOrder
    image?: SortOrder
    languages?: SortOrder
    moveInDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoommateAvgOrderByAggregateInput = {
    age?: SortOrder
  }

  export type RoommateMaxOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    name?: SortOrder
    age?: SortOrder
    occupation?: SortOrder
    bio?: SortOrder
    image?: SortOrder
    languages?: SortOrder
    moveInDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoommateMinOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    name?: SortOrder
    age?: SortOrder
    occupation?: SortOrder
    bio?: SortOrder
    image?: SortOrder
    languages?: SortOrder
    moveInDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoommateSumOrderByAggregateInput = {
    age?: SortOrder
  }

  export type AvailabilityListingIdDateCompoundUniqueInput = {
    listingId: string
    date: Date | string
  }

  export type AvailabilityCountOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    date?: SortOrder
    available?: SortOrder
    priceOverride?: SortOrder
    minStay?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AvailabilityAvgOrderByAggregateInput = {
    priceOverride?: SortOrder
    minStay?: SortOrder
  }

  export type AvailabilityMaxOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    date?: SortOrder
    available?: SortOrder
    priceOverride?: SortOrder
    minStay?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AvailabilityMinOrderByAggregateInput = {
    id?: SortOrder
    listingId?: SortOrder
    date?: SortOrder
    available?: SortOrder
    priceOverride?: SortOrder
    minStay?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AvailabilitySumOrderByAggregateInput = {
    priceOverride?: SortOrder
    minStay?: SortOrder
  }

  export type PhotoCreateNestedManyWithoutListingInput = {
    create?: XOR<PhotoCreateWithoutListingInput, PhotoUncheckedCreateWithoutListingInput> | PhotoCreateWithoutListingInput[] | PhotoUncheckedCreateWithoutListingInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutListingInput | PhotoCreateOrConnectWithoutListingInput[]
    createMany?: PhotoCreateManyListingInputEnvelope
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
  }

  export type RoommateCreateNestedManyWithoutListingInput = {
    create?: XOR<RoommateCreateWithoutListingInput, RoommateUncheckedCreateWithoutListingInput> | RoommateCreateWithoutListingInput[] | RoommateUncheckedCreateWithoutListingInput[]
    connectOrCreate?: RoommateCreateOrConnectWithoutListingInput | RoommateCreateOrConnectWithoutListingInput[]
    createMany?: RoommateCreateManyListingInputEnvelope
    connect?: RoommateWhereUniqueInput | RoommateWhereUniqueInput[]
  }

  export type AvailabilityCreateNestedManyWithoutListingInput = {
    create?: XOR<AvailabilityCreateWithoutListingInput, AvailabilityUncheckedCreateWithoutListingInput> | AvailabilityCreateWithoutListingInput[] | AvailabilityUncheckedCreateWithoutListingInput[]
    connectOrCreate?: AvailabilityCreateOrConnectWithoutListingInput | AvailabilityCreateOrConnectWithoutListingInput[]
    createMany?: AvailabilityCreateManyListingInputEnvelope
    connect?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
  }

  export type PhotoUncheckedCreateNestedManyWithoutListingInput = {
    create?: XOR<PhotoCreateWithoutListingInput, PhotoUncheckedCreateWithoutListingInput> | PhotoCreateWithoutListingInput[] | PhotoUncheckedCreateWithoutListingInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutListingInput | PhotoCreateOrConnectWithoutListingInput[]
    createMany?: PhotoCreateManyListingInputEnvelope
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
  }

  export type RoommateUncheckedCreateNestedManyWithoutListingInput = {
    create?: XOR<RoommateCreateWithoutListingInput, RoommateUncheckedCreateWithoutListingInput> | RoommateCreateWithoutListingInput[] | RoommateUncheckedCreateWithoutListingInput[]
    connectOrCreate?: RoommateCreateOrConnectWithoutListingInput | RoommateCreateOrConnectWithoutListingInput[]
    createMany?: RoommateCreateManyListingInputEnvelope
    connect?: RoommateWhereUniqueInput | RoommateWhereUniqueInput[]
  }

  export type AvailabilityUncheckedCreateNestedManyWithoutListingInput = {
    create?: XOR<AvailabilityCreateWithoutListingInput, AvailabilityUncheckedCreateWithoutListingInput> | AvailabilityCreateWithoutListingInput[] | AvailabilityUncheckedCreateWithoutListingInput[]
    connectOrCreate?: AvailabilityCreateOrConnectWithoutListingInput | AvailabilityCreateOrConnectWithoutListingInput[]
    createMany?: AvailabilityCreateManyListingInputEnvelope
    connect?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type PhotoUpdateManyWithoutListingNestedInput = {
    create?: XOR<PhotoCreateWithoutListingInput, PhotoUncheckedCreateWithoutListingInput> | PhotoCreateWithoutListingInput[] | PhotoUncheckedCreateWithoutListingInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutListingInput | PhotoCreateOrConnectWithoutListingInput[]
    upsert?: PhotoUpsertWithWhereUniqueWithoutListingInput | PhotoUpsertWithWhereUniqueWithoutListingInput[]
    createMany?: PhotoCreateManyListingInputEnvelope
    set?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    disconnect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    delete?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    update?: PhotoUpdateWithWhereUniqueWithoutListingInput | PhotoUpdateWithWhereUniqueWithoutListingInput[]
    updateMany?: PhotoUpdateManyWithWhereWithoutListingInput | PhotoUpdateManyWithWhereWithoutListingInput[]
    deleteMany?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
  }

  export type RoommateUpdateManyWithoutListingNestedInput = {
    create?: XOR<RoommateCreateWithoutListingInput, RoommateUncheckedCreateWithoutListingInput> | RoommateCreateWithoutListingInput[] | RoommateUncheckedCreateWithoutListingInput[]
    connectOrCreate?: RoommateCreateOrConnectWithoutListingInput | RoommateCreateOrConnectWithoutListingInput[]
    upsert?: RoommateUpsertWithWhereUniqueWithoutListingInput | RoommateUpsertWithWhereUniqueWithoutListingInput[]
    createMany?: RoommateCreateManyListingInputEnvelope
    set?: RoommateWhereUniqueInput | RoommateWhereUniqueInput[]
    disconnect?: RoommateWhereUniqueInput | RoommateWhereUniqueInput[]
    delete?: RoommateWhereUniqueInput | RoommateWhereUniqueInput[]
    connect?: RoommateWhereUniqueInput | RoommateWhereUniqueInput[]
    update?: RoommateUpdateWithWhereUniqueWithoutListingInput | RoommateUpdateWithWhereUniqueWithoutListingInput[]
    updateMany?: RoommateUpdateManyWithWhereWithoutListingInput | RoommateUpdateManyWithWhereWithoutListingInput[]
    deleteMany?: RoommateScalarWhereInput | RoommateScalarWhereInput[]
  }

  export type AvailabilityUpdateManyWithoutListingNestedInput = {
    create?: XOR<AvailabilityCreateWithoutListingInput, AvailabilityUncheckedCreateWithoutListingInput> | AvailabilityCreateWithoutListingInput[] | AvailabilityUncheckedCreateWithoutListingInput[]
    connectOrCreate?: AvailabilityCreateOrConnectWithoutListingInput | AvailabilityCreateOrConnectWithoutListingInput[]
    upsert?: AvailabilityUpsertWithWhereUniqueWithoutListingInput | AvailabilityUpsertWithWhereUniqueWithoutListingInput[]
    createMany?: AvailabilityCreateManyListingInputEnvelope
    set?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    disconnect?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    delete?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    connect?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    update?: AvailabilityUpdateWithWhereUniqueWithoutListingInput | AvailabilityUpdateWithWhereUniqueWithoutListingInput[]
    updateMany?: AvailabilityUpdateManyWithWhereWithoutListingInput | AvailabilityUpdateManyWithWhereWithoutListingInput[]
    deleteMany?: AvailabilityScalarWhereInput | AvailabilityScalarWhereInput[]
  }

  export type PhotoUncheckedUpdateManyWithoutListingNestedInput = {
    create?: XOR<PhotoCreateWithoutListingInput, PhotoUncheckedCreateWithoutListingInput> | PhotoCreateWithoutListingInput[] | PhotoUncheckedCreateWithoutListingInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutListingInput | PhotoCreateOrConnectWithoutListingInput[]
    upsert?: PhotoUpsertWithWhereUniqueWithoutListingInput | PhotoUpsertWithWhereUniqueWithoutListingInput[]
    createMany?: PhotoCreateManyListingInputEnvelope
    set?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    disconnect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    delete?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    update?: PhotoUpdateWithWhereUniqueWithoutListingInput | PhotoUpdateWithWhereUniqueWithoutListingInput[]
    updateMany?: PhotoUpdateManyWithWhereWithoutListingInput | PhotoUpdateManyWithWhereWithoutListingInput[]
    deleteMany?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
  }

  export type RoommateUncheckedUpdateManyWithoutListingNestedInput = {
    create?: XOR<RoommateCreateWithoutListingInput, RoommateUncheckedCreateWithoutListingInput> | RoommateCreateWithoutListingInput[] | RoommateUncheckedCreateWithoutListingInput[]
    connectOrCreate?: RoommateCreateOrConnectWithoutListingInput | RoommateCreateOrConnectWithoutListingInput[]
    upsert?: RoommateUpsertWithWhereUniqueWithoutListingInput | RoommateUpsertWithWhereUniqueWithoutListingInput[]
    createMany?: RoommateCreateManyListingInputEnvelope
    set?: RoommateWhereUniqueInput | RoommateWhereUniqueInput[]
    disconnect?: RoommateWhereUniqueInput | RoommateWhereUniqueInput[]
    delete?: RoommateWhereUniqueInput | RoommateWhereUniqueInput[]
    connect?: RoommateWhereUniqueInput | RoommateWhereUniqueInput[]
    update?: RoommateUpdateWithWhereUniqueWithoutListingInput | RoommateUpdateWithWhereUniqueWithoutListingInput[]
    updateMany?: RoommateUpdateManyWithWhereWithoutListingInput | RoommateUpdateManyWithWhereWithoutListingInput[]
    deleteMany?: RoommateScalarWhereInput | RoommateScalarWhereInput[]
  }

  export type AvailabilityUncheckedUpdateManyWithoutListingNestedInput = {
    create?: XOR<AvailabilityCreateWithoutListingInput, AvailabilityUncheckedCreateWithoutListingInput> | AvailabilityCreateWithoutListingInput[] | AvailabilityUncheckedCreateWithoutListingInput[]
    connectOrCreate?: AvailabilityCreateOrConnectWithoutListingInput | AvailabilityCreateOrConnectWithoutListingInput[]
    upsert?: AvailabilityUpsertWithWhereUniqueWithoutListingInput | AvailabilityUpsertWithWhereUniqueWithoutListingInput[]
    createMany?: AvailabilityCreateManyListingInputEnvelope
    set?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    disconnect?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    delete?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    connect?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    update?: AvailabilityUpdateWithWhereUniqueWithoutListingInput | AvailabilityUpdateWithWhereUniqueWithoutListingInput[]
    updateMany?: AvailabilityUpdateManyWithWhereWithoutListingInput | AvailabilityUpdateManyWithWhereWithoutListingInput[]
    deleteMany?: AvailabilityScalarWhereInput | AvailabilityScalarWhereInput[]
  }

  export type ListingCreateNestedOneWithoutPhotosInput = {
    create?: XOR<ListingCreateWithoutPhotosInput, ListingUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: ListingCreateOrConnectWithoutPhotosInput
    connect?: ListingWhereUniqueInput
  }

  export type ListingUpdateOneRequiredWithoutPhotosNestedInput = {
    create?: XOR<ListingCreateWithoutPhotosInput, ListingUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: ListingCreateOrConnectWithoutPhotosInput
    upsert?: ListingUpsertWithoutPhotosInput
    connect?: ListingWhereUniqueInput
    update?: XOR<XOR<ListingUpdateToOneWithWhereWithoutPhotosInput, ListingUpdateWithoutPhotosInput>, ListingUncheckedUpdateWithoutPhotosInput>
  }

  export type ListingCreateNestedOneWithoutRoommatesInput = {
    create?: XOR<ListingCreateWithoutRoommatesInput, ListingUncheckedCreateWithoutRoommatesInput>
    connectOrCreate?: ListingCreateOrConnectWithoutRoommatesInput
    connect?: ListingWhereUniqueInput
  }

  export type ListingUpdateOneRequiredWithoutRoommatesNestedInput = {
    create?: XOR<ListingCreateWithoutRoommatesInput, ListingUncheckedCreateWithoutRoommatesInput>
    connectOrCreate?: ListingCreateOrConnectWithoutRoommatesInput
    upsert?: ListingUpsertWithoutRoommatesInput
    connect?: ListingWhereUniqueInput
    update?: XOR<XOR<ListingUpdateToOneWithWhereWithoutRoommatesInput, ListingUpdateWithoutRoommatesInput>, ListingUncheckedUpdateWithoutRoommatesInput>
  }

  export type ListingCreateNestedOneWithoutAvailabilityInput = {
    create?: XOR<ListingCreateWithoutAvailabilityInput, ListingUncheckedCreateWithoutAvailabilityInput>
    connectOrCreate?: ListingCreateOrConnectWithoutAvailabilityInput
    connect?: ListingWhereUniqueInput
  }

  export type ListingUpdateOneRequiredWithoutAvailabilityNestedInput = {
    create?: XOR<ListingCreateWithoutAvailabilityInput, ListingUncheckedCreateWithoutAvailabilityInput>
    connectOrCreate?: ListingCreateOrConnectWithoutAvailabilityInput
    upsert?: ListingUpsertWithoutAvailabilityInput
    connect?: ListingWhereUniqueInput
    update?: XOR<XOR<ListingUpdateToOneWithWhereWithoutAvailabilityInput, ListingUpdateWithoutAvailabilityInput>, ListingUncheckedUpdateWithoutAvailabilityInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PhotoCreateWithoutListingInput = {
    id?: string
    url: string
    caption?: string | null
    isPrimary?: boolean
    order?: number
    createdAt?: Date | string
  }

  export type PhotoUncheckedCreateWithoutListingInput = {
    id?: string
    url: string
    caption?: string | null
    isPrimary?: boolean
    order?: number
    createdAt?: Date | string
  }

  export type PhotoCreateOrConnectWithoutListingInput = {
    where: PhotoWhereUniqueInput
    create: XOR<PhotoCreateWithoutListingInput, PhotoUncheckedCreateWithoutListingInput>
  }

  export type PhotoCreateManyListingInputEnvelope = {
    data: PhotoCreateManyListingInput | PhotoCreateManyListingInput[]
  }

  export type RoommateCreateWithoutListingInput = {
    id?: string
    name: string
    age?: number | null
    occupation?: string | null
    bio?: string | null
    image?: string | null
    languages?: string
    moveInDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoommateUncheckedCreateWithoutListingInput = {
    id?: string
    name: string
    age?: number | null
    occupation?: string | null
    bio?: string | null
    image?: string | null
    languages?: string
    moveInDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoommateCreateOrConnectWithoutListingInput = {
    where: RoommateWhereUniqueInput
    create: XOR<RoommateCreateWithoutListingInput, RoommateUncheckedCreateWithoutListingInput>
  }

  export type RoommateCreateManyListingInputEnvelope = {
    data: RoommateCreateManyListingInput | RoommateCreateManyListingInput[]
  }

  export type AvailabilityCreateWithoutListingInput = {
    id?: string
    date: Date | string
    available?: boolean
    priceOverride?: number | null
    minStay?: number | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AvailabilityUncheckedCreateWithoutListingInput = {
    id?: string
    date: Date | string
    available?: boolean
    priceOverride?: number | null
    minStay?: number | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AvailabilityCreateOrConnectWithoutListingInput = {
    where: AvailabilityWhereUniqueInput
    create: XOR<AvailabilityCreateWithoutListingInput, AvailabilityUncheckedCreateWithoutListingInput>
  }

  export type AvailabilityCreateManyListingInputEnvelope = {
    data: AvailabilityCreateManyListingInput | AvailabilityCreateManyListingInput[]
  }

  export type PhotoUpsertWithWhereUniqueWithoutListingInput = {
    where: PhotoWhereUniqueInput
    update: XOR<PhotoUpdateWithoutListingInput, PhotoUncheckedUpdateWithoutListingInput>
    create: XOR<PhotoCreateWithoutListingInput, PhotoUncheckedCreateWithoutListingInput>
  }

  export type PhotoUpdateWithWhereUniqueWithoutListingInput = {
    where: PhotoWhereUniqueInput
    data: XOR<PhotoUpdateWithoutListingInput, PhotoUncheckedUpdateWithoutListingInput>
  }

  export type PhotoUpdateManyWithWhereWithoutListingInput = {
    where: PhotoScalarWhereInput
    data: XOR<PhotoUpdateManyMutationInput, PhotoUncheckedUpdateManyWithoutListingInput>
  }

  export type PhotoScalarWhereInput = {
    AND?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
    OR?: PhotoScalarWhereInput[]
    NOT?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
    id?: StringFilter<"Photo"> | string
    listingId?: StringFilter<"Photo"> | string
    url?: StringFilter<"Photo"> | string
    caption?: StringNullableFilter<"Photo"> | string | null
    isPrimary?: BoolFilter<"Photo"> | boolean
    order?: IntFilter<"Photo"> | number
    createdAt?: DateTimeFilter<"Photo"> | Date | string
  }

  export type RoommateUpsertWithWhereUniqueWithoutListingInput = {
    where: RoommateWhereUniqueInput
    update: XOR<RoommateUpdateWithoutListingInput, RoommateUncheckedUpdateWithoutListingInput>
    create: XOR<RoommateCreateWithoutListingInput, RoommateUncheckedCreateWithoutListingInput>
  }

  export type RoommateUpdateWithWhereUniqueWithoutListingInput = {
    where: RoommateWhereUniqueInput
    data: XOR<RoommateUpdateWithoutListingInput, RoommateUncheckedUpdateWithoutListingInput>
  }

  export type RoommateUpdateManyWithWhereWithoutListingInput = {
    where: RoommateScalarWhereInput
    data: XOR<RoommateUpdateManyMutationInput, RoommateUncheckedUpdateManyWithoutListingInput>
  }

  export type RoommateScalarWhereInput = {
    AND?: RoommateScalarWhereInput | RoommateScalarWhereInput[]
    OR?: RoommateScalarWhereInput[]
    NOT?: RoommateScalarWhereInput | RoommateScalarWhereInput[]
    id?: StringFilter<"Roommate"> | string
    listingId?: StringFilter<"Roommate"> | string
    name?: StringFilter<"Roommate"> | string
    age?: IntNullableFilter<"Roommate"> | number | null
    occupation?: StringNullableFilter<"Roommate"> | string | null
    bio?: StringNullableFilter<"Roommate"> | string | null
    image?: StringNullableFilter<"Roommate"> | string | null
    languages?: StringFilter<"Roommate"> | string
    moveInDate?: DateTimeNullableFilter<"Roommate"> | Date | string | null
    createdAt?: DateTimeFilter<"Roommate"> | Date | string
    updatedAt?: DateTimeFilter<"Roommate"> | Date | string
  }

  export type AvailabilityUpsertWithWhereUniqueWithoutListingInput = {
    where: AvailabilityWhereUniqueInput
    update: XOR<AvailabilityUpdateWithoutListingInput, AvailabilityUncheckedUpdateWithoutListingInput>
    create: XOR<AvailabilityCreateWithoutListingInput, AvailabilityUncheckedCreateWithoutListingInput>
  }

  export type AvailabilityUpdateWithWhereUniqueWithoutListingInput = {
    where: AvailabilityWhereUniqueInput
    data: XOR<AvailabilityUpdateWithoutListingInput, AvailabilityUncheckedUpdateWithoutListingInput>
  }

  export type AvailabilityUpdateManyWithWhereWithoutListingInput = {
    where: AvailabilityScalarWhereInput
    data: XOR<AvailabilityUpdateManyMutationInput, AvailabilityUncheckedUpdateManyWithoutListingInput>
  }

  export type AvailabilityScalarWhereInput = {
    AND?: AvailabilityScalarWhereInput | AvailabilityScalarWhereInput[]
    OR?: AvailabilityScalarWhereInput[]
    NOT?: AvailabilityScalarWhereInput | AvailabilityScalarWhereInput[]
    id?: StringFilter<"Availability"> | string
    listingId?: StringFilter<"Availability"> | string
    date?: DateTimeFilter<"Availability"> | Date | string
    available?: BoolFilter<"Availability"> | boolean
    priceOverride?: IntNullableFilter<"Availability"> | number | null
    minStay?: IntNullableFilter<"Availability"> | number | null
    note?: StringNullableFilter<"Availability"> | string | null
    createdAt?: DateTimeFilter<"Availability"> | Date | string
    updatedAt?: DateTimeFilter<"Availability"> | Date | string
  }

  export type ListingCreateWithoutPhotosInput = {
    id?: string
    hostId: string
    title: string
    description: string
    type: string
    status?: string
    address?: string | null
    city: string
    state: string
    zipCode?: string | null
    neighborhood?: string | null
    lat?: number | null
    lng?: number | null
    price: number
    currency?: string
    depositAmount?: number | null
    utilitiesIncluded?: boolean
    bedrooms: number
    bathrooms: number
    squareFeet?: number | null
    furnished?: boolean
    freedomScore?: number
    smokingAllowed?: boolean
    petsAllowed?: boolean
    partyFriendly?: boolean
    dietaryPreference?: string | null
    virtualTourUrl?: string | null
    availableFrom: Date | string
    availableUntil?: Date | string | null
    minStay?: number | null
    maxStay?: number | null
    instantBook?: boolean
    amenities?: string
    houseRules?: string
    viewCount?: number
    favoriteCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    roommates?: RoommateCreateNestedManyWithoutListingInput
    availability?: AvailabilityCreateNestedManyWithoutListingInput
  }

  export type ListingUncheckedCreateWithoutPhotosInput = {
    id?: string
    hostId: string
    title: string
    description: string
    type: string
    status?: string
    address?: string | null
    city: string
    state: string
    zipCode?: string | null
    neighborhood?: string | null
    lat?: number | null
    lng?: number | null
    price: number
    currency?: string
    depositAmount?: number | null
    utilitiesIncluded?: boolean
    bedrooms: number
    bathrooms: number
    squareFeet?: number | null
    furnished?: boolean
    freedomScore?: number
    smokingAllowed?: boolean
    petsAllowed?: boolean
    partyFriendly?: boolean
    dietaryPreference?: string | null
    virtualTourUrl?: string | null
    availableFrom: Date | string
    availableUntil?: Date | string | null
    minStay?: number | null
    maxStay?: number | null
    instantBook?: boolean
    amenities?: string
    houseRules?: string
    viewCount?: number
    favoriteCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    roommates?: RoommateUncheckedCreateNestedManyWithoutListingInput
    availability?: AvailabilityUncheckedCreateNestedManyWithoutListingInput
  }

  export type ListingCreateOrConnectWithoutPhotosInput = {
    where: ListingWhereUniqueInput
    create: XOR<ListingCreateWithoutPhotosInput, ListingUncheckedCreateWithoutPhotosInput>
  }

  export type ListingUpsertWithoutPhotosInput = {
    update: XOR<ListingUpdateWithoutPhotosInput, ListingUncheckedUpdateWithoutPhotosInput>
    create: XOR<ListingCreateWithoutPhotosInput, ListingUncheckedCreateWithoutPhotosInput>
    where?: ListingWhereInput
  }

  export type ListingUpdateToOneWithWhereWithoutPhotosInput = {
    where?: ListingWhereInput
    data: XOR<ListingUpdateWithoutPhotosInput, ListingUncheckedUpdateWithoutPhotosInput>
  }

  export type ListingUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    neighborhood?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    depositAmount?: NullableIntFieldUpdateOperationsInput | number | null
    utilitiesIncluded?: BoolFieldUpdateOperationsInput | boolean
    bedrooms?: IntFieldUpdateOperationsInput | number
    bathrooms?: FloatFieldUpdateOperationsInput | number
    squareFeet?: NullableIntFieldUpdateOperationsInput | number | null
    furnished?: BoolFieldUpdateOperationsInput | boolean
    freedomScore?: IntFieldUpdateOperationsInput | number
    smokingAllowed?: BoolFieldUpdateOperationsInput | boolean
    petsAllowed?: BoolFieldUpdateOperationsInput | boolean
    partyFriendly?: BoolFieldUpdateOperationsInput | boolean
    dietaryPreference?: NullableStringFieldUpdateOperationsInput | string | null
    virtualTourUrl?: NullableStringFieldUpdateOperationsInput | string | null
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    availableUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    maxStay?: NullableIntFieldUpdateOperationsInput | number | null
    instantBook?: BoolFieldUpdateOperationsInput | boolean
    amenities?: StringFieldUpdateOperationsInput | string
    houseRules?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    favoriteCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roommates?: RoommateUpdateManyWithoutListingNestedInput
    availability?: AvailabilityUpdateManyWithoutListingNestedInput
  }

  export type ListingUncheckedUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    neighborhood?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    depositAmount?: NullableIntFieldUpdateOperationsInput | number | null
    utilitiesIncluded?: BoolFieldUpdateOperationsInput | boolean
    bedrooms?: IntFieldUpdateOperationsInput | number
    bathrooms?: FloatFieldUpdateOperationsInput | number
    squareFeet?: NullableIntFieldUpdateOperationsInput | number | null
    furnished?: BoolFieldUpdateOperationsInput | boolean
    freedomScore?: IntFieldUpdateOperationsInput | number
    smokingAllowed?: BoolFieldUpdateOperationsInput | boolean
    petsAllowed?: BoolFieldUpdateOperationsInput | boolean
    partyFriendly?: BoolFieldUpdateOperationsInput | boolean
    dietaryPreference?: NullableStringFieldUpdateOperationsInput | string | null
    virtualTourUrl?: NullableStringFieldUpdateOperationsInput | string | null
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    availableUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    maxStay?: NullableIntFieldUpdateOperationsInput | number | null
    instantBook?: BoolFieldUpdateOperationsInput | boolean
    amenities?: StringFieldUpdateOperationsInput | string
    houseRules?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    favoriteCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roommates?: RoommateUncheckedUpdateManyWithoutListingNestedInput
    availability?: AvailabilityUncheckedUpdateManyWithoutListingNestedInput
  }

  export type ListingCreateWithoutRoommatesInput = {
    id?: string
    hostId: string
    title: string
    description: string
    type: string
    status?: string
    address?: string | null
    city: string
    state: string
    zipCode?: string | null
    neighborhood?: string | null
    lat?: number | null
    lng?: number | null
    price: number
    currency?: string
    depositAmount?: number | null
    utilitiesIncluded?: boolean
    bedrooms: number
    bathrooms: number
    squareFeet?: number | null
    furnished?: boolean
    freedomScore?: number
    smokingAllowed?: boolean
    petsAllowed?: boolean
    partyFriendly?: boolean
    dietaryPreference?: string | null
    virtualTourUrl?: string | null
    availableFrom: Date | string
    availableUntil?: Date | string | null
    minStay?: number | null
    maxStay?: number | null
    instantBook?: boolean
    amenities?: string
    houseRules?: string
    viewCount?: number
    favoriteCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutListingInput
    availability?: AvailabilityCreateNestedManyWithoutListingInput
  }

  export type ListingUncheckedCreateWithoutRoommatesInput = {
    id?: string
    hostId: string
    title: string
    description: string
    type: string
    status?: string
    address?: string | null
    city: string
    state: string
    zipCode?: string | null
    neighborhood?: string | null
    lat?: number | null
    lng?: number | null
    price: number
    currency?: string
    depositAmount?: number | null
    utilitiesIncluded?: boolean
    bedrooms: number
    bathrooms: number
    squareFeet?: number | null
    furnished?: boolean
    freedomScore?: number
    smokingAllowed?: boolean
    petsAllowed?: boolean
    partyFriendly?: boolean
    dietaryPreference?: string | null
    virtualTourUrl?: string | null
    availableFrom: Date | string
    availableUntil?: Date | string | null
    minStay?: number | null
    maxStay?: number | null
    instantBook?: boolean
    amenities?: string
    houseRules?: string
    viewCount?: number
    favoriteCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutListingInput
    availability?: AvailabilityUncheckedCreateNestedManyWithoutListingInput
  }

  export type ListingCreateOrConnectWithoutRoommatesInput = {
    where: ListingWhereUniqueInput
    create: XOR<ListingCreateWithoutRoommatesInput, ListingUncheckedCreateWithoutRoommatesInput>
  }

  export type ListingUpsertWithoutRoommatesInput = {
    update: XOR<ListingUpdateWithoutRoommatesInput, ListingUncheckedUpdateWithoutRoommatesInput>
    create: XOR<ListingCreateWithoutRoommatesInput, ListingUncheckedCreateWithoutRoommatesInput>
    where?: ListingWhereInput
  }

  export type ListingUpdateToOneWithWhereWithoutRoommatesInput = {
    where?: ListingWhereInput
    data: XOR<ListingUpdateWithoutRoommatesInput, ListingUncheckedUpdateWithoutRoommatesInput>
  }

  export type ListingUpdateWithoutRoommatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    neighborhood?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    depositAmount?: NullableIntFieldUpdateOperationsInput | number | null
    utilitiesIncluded?: BoolFieldUpdateOperationsInput | boolean
    bedrooms?: IntFieldUpdateOperationsInput | number
    bathrooms?: FloatFieldUpdateOperationsInput | number
    squareFeet?: NullableIntFieldUpdateOperationsInput | number | null
    furnished?: BoolFieldUpdateOperationsInput | boolean
    freedomScore?: IntFieldUpdateOperationsInput | number
    smokingAllowed?: BoolFieldUpdateOperationsInput | boolean
    petsAllowed?: BoolFieldUpdateOperationsInput | boolean
    partyFriendly?: BoolFieldUpdateOperationsInput | boolean
    dietaryPreference?: NullableStringFieldUpdateOperationsInput | string | null
    virtualTourUrl?: NullableStringFieldUpdateOperationsInput | string | null
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    availableUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    maxStay?: NullableIntFieldUpdateOperationsInput | number | null
    instantBook?: BoolFieldUpdateOperationsInput | boolean
    amenities?: StringFieldUpdateOperationsInput | string
    houseRules?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    favoriteCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutListingNestedInput
    availability?: AvailabilityUpdateManyWithoutListingNestedInput
  }

  export type ListingUncheckedUpdateWithoutRoommatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    neighborhood?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    depositAmount?: NullableIntFieldUpdateOperationsInput | number | null
    utilitiesIncluded?: BoolFieldUpdateOperationsInput | boolean
    bedrooms?: IntFieldUpdateOperationsInput | number
    bathrooms?: FloatFieldUpdateOperationsInput | number
    squareFeet?: NullableIntFieldUpdateOperationsInput | number | null
    furnished?: BoolFieldUpdateOperationsInput | boolean
    freedomScore?: IntFieldUpdateOperationsInput | number
    smokingAllowed?: BoolFieldUpdateOperationsInput | boolean
    petsAllowed?: BoolFieldUpdateOperationsInput | boolean
    partyFriendly?: BoolFieldUpdateOperationsInput | boolean
    dietaryPreference?: NullableStringFieldUpdateOperationsInput | string | null
    virtualTourUrl?: NullableStringFieldUpdateOperationsInput | string | null
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    availableUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    maxStay?: NullableIntFieldUpdateOperationsInput | number | null
    instantBook?: BoolFieldUpdateOperationsInput | boolean
    amenities?: StringFieldUpdateOperationsInput | string
    houseRules?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    favoriteCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutListingNestedInput
    availability?: AvailabilityUncheckedUpdateManyWithoutListingNestedInput
  }

  export type ListingCreateWithoutAvailabilityInput = {
    id?: string
    hostId: string
    title: string
    description: string
    type: string
    status?: string
    address?: string | null
    city: string
    state: string
    zipCode?: string | null
    neighborhood?: string | null
    lat?: number | null
    lng?: number | null
    price: number
    currency?: string
    depositAmount?: number | null
    utilitiesIncluded?: boolean
    bedrooms: number
    bathrooms: number
    squareFeet?: number | null
    furnished?: boolean
    freedomScore?: number
    smokingAllowed?: boolean
    petsAllowed?: boolean
    partyFriendly?: boolean
    dietaryPreference?: string | null
    virtualTourUrl?: string | null
    availableFrom: Date | string
    availableUntil?: Date | string | null
    minStay?: number | null
    maxStay?: number | null
    instantBook?: boolean
    amenities?: string
    houseRules?: string
    viewCount?: number
    favoriteCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutListingInput
    roommates?: RoommateCreateNestedManyWithoutListingInput
  }

  export type ListingUncheckedCreateWithoutAvailabilityInput = {
    id?: string
    hostId: string
    title: string
    description: string
    type: string
    status?: string
    address?: string | null
    city: string
    state: string
    zipCode?: string | null
    neighborhood?: string | null
    lat?: number | null
    lng?: number | null
    price: number
    currency?: string
    depositAmount?: number | null
    utilitiesIncluded?: boolean
    bedrooms: number
    bathrooms: number
    squareFeet?: number | null
    furnished?: boolean
    freedomScore?: number
    smokingAllowed?: boolean
    petsAllowed?: boolean
    partyFriendly?: boolean
    dietaryPreference?: string | null
    virtualTourUrl?: string | null
    availableFrom: Date | string
    availableUntil?: Date | string | null
    minStay?: number | null
    maxStay?: number | null
    instantBook?: boolean
    amenities?: string
    houseRules?: string
    viewCount?: number
    favoriteCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutListingInput
    roommates?: RoommateUncheckedCreateNestedManyWithoutListingInput
  }

  export type ListingCreateOrConnectWithoutAvailabilityInput = {
    where: ListingWhereUniqueInput
    create: XOR<ListingCreateWithoutAvailabilityInput, ListingUncheckedCreateWithoutAvailabilityInput>
  }

  export type ListingUpsertWithoutAvailabilityInput = {
    update: XOR<ListingUpdateWithoutAvailabilityInput, ListingUncheckedUpdateWithoutAvailabilityInput>
    create: XOR<ListingCreateWithoutAvailabilityInput, ListingUncheckedCreateWithoutAvailabilityInput>
    where?: ListingWhereInput
  }

  export type ListingUpdateToOneWithWhereWithoutAvailabilityInput = {
    where?: ListingWhereInput
    data: XOR<ListingUpdateWithoutAvailabilityInput, ListingUncheckedUpdateWithoutAvailabilityInput>
  }

  export type ListingUpdateWithoutAvailabilityInput = {
    id?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    neighborhood?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    depositAmount?: NullableIntFieldUpdateOperationsInput | number | null
    utilitiesIncluded?: BoolFieldUpdateOperationsInput | boolean
    bedrooms?: IntFieldUpdateOperationsInput | number
    bathrooms?: FloatFieldUpdateOperationsInput | number
    squareFeet?: NullableIntFieldUpdateOperationsInput | number | null
    furnished?: BoolFieldUpdateOperationsInput | boolean
    freedomScore?: IntFieldUpdateOperationsInput | number
    smokingAllowed?: BoolFieldUpdateOperationsInput | boolean
    petsAllowed?: BoolFieldUpdateOperationsInput | boolean
    partyFriendly?: BoolFieldUpdateOperationsInput | boolean
    dietaryPreference?: NullableStringFieldUpdateOperationsInput | string | null
    virtualTourUrl?: NullableStringFieldUpdateOperationsInput | string | null
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    availableUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    maxStay?: NullableIntFieldUpdateOperationsInput | number | null
    instantBook?: BoolFieldUpdateOperationsInput | boolean
    amenities?: StringFieldUpdateOperationsInput | string
    houseRules?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    favoriteCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutListingNestedInput
    roommates?: RoommateUpdateManyWithoutListingNestedInput
  }

  export type ListingUncheckedUpdateWithoutAvailabilityInput = {
    id?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    neighborhood?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableFloatFieldUpdateOperationsInput | number | null
    lng?: NullableFloatFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    depositAmount?: NullableIntFieldUpdateOperationsInput | number | null
    utilitiesIncluded?: BoolFieldUpdateOperationsInput | boolean
    bedrooms?: IntFieldUpdateOperationsInput | number
    bathrooms?: FloatFieldUpdateOperationsInput | number
    squareFeet?: NullableIntFieldUpdateOperationsInput | number | null
    furnished?: BoolFieldUpdateOperationsInput | boolean
    freedomScore?: IntFieldUpdateOperationsInput | number
    smokingAllowed?: BoolFieldUpdateOperationsInput | boolean
    petsAllowed?: BoolFieldUpdateOperationsInput | boolean
    partyFriendly?: BoolFieldUpdateOperationsInput | boolean
    dietaryPreference?: NullableStringFieldUpdateOperationsInput | string | null
    virtualTourUrl?: NullableStringFieldUpdateOperationsInput | string | null
    availableFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    availableUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    maxStay?: NullableIntFieldUpdateOperationsInput | number | null
    instantBook?: BoolFieldUpdateOperationsInput | boolean
    amenities?: StringFieldUpdateOperationsInput | string
    houseRules?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    favoriteCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutListingNestedInput
    roommates?: RoommateUncheckedUpdateManyWithoutListingNestedInput
  }

  export type PhotoCreateManyListingInput = {
    id?: string
    url: string
    caption?: string | null
    isPrimary?: boolean
    order?: number
    createdAt?: Date | string
  }

  export type RoommateCreateManyListingInput = {
    id?: string
    name: string
    age?: number | null
    occupation?: string | null
    bio?: string | null
    image?: string | null
    languages?: string
    moveInDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AvailabilityCreateManyListingInput = {
    id?: string
    date: Date | string
    available?: boolean
    priceOverride?: number | null
    minStay?: number | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PhotoUpdateWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoUncheckedUpdateWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoUncheckedUpdateManyWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoommateUpdateWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    languages?: StringFieldUpdateOperationsInput | string
    moveInDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoommateUncheckedUpdateWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    languages?: StringFieldUpdateOperationsInput | string
    moveInDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoommateUncheckedUpdateManyWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    age?: NullableIntFieldUpdateOperationsInput | number | null
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    languages?: StringFieldUpdateOperationsInput | string
    moveInDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AvailabilityUpdateWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    available?: BoolFieldUpdateOperationsInput | boolean
    priceOverride?: NullableIntFieldUpdateOperationsInput | number | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AvailabilityUncheckedUpdateWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    available?: BoolFieldUpdateOperationsInput | boolean
    priceOverride?: NullableIntFieldUpdateOperationsInput | number | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AvailabilityUncheckedUpdateManyWithoutListingInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    available?: BoolFieldUpdateOperationsInput | boolean
    priceOverride?: NullableIntFieldUpdateOperationsInput | number | null
    minStay?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ListingCountOutputTypeDefaultArgs instead
     */
    export type ListingCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ListingCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ListingDefaultArgs instead
     */
    export type ListingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ListingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PhotoDefaultArgs instead
     */
    export type PhotoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PhotoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RoommateDefaultArgs instead
     */
    export type RoommateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RoommateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AvailabilityDefaultArgs instead
     */
    export type AvailabilityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AvailabilityDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}