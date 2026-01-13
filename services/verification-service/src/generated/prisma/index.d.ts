
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
 * Model IdentityVerification
 * 
 */
export type IdentityVerification = $Result.DefaultSelection<Prisma.$IdentityVerificationPayload>
/**
 * Model BackgroundCheck
 * 
 */
export type BackgroundCheck = $Result.DefaultSelection<Prisma.$BackgroundCheckPayload>
/**
 * Model VisaVerification
 * 
 */
export type VisaVerification = $Result.DefaultSelection<Prisma.$VisaVerificationPayload>
/**
 * Model LicenseVerification
 * 
 */
export type LicenseVerification = $Result.DefaultSelection<Prisma.$LicenseVerificationPayload>
/**
 * Model VerificationAuditLog
 * 
 */
export type VerificationAuditLog = $Result.DefaultSelection<Prisma.$VerificationAuditLogPayload>
/**
 * Model Verification
 * 
 */
export type Verification = $Result.DefaultSelection<Prisma.$VerificationPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more IdentityVerifications
 * const identityVerifications = await prisma.identityVerification.findMany()
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
   * // Fetch zero or more IdentityVerifications
   * const identityVerifications = await prisma.identityVerification.findMany()
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
   * `prisma.identityVerification`: Exposes CRUD operations for the **IdentityVerification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IdentityVerifications
    * const identityVerifications = await prisma.identityVerification.findMany()
    * ```
    */
  get identityVerification(): Prisma.IdentityVerificationDelegate<ExtArgs>;

  /**
   * `prisma.backgroundCheck`: Exposes CRUD operations for the **BackgroundCheck** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BackgroundChecks
    * const backgroundChecks = await prisma.backgroundCheck.findMany()
    * ```
    */
  get backgroundCheck(): Prisma.BackgroundCheckDelegate<ExtArgs>;

  /**
   * `prisma.visaVerification`: Exposes CRUD operations for the **VisaVerification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VisaVerifications
    * const visaVerifications = await prisma.visaVerification.findMany()
    * ```
    */
  get visaVerification(): Prisma.VisaVerificationDelegate<ExtArgs>;

  /**
   * `prisma.licenseVerification`: Exposes CRUD operations for the **LicenseVerification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LicenseVerifications
    * const licenseVerifications = await prisma.licenseVerification.findMany()
    * ```
    */
  get licenseVerification(): Prisma.LicenseVerificationDelegate<ExtArgs>;

  /**
   * `prisma.verificationAuditLog`: Exposes CRUD operations for the **VerificationAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationAuditLogs
    * const verificationAuditLogs = await prisma.verificationAuditLog.findMany()
    * ```
    */
  get verificationAuditLog(): Prisma.VerificationAuditLogDelegate<ExtArgs>;

  /**
   * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Verifications
    * const verifications = await prisma.verification.findMany()
    * ```
    */
  get verification(): Prisma.VerificationDelegate<ExtArgs>;
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
    IdentityVerification: 'IdentityVerification',
    BackgroundCheck: 'BackgroundCheck',
    VisaVerification: 'VisaVerification',
    LicenseVerification: 'LicenseVerification',
    VerificationAuditLog: 'VerificationAuditLog',
    Verification: 'Verification'
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
      modelProps: "identityVerification" | "backgroundCheck" | "visaVerification" | "licenseVerification" | "verificationAuditLog" | "verification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      IdentityVerification: {
        payload: Prisma.$IdentityVerificationPayload<ExtArgs>
        fields: Prisma.IdentityVerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IdentityVerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityVerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IdentityVerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityVerificationPayload>
          }
          findFirst: {
            args: Prisma.IdentityVerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityVerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IdentityVerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityVerificationPayload>
          }
          findMany: {
            args: Prisma.IdentityVerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityVerificationPayload>[]
          }
          create: {
            args: Prisma.IdentityVerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityVerificationPayload>
          }
          createMany: {
            args: Prisma.IdentityVerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IdentityVerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityVerificationPayload>[]
          }
          delete: {
            args: Prisma.IdentityVerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityVerificationPayload>
          }
          update: {
            args: Prisma.IdentityVerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityVerificationPayload>
          }
          deleteMany: {
            args: Prisma.IdentityVerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IdentityVerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.IdentityVerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityVerificationPayload>
          }
          aggregate: {
            args: Prisma.IdentityVerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIdentityVerification>
          }
          groupBy: {
            args: Prisma.IdentityVerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<IdentityVerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.IdentityVerificationCountArgs<ExtArgs>
            result: $Utils.Optional<IdentityVerificationCountAggregateOutputType> | number
          }
        }
      }
      BackgroundCheck: {
        payload: Prisma.$BackgroundCheckPayload<ExtArgs>
        fields: Prisma.BackgroundCheckFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BackgroundCheckFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundCheckPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BackgroundCheckFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundCheckPayload>
          }
          findFirst: {
            args: Prisma.BackgroundCheckFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundCheckPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BackgroundCheckFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundCheckPayload>
          }
          findMany: {
            args: Prisma.BackgroundCheckFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundCheckPayload>[]
          }
          create: {
            args: Prisma.BackgroundCheckCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundCheckPayload>
          }
          createMany: {
            args: Prisma.BackgroundCheckCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BackgroundCheckCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundCheckPayload>[]
          }
          delete: {
            args: Prisma.BackgroundCheckDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundCheckPayload>
          }
          update: {
            args: Prisma.BackgroundCheckUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundCheckPayload>
          }
          deleteMany: {
            args: Prisma.BackgroundCheckDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BackgroundCheckUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BackgroundCheckUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackgroundCheckPayload>
          }
          aggregate: {
            args: Prisma.BackgroundCheckAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBackgroundCheck>
          }
          groupBy: {
            args: Prisma.BackgroundCheckGroupByArgs<ExtArgs>
            result: $Utils.Optional<BackgroundCheckGroupByOutputType>[]
          }
          count: {
            args: Prisma.BackgroundCheckCountArgs<ExtArgs>
            result: $Utils.Optional<BackgroundCheckCountAggregateOutputType> | number
          }
        }
      }
      VisaVerification: {
        payload: Prisma.$VisaVerificationPayload<ExtArgs>
        fields: Prisma.VisaVerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VisaVerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisaVerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VisaVerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisaVerificationPayload>
          }
          findFirst: {
            args: Prisma.VisaVerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisaVerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VisaVerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisaVerificationPayload>
          }
          findMany: {
            args: Prisma.VisaVerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisaVerificationPayload>[]
          }
          create: {
            args: Prisma.VisaVerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisaVerificationPayload>
          }
          createMany: {
            args: Prisma.VisaVerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VisaVerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisaVerificationPayload>[]
          }
          delete: {
            args: Prisma.VisaVerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisaVerificationPayload>
          }
          update: {
            args: Prisma.VisaVerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisaVerificationPayload>
          }
          deleteMany: {
            args: Prisma.VisaVerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VisaVerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VisaVerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisaVerificationPayload>
          }
          aggregate: {
            args: Prisma.VisaVerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVisaVerification>
          }
          groupBy: {
            args: Prisma.VisaVerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VisaVerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.VisaVerificationCountArgs<ExtArgs>
            result: $Utils.Optional<VisaVerificationCountAggregateOutputType> | number
          }
        }
      }
      LicenseVerification: {
        payload: Prisma.$LicenseVerificationPayload<ExtArgs>
        fields: Prisma.LicenseVerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LicenseVerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LicenseVerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LicenseVerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LicenseVerificationPayload>
          }
          findFirst: {
            args: Prisma.LicenseVerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LicenseVerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LicenseVerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LicenseVerificationPayload>
          }
          findMany: {
            args: Prisma.LicenseVerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LicenseVerificationPayload>[]
          }
          create: {
            args: Prisma.LicenseVerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LicenseVerificationPayload>
          }
          createMany: {
            args: Prisma.LicenseVerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LicenseVerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LicenseVerificationPayload>[]
          }
          delete: {
            args: Prisma.LicenseVerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LicenseVerificationPayload>
          }
          update: {
            args: Prisma.LicenseVerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LicenseVerificationPayload>
          }
          deleteMany: {
            args: Prisma.LicenseVerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LicenseVerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LicenseVerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LicenseVerificationPayload>
          }
          aggregate: {
            args: Prisma.LicenseVerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLicenseVerification>
          }
          groupBy: {
            args: Prisma.LicenseVerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<LicenseVerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.LicenseVerificationCountArgs<ExtArgs>
            result: $Utils.Optional<LicenseVerificationCountAggregateOutputType> | number
          }
        }
      }
      VerificationAuditLog: {
        payload: Prisma.$VerificationAuditLogPayload<ExtArgs>
        fields: Prisma.VerificationAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationAuditLogPayload>
          }
          findFirst: {
            args: Prisma.VerificationAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationAuditLogPayload>
          }
          findMany: {
            args: Prisma.VerificationAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationAuditLogPayload>[]
          }
          create: {
            args: Prisma.VerificationAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationAuditLogPayload>
          }
          createMany: {
            args: Prisma.VerificationAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationAuditLogPayload>[]
          }
          delete: {
            args: Prisma.VerificationAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationAuditLogPayload>
          }
          update: {
            args: Prisma.VerificationAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.VerificationAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VerificationAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationAuditLogPayload>
          }
          aggregate: {
            args: Prisma.VerificationAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationAuditLog>
          }
          groupBy: {
            args: Prisma.VerificationAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationAuditLogCountAggregateOutputType> | number
          }
        }
      }
      Verification: {
        payload: Prisma.$VerificationPayload<ExtArgs>
        fields: Prisma.VerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findFirst: {
            args: Prisma.VerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findMany: {
            args: Prisma.VerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          create: {
            args: Prisma.VerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          createMany: {
            args: Prisma.VerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          delete: {
            args: Prisma.VerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          update: {
            args: Prisma.VerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          deleteMany: {
            args: Prisma.VerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          aggregate: {
            args: Prisma.VerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerification>
          }
          groupBy: {
            args: Prisma.VerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationCountAggregateOutputType> | number
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
   * Models
   */

  /**
   * Model IdentityVerification
   */

  export type AggregateIdentityVerification = {
    _count: IdentityVerificationCountAggregateOutputType | null
    _min: IdentityVerificationMinAggregateOutputType | null
    _max: IdentityVerificationMaxAggregateOutputType | null
  }

  export type IdentityVerificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    status: string | null
    provider: string | null
    personaInquiryId: string | null
    documentType: string | null
    documentNumber: string | null
    verifiedAt: Date | null
    expiresAt: Date | null
    failureReason: string | null
    metadata: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IdentityVerificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    status: string | null
    provider: string | null
    personaInquiryId: string | null
    documentType: string | null
    documentNumber: string | null
    verifiedAt: Date | null
    expiresAt: Date | null
    failureReason: string | null
    metadata: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IdentityVerificationCountAggregateOutputType = {
    id: number
    userId: number
    status: number
    provider: number
    personaInquiryId: number
    documentType: number
    documentNumber: number
    verifiedAt: number
    expiresAt: number
    failureReason: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type IdentityVerificationMinAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    provider?: true
    personaInquiryId?: true
    documentType?: true
    documentNumber?: true
    verifiedAt?: true
    expiresAt?: true
    failureReason?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IdentityVerificationMaxAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    provider?: true
    personaInquiryId?: true
    documentType?: true
    documentNumber?: true
    verifiedAt?: true
    expiresAt?: true
    failureReason?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IdentityVerificationCountAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    provider?: true
    personaInquiryId?: true
    documentType?: true
    documentNumber?: true
    verifiedAt?: true
    expiresAt?: true
    failureReason?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type IdentityVerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IdentityVerification to aggregate.
     */
    where?: IdentityVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdentityVerifications to fetch.
     */
    orderBy?: IdentityVerificationOrderByWithRelationInput | IdentityVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IdentityVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdentityVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdentityVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IdentityVerifications
    **/
    _count?: true | IdentityVerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IdentityVerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IdentityVerificationMaxAggregateInputType
  }

  export type GetIdentityVerificationAggregateType<T extends IdentityVerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateIdentityVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIdentityVerification[P]>
      : GetScalarType<T[P], AggregateIdentityVerification[P]>
  }




  export type IdentityVerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IdentityVerificationWhereInput
    orderBy?: IdentityVerificationOrderByWithAggregationInput | IdentityVerificationOrderByWithAggregationInput[]
    by: IdentityVerificationScalarFieldEnum[] | IdentityVerificationScalarFieldEnum
    having?: IdentityVerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IdentityVerificationCountAggregateInputType | true
    _min?: IdentityVerificationMinAggregateInputType
    _max?: IdentityVerificationMaxAggregateInputType
  }

  export type IdentityVerificationGroupByOutputType = {
    id: string
    userId: string
    status: string
    provider: string
    personaInquiryId: string | null
    documentType: string | null
    documentNumber: string | null
    verifiedAt: Date | null
    expiresAt: Date | null
    failureReason: string | null
    metadata: string | null
    createdAt: Date
    updatedAt: Date
    _count: IdentityVerificationCountAggregateOutputType | null
    _min: IdentityVerificationMinAggregateOutputType | null
    _max: IdentityVerificationMaxAggregateOutputType | null
  }

  type GetIdentityVerificationGroupByPayload<T extends IdentityVerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IdentityVerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IdentityVerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IdentityVerificationGroupByOutputType[P]>
            : GetScalarType<T[P], IdentityVerificationGroupByOutputType[P]>
        }
      >
    >


  export type IdentityVerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    provider?: boolean
    personaInquiryId?: boolean
    documentType?: boolean
    documentNumber?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    failureReason?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["identityVerification"]>

  export type IdentityVerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    provider?: boolean
    personaInquiryId?: boolean
    documentType?: boolean
    documentNumber?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    failureReason?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["identityVerification"]>

  export type IdentityVerificationSelectScalar = {
    id?: boolean
    userId?: boolean
    status?: boolean
    provider?: boolean
    personaInquiryId?: boolean
    documentType?: boolean
    documentNumber?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    failureReason?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $IdentityVerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IdentityVerification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      status: string
      provider: string
      personaInquiryId: string | null
      documentType: string | null
      documentNumber: string | null
      verifiedAt: Date | null
      expiresAt: Date | null
      failureReason: string | null
      metadata: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["identityVerification"]>
    composites: {}
  }

  type IdentityVerificationGetPayload<S extends boolean | null | undefined | IdentityVerificationDefaultArgs> = $Result.GetResult<Prisma.$IdentityVerificationPayload, S>

  type IdentityVerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<IdentityVerificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: IdentityVerificationCountAggregateInputType | true
    }

  export interface IdentityVerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IdentityVerification'], meta: { name: 'IdentityVerification' } }
    /**
     * Find zero or one IdentityVerification that matches the filter.
     * @param {IdentityVerificationFindUniqueArgs} args - Arguments to find a IdentityVerification
     * @example
     * // Get one IdentityVerification
     * const identityVerification = await prisma.identityVerification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IdentityVerificationFindUniqueArgs>(args: SelectSubset<T, IdentityVerificationFindUniqueArgs<ExtArgs>>): Prisma__IdentityVerificationClient<$Result.GetResult<Prisma.$IdentityVerificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one IdentityVerification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {IdentityVerificationFindUniqueOrThrowArgs} args - Arguments to find a IdentityVerification
     * @example
     * // Get one IdentityVerification
     * const identityVerification = await prisma.identityVerification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IdentityVerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, IdentityVerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IdentityVerificationClient<$Result.GetResult<Prisma.$IdentityVerificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first IdentityVerification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityVerificationFindFirstArgs} args - Arguments to find a IdentityVerification
     * @example
     * // Get one IdentityVerification
     * const identityVerification = await prisma.identityVerification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IdentityVerificationFindFirstArgs>(args?: SelectSubset<T, IdentityVerificationFindFirstArgs<ExtArgs>>): Prisma__IdentityVerificationClient<$Result.GetResult<Prisma.$IdentityVerificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first IdentityVerification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityVerificationFindFirstOrThrowArgs} args - Arguments to find a IdentityVerification
     * @example
     * // Get one IdentityVerification
     * const identityVerification = await prisma.identityVerification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IdentityVerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, IdentityVerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__IdentityVerificationClient<$Result.GetResult<Prisma.$IdentityVerificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more IdentityVerifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityVerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IdentityVerifications
     * const identityVerifications = await prisma.identityVerification.findMany()
     * 
     * // Get first 10 IdentityVerifications
     * const identityVerifications = await prisma.identityVerification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const identityVerificationWithIdOnly = await prisma.identityVerification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IdentityVerificationFindManyArgs>(args?: SelectSubset<T, IdentityVerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdentityVerificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a IdentityVerification.
     * @param {IdentityVerificationCreateArgs} args - Arguments to create a IdentityVerification.
     * @example
     * // Create one IdentityVerification
     * const IdentityVerification = await prisma.identityVerification.create({
     *   data: {
     *     // ... data to create a IdentityVerification
     *   }
     * })
     * 
     */
    create<T extends IdentityVerificationCreateArgs>(args: SelectSubset<T, IdentityVerificationCreateArgs<ExtArgs>>): Prisma__IdentityVerificationClient<$Result.GetResult<Prisma.$IdentityVerificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many IdentityVerifications.
     * @param {IdentityVerificationCreateManyArgs} args - Arguments to create many IdentityVerifications.
     * @example
     * // Create many IdentityVerifications
     * const identityVerification = await prisma.identityVerification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IdentityVerificationCreateManyArgs>(args?: SelectSubset<T, IdentityVerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IdentityVerifications and returns the data saved in the database.
     * @param {IdentityVerificationCreateManyAndReturnArgs} args - Arguments to create many IdentityVerifications.
     * @example
     * // Create many IdentityVerifications
     * const identityVerification = await prisma.identityVerification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IdentityVerifications and only return the `id`
     * const identityVerificationWithIdOnly = await prisma.identityVerification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IdentityVerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, IdentityVerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdentityVerificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a IdentityVerification.
     * @param {IdentityVerificationDeleteArgs} args - Arguments to delete one IdentityVerification.
     * @example
     * // Delete one IdentityVerification
     * const IdentityVerification = await prisma.identityVerification.delete({
     *   where: {
     *     // ... filter to delete one IdentityVerification
     *   }
     * })
     * 
     */
    delete<T extends IdentityVerificationDeleteArgs>(args: SelectSubset<T, IdentityVerificationDeleteArgs<ExtArgs>>): Prisma__IdentityVerificationClient<$Result.GetResult<Prisma.$IdentityVerificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one IdentityVerification.
     * @param {IdentityVerificationUpdateArgs} args - Arguments to update one IdentityVerification.
     * @example
     * // Update one IdentityVerification
     * const identityVerification = await prisma.identityVerification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IdentityVerificationUpdateArgs>(args: SelectSubset<T, IdentityVerificationUpdateArgs<ExtArgs>>): Prisma__IdentityVerificationClient<$Result.GetResult<Prisma.$IdentityVerificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more IdentityVerifications.
     * @param {IdentityVerificationDeleteManyArgs} args - Arguments to filter IdentityVerifications to delete.
     * @example
     * // Delete a few IdentityVerifications
     * const { count } = await prisma.identityVerification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IdentityVerificationDeleteManyArgs>(args?: SelectSubset<T, IdentityVerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IdentityVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityVerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IdentityVerifications
     * const identityVerification = await prisma.identityVerification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IdentityVerificationUpdateManyArgs>(args: SelectSubset<T, IdentityVerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one IdentityVerification.
     * @param {IdentityVerificationUpsertArgs} args - Arguments to update or create a IdentityVerification.
     * @example
     * // Update or create a IdentityVerification
     * const identityVerification = await prisma.identityVerification.upsert({
     *   create: {
     *     // ... data to create a IdentityVerification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IdentityVerification we want to update
     *   }
     * })
     */
    upsert<T extends IdentityVerificationUpsertArgs>(args: SelectSubset<T, IdentityVerificationUpsertArgs<ExtArgs>>): Prisma__IdentityVerificationClient<$Result.GetResult<Prisma.$IdentityVerificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of IdentityVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityVerificationCountArgs} args - Arguments to filter IdentityVerifications to count.
     * @example
     * // Count the number of IdentityVerifications
     * const count = await prisma.identityVerification.count({
     *   where: {
     *     // ... the filter for the IdentityVerifications we want to count
     *   }
     * })
    **/
    count<T extends IdentityVerificationCountArgs>(
      args?: Subset<T, IdentityVerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IdentityVerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IdentityVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityVerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends IdentityVerificationAggregateArgs>(args: Subset<T, IdentityVerificationAggregateArgs>): Prisma.PrismaPromise<GetIdentityVerificationAggregateType<T>>

    /**
     * Group by IdentityVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityVerificationGroupByArgs} args - Group by arguments.
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
      T extends IdentityVerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IdentityVerificationGroupByArgs['orderBy'] }
        : { orderBy?: IdentityVerificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, IdentityVerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIdentityVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IdentityVerification model
   */
  readonly fields: IdentityVerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IdentityVerification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IdentityVerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the IdentityVerification model
   */ 
  interface IdentityVerificationFieldRefs {
    readonly id: FieldRef<"IdentityVerification", 'String'>
    readonly userId: FieldRef<"IdentityVerification", 'String'>
    readonly status: FieldRef<"IdentityVerification", 'String'>
    readonly provider: FieldRef<"IdentityVerification", 'String'>
    readonly personaInquiryId: FieldRef<"IdentityVerification", 'String'>
    readonly documentType: FieldRef<"IdentityVerification", 'String'>
    readonly documentNumber: FieldRef<"IdentityVerification", 'String'>
    readonly verifiedAt: FieldRef<"IdentityVerification", 'DateTime'>
    readonly expiresAt: FieldRef<"IdentityVerification", 'DateTime'>
    readonly failureReason: FieldRef<"IdentityVerification", 'String'>
    readonly metadata: FieldRef<"IdentityVerification", 'String'>
    readonly createdAt: FieldRef<"IdentityVerification", 'DateTime'>
    readonly updatedAt: FieldRef<"IdentityVerification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * IdentityVerification findUnique
   */
  export type IdentityVerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityVerification
     */
    select?: IdentityVerificationSelect<ExtArgs> | null
    /**
     * Filter, which IdentityVerification to fetch.
     */
    where: IdentityVerificationWhereUniqueInput
  }

  /**
   * IdentityVerification findUniqueOrThrow
   */
  export type IdentityVerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityVerification
     */
    select?: IdentityVerificationSelect<ExtArgs> | null
    /**
     * Filter, which IdentityVerification to fetch.
     */
    where: IdentityVerificationWhereUniqueInput
  }

  /**
   * IdentityVerification findFirst
   */
  export type IdentityVerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityVerification
     */
    select?: IdentityVerificationSelect<ExtArgs> | null
    /**
     * Filter, which IdentityVerification to fetch.
     */
    where?: IdentityVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdentityVerifications to fetch.
     */
    orderBy?: IdentityVerificationOrderByWithRelationInput | IdentityVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IdentityVerifications.
     */
    cursor?: IdentityVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdentityVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdentityVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IdentityVerifications.
     */
    distinct?: IdentityVerificationScalarFieldEnum | IdentityVerificationScalarFieldEnum[]
  }

  /**
   * IdentityVerification findFirstOrThrow
   */
  export type IdentityVerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityVerification
     */
    select?: IdentityVerificationSelect<ExtArgs> | null
    /**
     * Filter, which IdentityVerification to fetch.
     */
    where?: IdentityVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdentityVerifications to fetch.
     */
    orderBy?: IdentityVerificationOrderByWithRelationInput | IdentityVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IdentityVerifications.
     */
    cursor?: IdentityVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdentityVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdentityVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IdentityVerifications.
     */
    distinct?: IdentityVerificationScalarFieldEnum | IdentityVerificationScalarFieldEnum[]
  }

  /**
   * IdentityVerification findMany
   */
  export type IdentityVerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityVerification
     */
    select?: IdentityVerificationSelect<ExtArgs> | null
    /**
     * Filter, which IdentityVerifications to fetch.
     */
    where?: IdentityVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdentityVerifications to fetch.
     */
    orderBy?: IdentityVerificationOrderByWithRelationInput | IdentityVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IdentityVerifications.
     */
    cursor?: IdentityVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdentityVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdentityVerifications.
     */
    skip?: number
    distinct?: IdentityVerificationScalarFieldEnum | IdentityVerificationScalarFieldEnum[]
  }

  /**
   * IdentityVerification create
   */
  export type IdentityVerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityVerification
     */
    select?: IdentityVerificationSelect<ExtArgs> | null
    /**
     * The data needed to create a IdentityVerification.
     */
    data: XOR<IdentityVerificationCreateInput, IdentityVerificationUncheckedCreateInput>
  }

  /**
   * IdentityVerification createMany
   */
  export type IdentityVerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IdentityVerifications.
     */
    data: IdentityVerificationCreateManyInput | IdentityVerificationCreateManyInput[]
  }

  /**
   * IdentityVerification createManyAndReturn
   */
  export type IdentityVerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityVerification
     */
    select?: IdentityVerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many IdentityVerifications.
     */
    data: IdentityVerificationCreateManyInput | IdentityVerificationCreateManyInput[]
  }

  /**
   * IdentityVerification update
   */
  export type IdentityVerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityVerification
     */
    select?: IdentityVerificationSelect<ExtArgs> | null
    /**
     * The data needed to update a IdentityVerification.
     */
    data: XOR<IdentityVerificationUpdateInput, IdentityVerificationUncheckedUpdateInput>
    /**
     * Choose, which IdentityVerification to update.
     */
    where: IdentityVerificationWhereUniqueInput
  }

  /**
   * IdentityVerification updateMany
   */
  export type IdentityVerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IdentityVerifications.
     */
    data: XOR<IdentityVerificationUpdateManyMutationInput, IdentityVerificationUncheckedUpdateManyInput>
    /**
     * Filter which IdentityVerifications to update
     */
    where?: IdentityVerificationWhereInput
  }

  /**
   * IdentityVerification upsert
   */
  export type IdentityVerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityVerification
     */
    select?: IdentityVerificationSelect<ExtArgs> | null
    /**
     * The filter to search for the IdentityVerification to update in case it exists.
     */
    where: IdentityVerificationWhereUniqueInput
    /**
     * In case the IdentityVerification found by the `where` argument doesn't exist, create a new IdentityVerification with this data.
     */
    create: XOR<IdentityVerificationCreateInput, IdentityVerificationUncheckedCreateInput>
    /**
     * In case the IdentityVerification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IdentityVerificationUpdateInput, IdentityVerificationUncheckedUpdateInput>
  }

  /**
   * IdentityVerification delete
   */
  export type IdentityVerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityVerification
     */
    select?: IdentityVerificationSelect<ExtArgs> | null
    /**
     * Filter which IdentityVerification to delete.
     */
    where: IdentityVerificationWhereUniqueInput
  }

  /**
   * IdentityVerification deleteMany
   */
  export type IdentityVerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IdentityVerifications to delete
     */
    where?: IdentityVerificationWhereInput
  }

  /**
   * IdentityVerification without action
   */
  export type IdentityVerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityVerification
     */
    select?: IdentityVerificationSelect<ExtArgs> | null
  }


  /**
   * Model BackgroundCheck
   */

  export type AggregateBackgroundCheck = {
    _count: BackgroundCheckCountAggregateOutputType | null
    _min: BackgroundCheckMinAggregateOutputType | null
    _max: BackgroundCheckMaxAggregateOutputType | null
  }

  export type BackgroundCheckMinAggregateOutputType = {
    id: string | null
    userId: string | null
    status: string | null
    provider: string | null
    checkrReportId: string | null
    package: string | null
    result: string | null
    completedAt: Date | null
    expiresAt: Date | null
    consentGivenAt: Date | null
    criminalRecords: boolean | null
    sexOffenderRegistry: boolean | null
    globalWatchlist: boolean | null
    ssnTrace: boolean | null
    failureReason: string | null
    metadata: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BackgroundCheckMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    status: string | null
    provider: string | null
    checkrReportId: string | null
    package: string | null
    result: string | null
    completedAt: Date | null
    expiresAt: Date | null
    consentGivenAt: Date | null
    criminalRecords: boolean | null
    sexOffenderRegistry: boolean | null
    globalWatchlist: boolean | null
    ssnTrace: boolean | null
    failureReason: string | null
    metadata: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BackgroundCheckCountAggregateOutputType = {
    id: number
    userId: number
    status: number
    provider: number
    checkrReportId: number
    package: number
    result: number
    completedAt: number
    expiresAt: number
    consentGivenAt: number
    criminalRecords: number
    sexOffenderRegistry: number
    globalWatchlist: number
    ssnTrace: number
    failureReason: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BackgroundCheckMinAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    provider?: true
    checkrReportId?: true
    package?: true
    result?: true
    completedAt?: true
    expiresAt?: true
    consentGivenAt?: true
    criminalRecords?: true
    sexOffenderRegistry?: true
    globalWatchlist?: true
    ssnTrace?: true
    failureReason?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BackgroundCheckMaxAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    provider?: true
    checkrReportId?: true
    package?: true
    result?: true
    completedAt?: true
    expiresAt?: true
    consentGivenAt?: true
    criminalRecords?: true
    sexOffenderRegistry?: true
    globalWatchlist?: true
    ssnTrace?: true
    failureReason?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BackgroundCheckCountAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    provider?: true
    checkrReportId?: true
    package?: true
    result?: true
    completedAt?: true
    expiresAt?: true
    consentGivenAt?: true
    criminalRecords?: true
    sexOffenderRegistry?: true
    globalWatchlist?: true
    ssnTrace?: true
    failureReason?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BackgroundCheckAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackgroundCheck to aggregate.
     */
    where?: BackgroundCheckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackgroundChecks to fetch.
     */
    orderBy?: BackgroundCheckOrderByWithRelationInput | BackgroundCheckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BackgroundCheckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackgroundChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackgroundChecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BackgroundChecks
    **/
    _count?: true | BackgroundCheckCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BackgroundCheckMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BackgroundCheckMaxAggregateInputType
  }

  export type GetBackgroundCheckAggregateType<T extends BackgroundCheckAggregateArgs> = {
        [P in keyof T & keyof AggregateBackgroundCheck]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBackgroundCheck[P]>
      : GetScalarType<T[P], AggregateBackgroundCheck[P]>
  }




  export type BackgroundCheckGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BackgroundCheckWhereInput
    orderBy?: BackgroundCheckOrderByWithAggregationInput | BackgroundCheckOrderByWithAggregationInput[]
    by: BackgroundCheckScalarFieldEnum[] | BackgroundCheckScalarFieldEnum
    having?: BackgroundCheckScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BackgroundCheckCountAggregateInputType | true
    _min?: BackgroundCheckMinAggregateInputType
    _max?: BackgroundCheckMaxAggregateInputType
  }

  export type BackgroundCheckGroupByOutputType = {
    id: string
    userId: string
    status: string
    provider: string
    checkrReportId: string | null
    package: string | null
    result: string | null
    completedAt: Date | null
    expiresAt: Date | null
    consentGivenAt: Date | null
    criminalRecords: boolean | null
    sexOffenderRegistry: boolean | null
    globalWatchlist: boolean | null
    ssnTrace: boolean | null
    failureReason: string | null
    metadata: string | null
    createdAt: Date
    updatedAt: Date
    _count: BackgroundCheckCountAggregateOutputType | null
    _min: BackgroundCheckMinAggregateOutputType | null
    _max: BackgroundCheckMaxAggregateOutputType | null
  }

  type GetBackgroundCheckGroupByPayload<T extends BackgroundCheckGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BackgroundCheckGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BackgroundCheckGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BackgroundCheckGroupByOutputType[P]>
            : GetScalarType<T[P], BackgroundCheckGroupByOutputType[P]>
        }
      >
    >


  export type BackgroundCheckSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    provider?: boolean
    checkrReportId?: boolean
    package?: boolean
    result?: boolean
    completedAt?: boolean
    expiresAt?: boolean
    consentGivenAt?: boolean
    criminalRecords?: boolean
    sexOffenderRegistry?: boolean
    globalWatchlist?: boolean
    ssnTrace?: boolean
    failureReason?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["backgroundCheck"]>

  export type BackgroundCheckSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    provider?: boolean
    checkrReportId?: boolean
    package?: boolean
    result?: boolean
    completedAt?: boolean
    expiresAt?: boolean
    consentGivenAt?: boolean
    criminalRecords?: boolean
    sexOffenderRegistry?: boolean
    globalWatchlist?: boolean
    ssnTrace?: boolean
    failureReason?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["backgroundCheck"]>

  export type BackgroundCheckSelectScalar = {
    id?: boolean
    userId?: boolean
    status?: boolean
    provider?: boolean
    checkrReportId?: boolean
    package?: boolean
    result?: boolean
    completedAt?: boolean
    expiresAt?: boolean
    consentGivenAt?: boolean
    criminalRecords?: boolean
    sexOffenderRegistry?: boolean
    globalWatchlist?: boolean
    ssnTrace?: boolean
    failureReason?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $BackgroundCheckPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BackgroundCheck"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      status: string
      provider: string
      checkrReportId: string | null
      package: string | null
      result: string | null
      completedAt: Date | null
      expiresAt: Date | null
      consentGivenAt: Date | null
      criminalRecords: boolean | null
      sexOffenderRegistry: boolean | null
      globalWatchlist: boolean | null
      ssnTrace: boolean | null
      failureReason: string | null
      metadata: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["backgroundCheck"]>
    composites: {}
  }

  type BackgroundCheckGetPayload<S extends boolean | null | undefined | BackgroundCheckDefaultArgs> = $Result.GetResult<Prisma.$BackgroundCheckPayload, S>

  type BackgroundCheckCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BackgroundCheckFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BackgroundCheckCountAggregateInputType | true
    }

  export interface BackgroundCheckDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BackgroundCheck'], meta: { name: 'BackgroundCheck' } }
    /**
     * Find zero or one BackgroundCheck that matches the filter.
     * @param {BackgroundCheckFindUniqueArgs} args - Arguments to find a BackgroundCheck
     * @example
     * // Get one BackgroundCheck
     * const backgroundCheck = await prisma.backgroundCheck.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BackgroundCheckFindUniqueArgs>(args: SelectSubset<T, BackgroundCheckFindUniqueArgs<ExtArgs>>): Prisma__BackgroundCheckClient<$Result.GetResult<Prisma.$BackgroundCheckPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BackgroundCheck that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BackgroundCheckFindUniqueOrThrowArgs} args - Arguments to find a BackgroundCheck
     * @example
     * // Get one BackgroundCheck
     * const backgroundCheck = await prisma.backgroundCheck.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BackgroundCheckFindUniqueOrThrowArgs>(args: SelectSubset<T, BackgroundCheckFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BackgroundCheckClient<$Result.GetResult<Prisma.$BackgroundCheckPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BackgroundCheck that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundCheckFindFirstArgs} args - Arguments to find a BackgroundCheck
     * @example
     * // Get one BackgroundCheck
     * const backgroundCheck = await prisma.backgroundCheck.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BackgroundCheckFindFirstArgs>(args?: SelectSubset<T, BackgroundCheckFindFirstArgs<ExtArgs>>): Prisma__BackgroundCheckClient<$Result.GetResult<Prisma.$BackgroundCheckPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BackgroundCheck that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundCheckFindFirstOrThrowArgs} args - Arguments to find a BackgroundCheck
     * @example
     * // Get one BackgroundCheck
     * const backgroundCheck = await prisma.backgroundCheck.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BackgroundCheckFindFirstOrThrowArgs>(args?: SelectSubset<T, BackgroundCheckFindFirstOrThrowArgs<ExtArgs>>): Prisma__BackgroundCheckClient<$Result.GetResult<Prisma.$BackgroundCheckPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BackgroundChecks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundCheckFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BackgroundChecks
     * const backgroundChecks = await prisma.backgroundCheck.findMany()
     * 
     * // Get first 10 BackgroundChecks
     * const backgroundChecks = await prisma.backgroundCheck.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const backgroundCheckWithIdOnly = await prisma.backgroundCheck.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BackgroundCheckFindManyArgs>(args?: SelectSubset<T, BackgroundCheckFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackgroundCheckPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BackgroundCheck.
     * @param {BackgroundCheckCreateArgs} args - Arguments to create a BackgroundCheck.
     * @example
     * // Create one BackgroundCheck
     * const BackgroundCheck = await prisma.backgroundCheck.create({
     *   data: {
     *     // ... data to create a BackgroundCheck
     *   }
     * })
     * 
     */
    create<T extends BackgroundCheckCreateArgs>(args: SelectSubset<T, BackgroundCheckCreateArgs<ExtArgs>>): Prisma__BackgroundCheckClient<$Result.GetResult<Prisma.$BackgroundCheckPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BackgroundChecks.
     * @param {BackgroundCheckCreateManyArgs} args - Arguments to create many BackgroundChecks.
     * @example
     * // Create many BackgroundChecks
     * const backgroundCheck = await prisma.backgroundCheck.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BackgroundCheckCreateManyArgs>(args?: SelectSubset<T, BackgroundCheckCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BackgroundChecks and returns the data saved in the database.
     * @param {BackgroundCheckCreateManyAndReturnArgs} args - Arguments to create many BackgroundChecks.
     * @example
     * // Create many BackgroundChecks
     * const backgroundCheck = await prisma.backgroundCheck.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BackgroundChecks and only return the `id`
     * const backgroundCheckWithIdOnly = await prisma.backgroundCheck.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BackgroundCheckCreateManyAndReturnArgs>(args?: SelectSubset<T, BackgroundCheckCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackgroundCheckPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BackgroundCheck.
     * @param {BackgroundCheckDeleteArgs} args - Arguments to delete one BackgroundCheck.
     * @example
     * // Delete one BackgroundCheck
     * const BackgroundCheck = await prisma.backgroundCheck.delete({
     *   where: {
     *     // ... filter to delete one BackgroundCheck
     *   }
     * })
     * 
     */
    delete<T extends BackgroundCheckDeleteArgs>(args: SelectSubset<T, BackgroundCheckDeleteArgs<ExtArgs>>): Prisma__BackgroundCheckClient<$Result.GetResult<Prisma.$BackgroundCheckPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BackgroundCheck.
     * @param {BackgroundCheckUpdateArgs} args - Arguments to update one BackgroundCheck.
     * @example
     * // Update one BackgroundCheck
     * const backgroundCheck = await prisma.backgroundCheck.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BackgroundCheckUpdateArgs>(args: SelectSubset<T, BackgroundCheckUpdateArgs<ExtArgs>>): Prisma__BackgroundCheckClient<$Result.GetResult<Prisma.$BackgroundCheckPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BackgroundChecks.
     * @param {BackgroundCheckDeleteManyArgs} args - Arguments to filter BackgroundChecks to delete.
     * @example
     * // Delete a few BackgroundChecks
     * const { count } = await prisma.backgroundCheck.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BackgroundCheckDeleteManyArgs>(args?: SelectSubset<T, BackgroundCheckDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BackgroundChecks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundCheckUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BackgroundChecks
     * const backgroundCheck = await prisma.backgroundCheck.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BackgroundCheckUpdateManyArgs>(args: SelectSubset<T, BackgroundCheckUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BackgroundCheck.
     * @param {BackgroundCheckUpsertArgs} args - Arguments to update or create a BackgroundCheck.
     * @example
     * // Update or create a BackgroundCheck
     * const backgroundCheck = await prisma.backgroundCheck.upsert({
     *   create: {
     *     // ... data to create a BackgroundCheck
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BackgroundCheck we want to update
     *   }
     * })
     */
    upsert<T extends BackgroundCheckUpsertArgs>(args: SelectSubset<T, BackgroundCheckUpsertArgs<ExtArgs>>): Prisma__BackgroundCheckClient<$Result.GetResult<Prisma.$BackgroundCheckPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BackgroundChecks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundCheckCountArgs} args - Arguments to filter BackgroundChecks to count.
     * @example
     * // Count the number of BackgroundChecks
     * const count = await prisma.backgroundCheck.count({
     *   where: {
     *     // ... the filter for the BackgroundChecks we want to count
     *   }
     * })
    **/
    count<T extends BackgroundCheckCountArgs>(
      args?: Subset<T, BackgroundCheckCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BackgroundCheckCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BackgroundCheck.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundCheckAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BackgroundCheckAggregateArgs>(args: Subset<T, BackgroundCheckAggregateArgs>): Prisma.PrismaPromise<GetBackgroundCheckAggregateType<T>>

    /**
     * Group by BackgroundCheck.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackgroundCheckGroupByArgs} args - Group by arguments.
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
      T extends BackgroundCheckGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BackgroundCheckGroupByArgs['orderBy'] }
        : { orderBy?: BackgroundCheckGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BackgroundCheckGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBackgroundCheckGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BackgroundCheck model
   */
  readonly fields: BackgroundCheckFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BackgroundCheck.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BackgroundCheckClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the BackgroundCheck model
   */ 
  interface BackgroundCheckFieldRefs {
    readonly id: FieldRef<"BackgroundCheck", 'String'>
    readonly userId: FieldRef<"BackgroundCheck", 'String'>
    readonly status: FieldRef<"BackgroundCheck", 'String'>
    readonly provider: FieldRef<"BackgroundCheck", 'String'>
    readonly checkrReportId: FieldRef<"BackgroundCheck", 'String'>
    readonly package: FieldRef<"BackgroundCheck", 'String'>
    readonly result: FieldRef<"BackgroundCheck", 'String'>
    readonly completedAt: FieldRef<"BackgroundCheck", 'DateTime'>
    readonly expiresAt: FieldRef<"BackgroundCheck", 'DateTime'>
    readonly consentGivenAt: FieldRef<"BackgroundCheck", 'DateTime'>
    readonly criminalRecords: FieldRef<"BackgroundCheck", 'Boolean'>
    readonly sexOffenderRegistry: FieldRef<"BackgroundCheck", 'Boolean'>
    readonly globalWatchlist: FieldRef<"BackgroundCheck", 'Boolean'>
    readonly ssnTrace: FieldRef<"BackgroundCheck", 'Boolean'>
    readonly failureReason: FieldRef<"BackgroundCheck", 'String'>
    readonly metadata: FieldRef<"BackgroundCheck", 'String'>
    readonly createdAt: FieldRef<"BackgroundCheck", 'DateTime'>
    readonly updatedAt: FieldRef<"BackgroundCheck", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BackgroundCheck findUnique
   */
  export type BackgroundCheckFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundCheck
     */
    select?: BackgroundCheckSelect<ExtArgs> | null
    /**
     * Filter, which BackgroundCheck to fetch.
     */
    where: BackgroundCheckWhereUniqueInput
  }

  /**
   * BackgroundCheck findUniqueOrThrow
   */
  export type BackgroundCheckFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundCheck
     */
    select?: BackgroundCheckSelect<ExtArgs> | null
    /**
     * Filter, which BackgroundCheck to fetch.
     */
    where: BackgroundCheckWhereUniqueInput
  }

  /**
   * BackgroundCheck findFirst
   */
  export type BackgroundCheckFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundCheck
     */
    select?: BackgroundCheckSelect<ExtArgs> | null
    /**
     * Filter, which BackgroundCheck to fetch.
     */
    where?: BackgroundCheckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackgroundChecks to fetch.
     */
    orderBy?: BackgroundCheckOrderByWithRelationInput | BackgroundCheckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackgroundChecks.
     */
    cursor?: BackgroundCheckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackgroundChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackgroundChecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackgroundChecks.
     */
    distinct?: BackgroundCheckScalarFieldEnum | BackgroundCheckScalarFieldEnum[]
  }

  /**
   * BackgroundCheck findFirstOrThrow
   */
  export type BackgroundCheckFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundCheck
     */
    select?: BackgroundCheckSelect<ExtArgs> | null
    /**
     * Filter, which BackgroundCheck to fetch.
     */
    where?: BackgroundCheckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackgroundChecks to fetch.
     */
    orderBy?: BackgroundCheckOrderByWithRelationInput | BackgroundCheckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BackgroundChecks.
     */
    cursor?: BackgroundCheckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackgroundChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackgroundChecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BackgroundChecks.
     */
    distinct?: BackgroundCheckScalarFieldEnum | BackgroundCheckScalarFieldEnum[]
  }

  /**
   * BackgroundCheck findMany
   */
  export type BackgroundCheckFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundCheck
     */
    select?: BackgroundCheckSelect<ExtArgs> | null
    /**
     * Filter, which BackgroundChecks to fetch.
     */
    where?: BackgroundCheckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BackgroundChecks to fetch.
     */
    orderBy?: BackgroundCheckOrderByWithRelationInput | BackgroundCheckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BackgroundChecks.
     */
    cursor?: BackgroundCheckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BackgroundChecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BackgroundChecks.
     */
    skip?: number
    distinct?: BackgroundCheckScalarFieldEnum | BackgroundCheckScalarFieldEnum[]
  }

  /**
   * BackgroundCheck create
   */
  export type BackgroundCheckCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundCheck
     */
    select?: BackgroundCheckSelect<ExtArgs> | null
    /**
     * The data needed to create a BackgroundCheck.
     */
    data: XOR<BackgroundCheckCreateInput, BackgroundCheckUncheckedCreateInput>
  }

  /**
   * BackgroundCheck createMany
   */
  export type BackgroundCheckCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BackgroundChecks.
     */
    data: BackgroundCheckCreateManyInput | BackgroundCheckCreateManyInput[]
  }

  /**
   * BackgroundCheck createManyAndReturn
   */
  export type BackgroundCheckCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundCheck
     */
    select?: BackgroundCheckSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BackgroundChecks.
     */
    data: BackgroundCheckCreateManyInput | BackgroundCheckCreateManyInput[]
  }

  /**
   * BackgroundCheck update
   */
  export type BackgroundCheckUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundCheck
     */
    select?: BackgroundCheckSelect<ExtArgs> | null
    /**
     * The data needed to update a BackgroundCheck.
     */
    data: XOR<BackgroundCheckUpdateInput, BackgroundCheckUncheckedUpdateInput>
    /**
     * Choose, which BackgroundCheck to update.
     */
    where: BackgroundCheckWhereUniqueInput
  }

  /**
   * BackgroundCheck updateMany
   */
  export type BackgroundCheckUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BackgroundChecks.
     */
    data: XOR<BackgroundCheckUpdateManyMutationInput, BackgroundCheckUncheckedUpdateManyInput>
    /**
     * Filter which BackgroundChecks to update
     */
    where?: BackgroundCheckWhereInput
  }

  /**
   * BackgroundCheck upsert
   */
  export type BackgroundCheckUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundCheck
     */
    select?: BackgroundCheckSelect<ExtArgs> | null
    /**
     * The filter to search for the BackgroundCheck to update in case it exists.
     */
    where: BackgroundCheckWhereUniqueInput
    /**
     * In case the BackgroundCheck found by the `where` argument doesn't exist, create a new BackgroundCheck with this data.
     */
    create: XOR<BackgroundCheckCreateInput, BackgroundCheckUncheckedCreateInput>
    /**
     * In case the BackgroundCheck was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BackgroundCheckUpdateInput, BackgroundCheckUncheckedUpdateInput>
  }

  /**
   * BackgroundCheck delete
   */
  export type BackgroundCheckDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundCheck
     */
    select?: BackgroundCheckSelect<ExtArgs> | null
    /**
     * Filter which BackgroundCheck to delete.
     */
    where: BackgroundCheckWhereUniqueInput
  }

  /**
   * BackgroundCheck deleteMany
   */
  export type BackgroundCheckDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BackgroundChecks to delete
     */
    where?: BackgroundCheckWhereInput
  }

  /**
   * BackgroundCheck without action
   */
  export type BackgroundCheckDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BackgroundCheck
     */
    select?: BackgroundCheckSelect<ExtArgs> | null
  }


  /**
   * Model VisaVerification
   */

  export type AggregateVisaVerification = {
    _count: VisaVerificationCountAggregateOutputType | null
    _min: VisaVerificationMinAggregateOutputType | null
    _max: VisaVerificationMaxAggregateOutputType | null
  }

  export type VisaVerificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    visaType: string | null
    status: string | null
    verifiedAt: Date | null
    expiresAt: Date | null
    eVerifyCase: string | null
    eVerifyStatus: string | null
    documentUrls: string | null
    i94Number: string | null
    sevisId: string | null
    failureReason: string | null
    metadata: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VisaVerificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    visaType: string | null
    status: string | null
    verifiedAt: Date | null
    expiresAt: Date | null
    eVerifyCase: string | null
    eVerifyStatus: string | null
    documentUrls: string | null
    i94Number: string | null
    sevisId: string | null
    failureReason: string | null
    metadata: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VisaVerificationCountAggregateOutputType = {
    id: number
    userId: number
    visaType: number
    status: number
    verifiedAt: number
    expiresAt: number
    eVerifyCase: number
    eVerifyStatus: number
    documentUrls: number
    i94Number: number
    sevisId: number
    failureReason: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VisaVerificationMinAggregateInputType = {
    id?: true
    userId?: true
    visaType?: true
    status?: true
    verifiedAt?: true
    expiresAt?: true
    eVerifyCase?: true
    eVerifyStatus?: true
    documentUrls?: true
    i94Number?: true
    sevisId?: true
    failureReason?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VisaVerificationMaxAggregateInputType = {
    id?: true
    userId?: true
    visaType?: true
    status?: true
    verifiedAt?: true
    expiresAt?: true
    eVerifyCase?: true
    eVerifyStatus?: true
    documentUrls?: true
    i94Number?: true
    sevisId?: true
    failureReason?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VisaVerificationCountAggregateInputType = {
    id?: true
    userId?: true
    visaType?: true
    status?: true
    verifiedAt?: true
    expiresAt?: true
    eVerifyCase?: true
    eVerifyStatus?: true
    documentUrls?: true
    i94Number?: true
    sevisId?: true
    failureReason?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VisaVerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VisaVerification to aggregate.
     */
    where?: VisaVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisaVerifications to fetch.
     */
    orderBy?: VisaVerificationOrderByWithRelationInput | VisaVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VisaVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisaVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisaVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VisaVerifications
    **/
    _count?: true | VisaVerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VisaVerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VisaVerificationMaxAggregateInputType
  }

  export type GetVisaVerificationAggregateType<T extends VisaVerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateVisaVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVisaVerification[P]>
      : GetScalarType<T[P], AggregateVisaVerification[P]>
  }




  export type VisaVerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisaVerificationWhereInput
    orderBy?: VisaVerificationOrderByWithAggregationInput | VisaVerificationOrderByWithAggregationInput[]
    by: VisaVerificationScalarFieldEnum[] | VisaVerificationScalarFieldEnum
    having?: VisaVerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VisaVerificationCountAggregateInputType | true
    _min?: VisaVerificationMinAggregateInputType
    _max?: VisaVerificationMaxAggregateInputType
  }

  export type VisaVerificationGroupByOutputType = {
    id: string
    userId: string
    visaType: string
    status: string
    verifiedAt: Date | null
    expiresAt: Date | null
    eVerifyCase: string | null
    eVerifyStatus: string | null
    documentUrls: string | null
    i94Number: string | null
    sevisId: string | null
    failureReason: string | null
    metadata: string | null
    createdAt: Date
    updatedAt: Date
    _count: VisaVerificationCountAggregateOutputType | null
    _min: VisaVerificationMinAggregateOutputType | null
    _max: VisaVerificationMaxAggregateOutputType | null
  }

  type GetVisaVerificationGroupByPayload<T extends VisaVerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VisaVerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VisaVerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VisaVerificationGroupByOutputType[P]>
            : GetScalarType<T[P], VisaVerificationGroupByOutputType[P]>
        }
      >
    >


  export type VisaVerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    visaType?: boolean
    status?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    eVerifyCase?: boolean
    eVerifyStatus?: boolean
    documentUrls?: boolean
    i94Number?: boolean
    sevisId?: boolean
    failureReason?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["visaVerification"]>

  export type VisaVerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    visaType?: boolean
    status?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    eVerifyCase?: boolean
    eVerifyStatus?: boolean
    documentUrls?: boolean
    i94Number?: boolean
    sevisId?: boolean
    failureReason?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["visaVerification"]>

  export type VisaVerificationSelectScalar = {
    id?: boolean
    userId?: boolean
    visaType?: boolean
    status?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    eVerifyCase?: boolean
    eVerifyStatus?: boolean
    documentUrls?: boolean
    i94Number?: boolean
    sevisId?: boolean
    failureReason?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $VisaVerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VisaVerification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      visaType: string
      status: string
      verifiedAt: Date | null
      expiresAt: Date | null
      eVerifyCase: string | null
      eVerifyStatus: string | null
      documentUrls: string | null
      i94Number: string | null
      sevisId: string | null
      failureReason: string | null
      metadata: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["visaVerification"]>
    composites: {}
  }

  type VisaVerificationGetPayload<S extends boolean | null | undefined | VisaVerificationDefaultArgs> = $Result.GetResult<Prisma.$VisaVerificationPayload, S>

  type VisaVerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VisaVerificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VisaVerificationCountAggregateInputType | true
    }

  export interface VisaVerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VisaVerification'], meta: { name: 'VisaVerification' } }
    /**
     * Find zero or one VisaVerification that matches the filter.
     * @param {VisaVerificationFindUniqueArgs} args - Arguments to find a VisaVerification
     * @example
     * // Get one VisaVerification
     * const visaVerification = await prisma.visaVerification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VisaVerificationFindUniqueArgs>(args: SelectSubset<T, VisaVerificationFindUniqueArgs<ExtArgs>>): Prisma__VisaVerificationClient<$Result.GetResult<Prisma.$VisaVerificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one VisaVerification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VisaVerificationFindUniqueOrThrowArgs} args - Arguments to find a VisaVerification
     * @example
     * // Get one VisaVerification
     * const visaVerification = await prisma.visaVerification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VisaVerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, VisaVerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VisaVerificationClient<$Result.GetResult<Prisma.$VisaVerificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first VisaVerification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisaVerificationFindFirstArgs} args - Arguments to find a VisaVerification
     * @example
     * // Get one VisaVerification
     * const visaVerification = await prisma.visaVerification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VisaVerificationFindFirstArgs>(args?: SelectSubset<T, VisaVerificationFindFirstArgs<ExtArgs>>): Prisma__VisaVerificationClient<$Result.GetResult<Prisma.$VisaVerificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first VisaVerification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisaVerificationFindFirstOrThrowArgs} args - Arguments to find a VisaVerification
     * @example
     * // Get one VisaVerification
     * const visaVerification = await prisma.visaVerification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VisaVerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, VisaVerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__VisaVerificationClient<$Result.GetResult<Prisma.$VisaVerificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more VisaVerifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisaVerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VisaVerifications
     * const visaVerifications = await prisma.visaVerification.findMany()
     * 
     * // Get first 10 VisaVerifications
     * const visaVerifications = await prisma.visaVerification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const visaVerificationWithIdOnly = await prisma.visaVerification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VisaVerificationFindManyArgs>(args?: SelectSubset<T, VisaVerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisaVerificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a VisaVerification.
     * @param {VisaVerificationCreateArgs} args - Arguments to create a VisaVerification.
     * @example
     * // Create one VisaVerification
     * const VisaVerification = await prisma.visaVerification.create({
     *   data: {
     *     // ... data to create a VisaVerification
     *   }
     * })
     * 
     */
    create<T extends VisaVerificationCreateArgs>(args: SelectSubset<T, VisaVerificationCreateArgs<ExtArgs>>): Prisma__VisaVerificationClient<$Result.GetResult<Prisma.$VisaVerificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many VisaVerifications.
     * @param {VisaVerificationCreateManyArgs} args - Arguments to create many VisaVerifications.
     * @example
     * // Create many VisaVerifications
     * const visaVerification = await prisma.visaVerification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VisaVerificationCreateManyArgs>(args?: SelectSubset<T, VisaVerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VisaVerifications and returns the data saved in the database.
     * @param {VisaVerificationCreateManyAndReturnArgs} args - Arguments to create many VisaVerifications.
     * @example
     * // Create many VisaVerifications
     * const visaVerification = await prisma.visaVerification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VisaVerifications and only return the `id`
     * const visaVerificationWithIdOnly = await prisma.visaVerification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VisaVerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, VisaVerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisaVerificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a VisaVerification.
     * @param {VisaVerificationDeleteArgs} args - Arguments to delete one VisaVerification.
     * @example
     * // Delete one VisaVerification
     * const VisaVerification = await prisma.visaVerification.delete({
     *   where: {
     *     // ... filter to delete one VisaVerification
     *   }
     * })
     * 
     */
    delete<T extends VisaVerificationDeleteArgs>(args: SelectSubset<T, VisaVerificationDeleteArgs<ExtArgs>>): Prisma__VisaVerificationClient<$Result.GetResult<Prisma.$VisaVerificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one VisaVerification.
     * @param {VisaVerificationUpdateArgs} args - Arguments to update one VisaVerification.
     * @example
     * // Update one VisaVerification
     * const visaVerification = await prisma.visaVerification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VisaVerificationUpdateArgs>(args: SelectSubset<T, VisaVerificationUpdateArgs<ExtArgs>>): Prisma__VisaVerificationClient<$Result.GetResult<Prisma.$VisaVerificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more VisaVerifications.
     * @param {VisaVerificationDeleteManyArgs} args - Arguments to filter VisaVerifications to delete.
     * @example
     * // Delete a few VisaVerifications
     * const { count } = await prisma.visaVerification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VisaVerificationDeleteManyArgs>(args?: SelectSubset<T, VisaVerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VisaVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisaVerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VisaVerifications
     * const visaVerification = await prisma.visaVerification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VisaVerificationUpdateManyArgs>(args: SelectSubset<T, VisaVerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one VisaVerification.
     * @param {VisaVerificationUpsertArgs} args - Arguments to update or create a VisaVerification.
     * @example
     * // Update or create a VisaVerification
     * const visaVerification = await prisma.visaVerification.upsert({
     *   create: {
     *     // ... data to create a VisaVerification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VisaVerification we want to update
     *   }
     * })
     */
    upsert<T extends VisaVerificationUpsertArgs>(args: SelectSubset<T, VisaVerificationUpsertArgs<ExtArgs>>): Prisma__VisaVerificationClient<$Result.GetResult<Prisma.$VisaVerificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of VisaVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisaVerificationCountArgs} args - Arguments to filter VisaVerifications to count.
     * @example
     * // Count the number of VisaVerifications
     * const count = await prisma.visaVerification.count({
     *   where: {
     *     // ... the filter for the VisaVerifications we want to count
     *   }
     * })
    **/
    count<T extends VisaVerificationCountArgs>(
      args?: Subset<T, VisaVerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VisaVerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VisaVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisaVerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VisaVerificationAggregateArgs>(args: Subset<T, VisaVerificationAggregateArgs>): Prisma.PrismaPromise<GetVisaVerificationAggregateType<T>>

    /**
     * Group by VisaVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisaVerificationGroupByArgs} args - Group by arguments.
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
      T extends VisaVerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VisaVerificationGroupByArgs['orderBy'] }
        : { orderBy?: VisaVerificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VisaVerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVisaVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VisaVerification model
   */
  readonly fields: VisaVerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VisaVerification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VisaVerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the VisaVerification model
   */ 
  interface VisaVerificationFieldRefs {
    readonly id: FieldRef<"VisaVerification", 'String'>
    readonly userId: FieldRef<"VisaVerification", 'String'>
    readonly visaType: FieldRef<"VisaVerification", 'String'>
    readonly status: FieldRef<"VisaVerification", 'String'>
    readonly verifiedAt: FieldRef<"VisaVerification", 'DateTime'>
    readonly expiresAt: FieldRef<"VisaVerification", 'DateTime'>
    readonly eVerifyCase: FieldRef<"VisaVerification", 'String'>
    readonly eVerifyStatus: FieldRef<"VisaVerification", 'String'>
    readonly documentUrls: FieldRef<"VisaVerification", 'String'>
    readonly i94Number: FieldRef<"VisaVerification", 'String'>
    readonly sevisId: FieldRef<"VisaVerification", 'String'>
    readonly failureReason: FieldRef<"VisaVerification", 'String'>
    readonly metadata: FieldRef<"VisaVerification", 'String'>
    readonly createdAt: FieldRef<"VisaVerification", 'DateTime'>
    readonly updatedAt: FieldRef<"VisaVerification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VisaVerification findUnique
   */
  export type VisaVerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisaVerification
     */
    select?: VisaVerificationSelect<ExtArgs> | null
    /**
     * Filter, which VisaVerification to fetch.
     */
    where: VisaVerificationWhereUniqueInput
  }

  /**
   * VisaVerification findUniqueOrThrow
   */
  export type VisaVerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisaVerification
     */
    select?: VisaVerificationSelect<ExtArgs> | null
    /**
     * Filter, which VisaVerification to fetch.
     */
    where: VisaVerificationWhereUniqueInput
  }

  /**
   * VisaVerification findFirst
   */
  export type VisaVerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisaVerification
     */
    select?: VisaVerificationSelect<ExtArgs> | null
    /**
     * Filter, which VisaVerification to fetch.
     */
    where?: VisaVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisaVerifications to fetch.
     */
    orderBy?: VisaVerificationOrderByWithRelationInput | VisaVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VisaVerifications.
     */
    cursor?: VisaVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisaVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisaVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VisaVerifications.
     */
    distinct?: VisaVerificationScalarFieldEnum | VisaVerificationScalarFieldEnum[]
  }

  /**
   * VisaVerification findFirstOrThrow
   */
  export type VisaVerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisaVerification
     */
    select?: VisaVerificationSelect<ExtArgs> | null
    /**
     * Filter, which VisaVerification to fetch.
     */
    where?: VisaVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisaVerifications to fetch.
     */
    orderBy?: VisaVerificationOrderByWithRelationInput | VisaVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VisaVerifications.
     */
    cursor?: VisaVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisaVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisaVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VisaVerifications.
     */
    distinct?: VisaVerificationScalarFieldEnum | VisaVerificationScalarFieldEnum[]
  }

  /**
   * VisaVerification findMany
   */
  export type VisaVerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisaVerification
     */
    select?: VisaVerificationSelect<ExtArgs> | null
    /**
     * Filter, which VisaVerifications to fetch.
     */
    where?: VisaVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisaVerifications to fetch.
     */
    orderBy?: VisaVerificationOrderByWithRelationInput | VisaVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VisaVerifications.
     */
    cursor?: VisaVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisaVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisaVerifications.
     */
    skip?: number
    distinct?: VisaVerificationScalarFieldEnum | VisaVerificationScalarFieldEnum[]
  }

  /**
   * VisaVerification create
   */
  export type VisaVerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisaVerification
     */
    select?: VisaVerificationSelect<ExtArgs> | null
    /**
     * The data needed to create a VisaVerification.
     */
    data: XOR<VisaVerificationCreateInput, VisaVerificationUncheckedCreateInput>
  }

  /**
   * VisaVerification createMany
   */
  export type VisaVerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VisaVerifications.
     */
    data: VisaVerificationCreateManyInput | VisaVerificationCreateManyInput[]
  }

  /**
   * VisaVerification createManyAndReturn
   */
  export type VisaVerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisaVerification
     */
    select?: VisaVerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many VisaVerifications.
     */
    data: VisaVerificationCreateManyInput | VisaVerificationCreateManyInput[]
  }

  /**
   * VisaVerification update
   */
  export type VisaVerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisaVerification
     */
    select?: VisaVerificationSelect<ExtArgs> | null
    /**
     * The data needed to update a VisaVerification.
     */
    data: XOR<VisaVerificationUpdateInput, VisaVerificationUncheckedUpdateInput>
    /**
     * Choose, which VisaVerification to update.
     */
    where: VisaVerificationWhereUniqueInput
  }

  /**
   * VisaVerification updateMany
   */
  export type VisaVerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VisaVerifications.
     */
    data: XOR<VisaVerificationUpdateManyMutationInput, VisaVerificationUncheckedUpdateManyInput>
    /**
     * Filter which VisaVerifications to update
     */
    where?: VisaVerificationWhereInput
  }

  /**
   * VisaVerification upsert
   */
  export type VisaVerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisaVerification
     */
    select?: VisaVerificationSelect<ExtArgs> | null
    /**
     * The filter to search for the VisaVerification to update in case it exists.
     */
    where: VisaVerificationWhereUniqueInput
    /**
     * In case the VisaVerification found by the `where` argument doesn't exist, create a new VisaVerification with this data.
     */
    create: XOR<VisaVerificationCreateInput, VisaVerificationUncheckedCreateInput>
    /**
     * In case the VisaVerification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VisaVerificationUpdateInput, VisaVerificationUncheckedUpdateInput>
  }

  /**
   * VisaVerification delete
   */
  export type VisaVerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisaVerification
     */
    select?: VisaVerificationSelect<ExtArgs> | null
    /**
     * Filter which VisaVerification to delete.
     */
    where: VisaVerificationWhereUniqueInput
  }

  /**
   * VisaVerification deleteMany
   */
  export type VisaVerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VisaVerifications to delete
     */
    where?: VisaVerificationWhereInput
  }

  /**
   * VisaVerification without action
   */
  export type VisaVerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisaVerification
     */
    select?: VisaVerificationSelect<ExtArgs> | null
  }


  /**
   * Model LicenseVerification
   */

  export type AggregateLicenseVerification = {
    _count: LicenseVerificationCountAggregateOutputType | null
    _min: LicenseVerificationMinAggregateOutputType | null
    _max: LicenseVerificationMaxAggregateOutputType | null
  }

  export type LicenseVerificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    licenseType: string | null
    licenseNumber: string | null
    state: string | null
    status: string | null
    verifiedAt: Date | null
    expiresAt: Date | null
    issueDate: Date | null
    boardName: string | null
    disciplinaryActions: boolean | null
    failureReason: string | null
    metadata: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LicenseVerificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    licenseType: string | null
    licenseNumber: string | null
    state: string | null
    status: string | null
    verifiedAt: Date | null
    expiresAt: Date | null
    issueDate: Date | null
    boardName: string | null
    disciplinaryActions: boolean | null
    failureReason: string | null
    metadata: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LicenseVerificationCountAggregateOutputType = {
    id: number
    userId: number
    licenseType: number
    licenseNumber: number
    state: number
    status: number
    verifiedAt: number
    expiresAt: number
    issueDate: number
    boardName: number
    disciplinaryActions: number
    failureReason: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LicenseVerificationMinAggregateInputType = {
    id?: true
    userId?: true
    licenseType?: true
    licenseNumber?: true
    state?: true
    status?: true
    verifiedAt?: true
    expiresAt?: true
    issueDate?: true
    boardName?: true
    disciplinaryActions?: true
    failureReason?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LicenseVerificationMaxAggregateInputType = {
    id?: true
    userId?: true
    licenseType?: true
    licenseNumber?: true
    state?: true
    status?: true
    verifiedAt?: true
    expiresAt?: true
    issueDate?: true
    boardName?: true
    disciplinaryActions?: true
    failureReason?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LicenseVerificationCountAggregateInputType = {
    id?: true
    userId?: true
    licenseType?: true
    licenseNumber?: true
    state?: true
    status?: true
    verifiedAt?: true
    expiresAt?: true
    issueDate?: true
    boardName?: true
    disciplinaryActions?: true
    failureReason?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LicenseVerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LicenseVerification to aggregate.
     */
    where?: LicenseVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LicenseVerifications to fetch.
     */
    orderBy?: LicenseVerificationOrderByWithRelationInput | LicenseVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LicenseVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LicenseVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LicenseVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LicenseVerifications
    **/
    _count?: true | LicenseVerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LicenseVerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LicenseVerificationMaxAggregateInputType
  }

  export type GetLicenseVerificationAggregateType<T extends LicenseVerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateLicenseVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLicenseVerification[P]>
      : GetScalarType<T[P], AggregateLicenseVerification[P]>
  }




  export type LicenseVerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LicenseVerificationWhereInput
    orderBy?: LicenseVerificationOrderByWithAggregationInput | LicenseVerificationOrderByWithAggregationInput[]
    by: LicenseVerificationScalarFieldEnum[] | LicenseVerificationScalarFieldEnum
    having?: LicenseVerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LicenseVerificationCountAggregateInputType | true
    _min?: LicenseVerificationMinAggregateInputType
    _max?: LicenseVerificationMaxAggregateInputType
  }

  export type LicenseVerificationGroupByOutputType = {
    id: string
    userId: string
    licenseType: string
    licenseNumber: string
    state: string
    status: string
    verifiedAt: Date | null
    expiresAt: Date | null
    issueDate: Date | null
    boardName: string | null
    disciplinaryActions: boolean
    failureReason: string | null
    metadata: string | null
    createdAt: Date
    updatedAt: Date
    _count: LicenseVerificationCountAggregateOutputType | null
    _min: LicenseVerificationMinAggregateOutputType | null
    _max: LicenseVerificationMaxAggregateOutputType | null
  }

  type GetLicenseVerificationGroupByPayload<T extends LicenseVerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LicenseVerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LicenseVerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LicenseVerificationGroupByOutputType[P]>
            : GetScalarType<T[P], LicenseVerificationGroupByOutputType[P]>
        }
      >
    >


  export type LicenseVerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    licenseType?: boolean
    licenseNumber?: boolean
    state?: boolean
    status?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    issueDate?: boolean
    boardName?: boolean
    disciplinaryActions?: boolean
    failureReason?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["licenseVerification"]>

  export type LicenseVerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    licenseType?: boolean
    licenseNumber?: boolean
    state?: boolean
    status?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    issueDate?: boolean
    boardName?: boolean
    disciplinaryActions?: boolean
    failureReason?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["licenseVerification"]>

  export type LicenseVerificationSelectScalar = {
    id?: boolean
    userId?: boolean
    licenseType?: boolean
    licenseNumber?: boolean
    state?: boolean
    status?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    issueDate?: boolean
    boardName?: boolean
    disciplinaryActions?: boolean
    failureReason?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $LicenseVerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LicenseVerification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      licenseType: string
      licenseNumber: string
      state: string
      status: string
      verifiedAt: Date | null
      expiresAt: Date | null
      issueDate: Date | null
      boardName: string | null
      disciplinaryActions: boolean
      failureReason: string | null
      metadata: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["licenseVerification"]>
    composites: {}
  }

  type LicenseVerificationGetPayload<S extends boolean | null | undefined | LicenseVerificationDefaultArgs> = $Result.GetResult<Prisma.$LicenseVerificationPayload, S>

  type LicenseVerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LicenseVerificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LicenseVerificationCountAggregateInputType | true
    }

  export interface LicenseVerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LicenseVerification'], meta: { name: 'LicenseVerification' } }
    /**
     * Find zero or one LicenseVerification that matches the filter.
     * @param {LicenseVerificationFindUniqueArgs} args - Arguments to find a LicenseVerification
     * @example
     * // Get one LicenseVerification
     * const licenseVerification = await prisma.licenseVerification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LicenseVerificationFindUniqueArgs>(args: SelectSubset<T, LicenseVerificationFindUniqueArgs<ExtArgs>>): Prisma__LicenseVerificationClient<$Result.GetResult<Prisma.$LicenseVerificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one LicenseVerification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LicenseVerificationFindUniqueOrThrowArgs} args - Arguments to find a LicenseVerification
     * @example
     * // Get one LicenseVerification
     * const licenseVerification = await prisma.licenseVerification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LicenseVerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, LicenseVerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LicenseVerificationClient<$Result.GetResult<Prisma.$LicenseVerificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first LicenseVerification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LicenseVerificationFindFirstArgs} args - Arguments to find a LicenseVerification
     * @example
     * // Get one LicenseVerification
     * const licenseVerification = await prisma.licenseVerification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LicenseVerificationFindFirstArgs>(args?: SelectSubset<T, LicenseVerificationFindFirstArgs<ExtArgs>>): Prisma__LicenseVerificationClient<$Result.GetResult<Prisma.$LicenseVerificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first LicenseVerification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LicenseVerificationFindFirstOrThrowArgs} args - Arguments to find a LicenseVerification
     * @example
     * // Get one LicenseVerification
     * const licenseVerification = await prisma.licenseVerification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LicenseVerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, LicenseVerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__LicenseVerificationClient<$Result.GetResult<Prisma.$LicenseVerificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more LicenseVerifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LicenseVerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LicenseVerifications
     * const licenseVerifications = await prisma.licenseVerification.findMany()
     * 
     * // Get first 10 LicenseVerifications
     * const licenseVerifications = await prisma.licenseVerification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const licenseVerificationWithIdOnly = await prisma.licenseVerification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LicenseVerificationFindManyArgs>(args?: SelectSubset<T, LicenseVerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LicenseVerificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a LicenseVerification.
     * @param {LicenseVerificationCreateArgs} args - Arguments to create a LicenseVerification.
     * @example
     * // Create one LicenseVerification
     * const LicenseVerification = await prisma.licenseVerification.create({
     *   data: {
     *     // ... data to create a LicenseVerification
     *   }
     * })
     * 
     */
    create<T extends LicenseVerificationCreateArgs>(args: SelectSubset<T, LicenseVerificationCreateArgs<ExtArgs>>): Prisma__LicenseVerificationClient<$Result.GetResult<Prisma.$LicenseVerificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many LicenseVerifications.
     * @param {LicenseVerificationCreateManyArgs} args - Arguments to create many LicenseVerifications.
     * @example
     * // Create many LicenseVerifications
     * const licenseVerification = await prisma.licenseVerification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LicenseVerificationCreateManyArgs>(args?: SelectSubset<T, LicenseVerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LicenseVerifications and returns the data saved in the database.
     * @param {LicenseVerificationCreateManyAndReturnArgs} args - Arguments to create many LicenseVerifications.
     * @example
     * // Create many LicenseVerifications
     * const licenseVerification = await prisma.licenseVerification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LicenseVerifications and only return the `id`
     * const licenseVerificationWithIdOnly = await prisma.licenseVerification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LicenseVerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, LicenseVerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LicenseVerificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a LicenseVerification.
     * @param {LicenseVerificationDeleteArgs} args - Arguments to delete one LicenseVerification.
     * @example
     * // Delete one LicenseVerification
     * const LicenseVerification = await prisma.licenseVerification.delete({
     *   where: {
     *     // ... filter to delete one LicenseVerification
     *   }
     * })
     * 
     */
    delete<T extends LicenseVerificationDeleteArgs>(args: SelectSubset<T, LicenseVerificationDeleteArgs<ExtArgs>>): Prisma__LicenseVerificationClient<$Result.GetResult<Prisma.$LicenseVerificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one LicenseVerification.
     * @param {LicenseVerificationUpdateArgs} args - Arguments to update one LicenseVerification.
     * @example
     * // Update one LicenseVerification
     * const licenseVerification = await prisma.licenseVerification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LicenseVerificationUpdateArgs>(args: SelectSubset<T, LicenseVerificationUpdateArgs<ExtArgs>>): Prisma__LicenseVerificationClient<$Result.GetResult<Prisma.$LicenseVerificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more LicenseVerifications.
     * @param {LicenseVerificationDeleteManyArgs} args - Arguments to filter LicenseVerifications to delete.
     * @example
     * // Delete a few LicenseVerifications
     * const { count } = await prisma.licenseVerification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LicenseVerificationDeleteManyArgs>(args?: SelectSubset<T, LicenseVerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LicenseVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LicenseVerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LicenseVerifications
     * const licenseVerification = await prisma.licenseVerification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LicenseVerificationUpdateManyArgs>(args: SelectSubset<T, LicenseVerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LicenseVerification.
     * @param {LicenseVerificationUpsertArgs} args - Arguments to update or create a LicenseVerification.
     * @example
     * // Update or create a LicenseVerification
     * const licenseVerification = await prisma.licenseVerification.upsert({
     *   create: {
     *     // ... data to create a LicenseVerification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LicenseVerification we want to update
     *   }
     * })
     */
    upsert<T extends LicenseVerificationUpsertArgs>(args: SelectSubset<T, LicenseVerificationUpsertArgs<ExtArgs>>): Prisma__LicenseVerificationClient<$Result.GetResult<Prisma.$LicenseVerificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of LicenseVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LicenseVerificationCountArgs} args - Arguments to filter LicenseVerifications to count.
     * @example
     * // Count the number of LicenseVerifications
     * const count = await prisma.licenseVerification.count({
     *   where: {
     *     // ... the filter for the LicenseVerifications we want to count
     *   }
     * })
    **/
    count<T extends LicenseVerificationCountArgs>(
      args?: Subset<T, LicenseVerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LicenseVerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LicenseVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LicenseVerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LicenseVerificationAggregateArgs>(args: Subset<T, LicenseVerificationAggregateArgs>): Prisma.PrismaPromise<GetLicenseVerificationAggregateType<T>>

    /**
     * Group by LicenseVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LicenseVerificationGroupByArgs} args - Group by arguments.
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
      T extends LicenseVerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LicenseVerificationGroupByArgs['orderBy'] }
        : { orderBy?: LicenseVerificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LicenseVerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLicenseVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LicenseVerification model
   */
  readonly fields: LicenseVerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LicenseVerification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LicenseVerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the LicenseVerification model
   */ 
  interface LicenseVerificationFieldRefs {
    readonly id: FieldRef<"LicenseVerification", 'String'>
    readonly userId: FieldRef<"LicenseVerification", 'String'>
    readonly licenseType: FieldRef<"LicenseVerification", 'String'>
    readonly licenseNumber: FieldRef<"LicenseVerification", 'String'>
    readonly state: FieldRef<"LicenseVerification", 'String'>
    readonly status: FieldRef<"LicenseVerification", 'String'>
    readonly verifiedAt: FieldRef<"LicenseVerification", 'DateTime'>
    readonly expiresAt: FieldRef<"LicenseVerification", 'DateTime'>
    readonly issueDate: FieldRef<"LicenseVerification", 'DateTime'>
    readonly boardName: FieldRef<"LicenseVerification", 'String'>
    readonly disciplinaryActions: FieldRef<"LicenseVerification", 'Boolean'>
    readonly failureReason: FieldRef<"LicenseVerification", 'String'>
    readonly metadata: FieldRef<"LicenseVerification", 'String'>
    readonly createdAt: FieldRef<"LicenseVerification", 'DateTime'>
    readonly updatedAt: FieldRef<"LicenseVerification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LicenseVerification findUnique
   */
  export type LicenseVerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LicenseVerification
     */
    select?: LicenseVerificationSelect<ExtArgs> | null
    /**
     * Filter, which LicenseVerification to fetch.
     */
    where: LicenseVerificationWhereUniqueInput
  }

  /**
   * LicenseVerification findUniqueOrThrow
   */
  export type LicenseVerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LicenseVerification
     */
    select?: LicenseVerificationSelect<ExtArgs> | null
    /**
     * Filter, which LicenseVerification to fetch.
     */
    where: LicenseVerificationWhereUniqueInput
  }

  /**
   * LicenseVerification findFirst
   */
  export type LicenseVerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LicenseVerification
     */
    select?: LicenseVerificationSelect<ExtArgs> | null
    /**
     * Filter, which LicenseVerification to fetch.
     */
    where?: LicenseVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LicenseVerifications to fetch.
     */
    orderBy?: LicenseVerificationOrderByWithRelationInput | LicenseVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LicenseVerifications.
     */
    cursor?: LicenseVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LicenseVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LicenseVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LicenseVerifications.
     */
    distinct?: LicenseVerificationScalarFieldEnum | LicenseVerificationScalarFieldEnum[]
  }

  /**
   * LicenseVerification findFirstOrThrow
   */
  export type LicenseVerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LicenseVerification
     */
    select?: LicenseVerificationSelect<ExtArgs> | null
    /**
     * Filter, which LicenseVerification to fetch.
     */
    where?: LicenseVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LicenseVerifications to fetch.
     */
    orderBy?: LicenseVerificationOrderByWithRelationInput | LicenseVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LicenseVerifications.
     */
    cursor?: LicenseVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LicenseVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LicenseVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LicenseVerifications.
     */
    distinct?: LicenseVerificationScalarFieldEnum | LicenseVerificationScalarFieldEnum[]
  }

  /**
   * LicenseVerification findMany
   */
  export type LicenseVerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LicenseVerification
     */
    select?: LicenseVerificationSelect<ExtArgs> | null
    /**
     * Filter, which LicenseVerifications to fetch.
     */
    where?: LicenseVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LicenseVerifications to fetch.
     */
    orderBy?: LicenseVerificationOrderByWithRelationInput | LicenseVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LicenseVerifications.
     */
    cursor?: LicenseVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LicenseVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LicenseVerifications.
     */
    skip?: number
    distinct?: LicenseVerificationScalarFieldEnum | LicenseVerificationScalarFieldEnum[]
  }

  /**
   * LicenseVerification create
   */
  export type LicenseVerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LicenseVerification
     */
    select?: LicenseVerificationSelect<ExtArgs> | null
    /**
     * The data needed to create a LicenseVerification.
     */
    data: XOR<LicenseVerificationCreateInput, LicenseVerificationUncheckedCreateInput>
  }

  /**
   * LicenseVerification createMany
   */
  export type LicenseVerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LicenseVerifications.
     */
    data: LicenseVerificationCreateManyInput | LicenseVerificationCreateManyInput[]
  }

  /**
   * LicenseVerification createManyAndReturn
   */
  export type LicenseVerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LicenseVerification
     */
    select?: LicenseVerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many LicenseVerifications.
     */
    data: LicenseVerificationCreateManyInput | LicenseVerificationCreateManyInput[]
  }

  /**
   * LicenseVerification update
   */
  export type LicenseVerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LicenseVerification
     */
    select?: LicenseVerificationSelect<ExtArgs> | null
    /**
     * The data needed to update a LicenseVerification.
     */
    data: XOR<LicenseVerificationUpdateInput, LicenseVerificationUncheckedUpdateInput>
    /**
     * Choose, which LicenseVerification to update.
     */
    where: LicenseVerificationWhereUniqueInput
  }

  /**
   * LicenseVerification updateMany
   */
  export type LicenseVerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LicenseVerifications.
     */
    data: XOR<LicenseVerificationUpdateManyMutationInput, LicenseVerificationUncheckedUpdateManyInput>
    /**
     * Filter which LicenseVerifications to update
     */
    where?: LicenseVerificationWhereInput
  }

  /**
   * LicenseVerification upsert
   */
  export type LicenseVerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LicenseVerification
     */
    select?: LicenseVerificationSelect<ExtArgs> | null
    /**
     * The filter to search for the LicenseVerification to update in case it exists.
     */
    where: LicenseVerificationWhereUniqueInput
    /**
     * In case the LicenseVerification found by the `where` argument doesn't exist, create a new LicenseVerification with this data.
     */
    create: XOR<LicenseVerificationCreateInput, LicenseVerificationUncheckedCreateInput>
    /**
     * In case the LicenseVerification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LicenseVerificationUpdateInput, LicenseVerificationUncheckedUpdateInput>
  }

  /**
   * LicenseVerification delete
   */
  export type LicenseVerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LicenseVerification
     */
    select?: LicenseVerificationSelect<ExtArgs> | null
    /**
     * Filter which LicenseVerification to delete.
     */
    where: LicenseVerificationWhereUniqueInput
  }

  /**
   * LicenseVerification deleteMany
   */
  export type LicenseVerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LicenseVerifications to delete
     */
    where?: LicenseVerificationWhereInput
  }

  /**
   * LicenseVerification without action
   */
  export type LicenseVerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LicenseVerification
     */
    select?: LicenseVerificationSelect<ExtArgs> | null
  }


  /**
   * Model VerificationAuditLog
   */

  export type AggregateVerificationAuditLog = {
    _count: VerificationAuditLogCountAggregateOutputType | null
    _min: VerificationAuditLogMinAggregateOutputType | null
    _max: VerificationAuditLogMaxAggregateOutputType | null
  }

  export type VerificationAuditLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    verificationType: string | null
    action: string | null
    performedBy: string | null
    previousStatus: string | null
    newStatus: string | null
    reason: string | null
    metadata: string | null
    createdAt: Date | null
  }

  export type VerificationAuditLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    verificationType: string | null
    action: string | null
    performedBy: string | null
    previousStatus: string | null
    newStatus: string | null
    reason: string | null
    metadata: string | null
    createdAt: Date | null
  }

  export type VerificationAuditLogCountAggregateOutputType = {
    id: number
    userId: number
    verificationType: number
    action: number
    performedBy: number
    previousStatus: number
    newStatus: number
    reason: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type VerificationAuditLogMinAggregateInputType = {
    id?: true
    userId?: true
    verificationType?: true
    action?: true
    performedBy?: true
    previousStatus?: true
    newStatus?: true
    reason?: true
    metadata?: true
    createdAt?: true
  }

  export type VerificationAuditLogMaxAggregateInputType = {
    id?: true
    userId?: true
    verificationType?: true
    action?: true
    performedBy?: true
    previousStatus?: true
    newStatus?: true
    reason?: true
    metadata?: true
    createdAt?: true
  }

  export type VerificationAuditLogCountAggregateInputType = {
    id?: true
    userId?: true
    verificationType?: true
    action?: true
    performedBy?: true
    previousStatus?: true
    newStatus?: true
    reason?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type VerificationAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationAuditLog to aggregate.
     */
    where?: VerificationAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationAuditLogs to fetch.
     */
    orderBy?: VerificationAuditLogOrderByWithRelationInput | VerificationAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationAuditLogs
    **/
    _count?: true | VerificationAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationAuditLogMaxAggregateInputType
  }

  export type GetVerificationAuditLogAggregateType<T extends VerificationAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationAuditLog[P]>
      : GetScalarType<T[P], AggregateVerificationAuditLog[P]>
  }




  export type VerificationAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationAuditLogWhereInput
    orderBy?: VerificationAuditLogOrderByWithAggregationInput | VerificationAuditLogOrderByWithAggregationInput[]
    by: VerificationAuditLogScalarFieldEnum[] | VerificationAuditLogScalarFieldEnum
    having?: VerificationAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationAuditLogCountAggregateInputType | true
    _min?: VerificationAuditLogMinAggregateInputType
    _max?: VerificationAuditLogMaxAggregateInputType
  }

  export type VerificationAuditLogGroupByOutputType = {
    id: string
    userId: string
    verificationType: string
    action: string
    performedBy: string | null
    previousStatus: string | null
    newStatus: string
    reason: string | null
    metadata: string | null
    createdAt: Date
    _count: VerificationAuditLogCountAggregateOutputType | null
    _min: VerificationAuditLogMinAggregateOutputType | null
    _max: VerificationAuditLogMaxAggregateOutputType | null
  }

  type GetVerificationAuditLogGroupByPayload<T extends VerificationAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type VerificationAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    verificationType?: boolean
    action?: boolean
    performedBy?: boolean
    previousStatus?: boolean
    newStatus?: boolean
    reason?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["verificationAuditLog"]>

  export type VerificationAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    verificationType?: boolean
    action?: boolean
    performedBy?: boolean
    previousStatus?: boolean
    newStatus?: boolean
    reason?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["verificationAuditLog"]>

  export type VerificationAuditLogSelectScalar = {
    id?: boolean
    userId?: boolean
    verificationType?: boolean
    action?: boolean
    performedBy?: boolean
    previousStatus?: boolean
    newStatus?: boolean
    reason?: boolean
    metadata?: boolean
    createdAt?: boolean
  }


  export type $VerificationAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationAuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      verificationType: string
      action: string
      performedBy: string | null
      previousStatus: string | null
      newStatus: string
      reason: string | null
      metadata: string | null
      createdAt: Date
    }, ExtArgs["result"]["verificationAuditLog"]>
    composites: {}
  }

  type VerificationAuditLogGetPayload<S extends boolean | null | undefined | VerificationAuditLogDefaultArgs> = $Result.GetResult<Prisma.$VerificationAuditLogPayload, S>

  type VerificationAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VerificationAuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VerificationAuditLogCountAggregateInputType | true
    }

  export interface VerificationAuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationAuditLog'], meta: { name: 'VerificationAuditLog' } }
    /**
     * Find zero or one VerificationAuditLog that matches the filter.
     * @param {VerificationAuditLogFindUniqueArgs} args - Arguments to find a VerificationAuditLog
     * @example
     * // Get one VerificationAuditLog
     * const verificationAuditLog = await prisma.verificationAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationAuditLogFindUniqueArgs>(args: SelectSubset<T, VerificationAuditLogFindUniqueArgs<ExtArgs>>): Prisma__VerificationAuditLogClient<$Result.GetResult<Prisma.$VerificationAuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one VerificationAuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VerificationAuditLogFindUniqueOrThrowArgs} args - Arguments to find a VerificationAuditLog
     * @example
     * // Get one VerificationAuditLog
     * const verificationAuditLog = await prisma.verificationAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationAuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationAuditLogClient<$Result.GetResult<Prisma.$VerificationAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first VerificationAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAuditLogFindFirstArgs} args - Arguments to find a VerificationAuditLog
     * @example
     * // Get one VerificationAuditLog
     * const verificationAuditLog = await prisma.verificationAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationAuditLogFindFirstArgs>(args?: SelectSubset<T, VerificationAuditLogFindFirstArgs<ExtArgs>>): Prisma__VerificationAuditLogClient<$Result.GetResult<Prisma.$VerificationAuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first VerificationAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAuditLogFindFirstOrThrowArgs} args - Arguments to find a VerificationAuditLog
     * @example
     * // Get one VerificationAuditLog
     * const verificationAuditLog = await prisma.verificationAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationAuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationAuditLogClient<$Result.GetResult<Prisma.$VerificationAuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more VerificationAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationAuditLogs
     * const verificationAuditLogs = await prisma.verificationAuditLog.findMany()
     * 
     * // Get first 10 VerificationAuditLogs
     * const verificationAuditLogs = await prisma.verificationAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationAuditLogWithIdOnly = await prisma.verificationAuditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationAuditLogFindManyArgs>(args?: SelectSubset<T, VerificationAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationAuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a VerificationAuditLog.
     * @param {VerificationAuditLogCreateArgs} args - Arguments to create a VerificationAuditLog.
     * @example
     * // Create one VerificationAuditLog
     * const VerificationAuditLog = await prisma.verificationAuditLog.create({
     *   data: {
     *     // ... data to create a VerificationAuditLog
     *   }
     * })
     * 
     */
    create<T extends VerificationAuditLogCreateArgs>(args: SelectSubset<T, VerificationAuditLogCreateArgs<ExtArgs>>): Prisma__VerificationAuditLogClient<$Result.GetResult<Prisma.$VerificationAuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many VerificationAuditLogs.
     * @param {VerificationAuditLogCreateManyArgs} args - Arguments to create many VerificationAuditLogs.
     * @example
     * // Create many VerificationAuditLogs
     * const verificationAuditLog = await prisma.verificationAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationAuditLogCreateManyArgs>(args?: SelectSubset<T, VerificationAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationAuditLogs and returns the data saved in the database.
     * @param {VerificationAuditLogCreateManyAndReturnArgs} args - Arguments to create many VerificationAuditLogs.
     * @example
     * // Create many VerificationAuditLogs
     * const verificationAuditLog = await prisma.verificationAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationAuditLogs and only return the `id`
     * const verificationAuditLogWithIdOnly = await prisma.verificationAuditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationAuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationAuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a VerificationAuditLog.
     * @param {VerificationAuditLogDeleteArgs} args - Arguments to delete one VerificationAuditLog.
     * @example
     * // Delete one VerificationAuditLog
     * const VerificationAuditLog = await prisma.verificationAuditLog.delete({
     *   where: {
     *     // ... filter to delete one VerificationAuditLog
     *   }
     * })
     * 
     */
    delete<T extends VerificationAuditLogDeleteArgs>(args: SelectSubset<T, VerificationAuditLogDeleteArgs<ExtArgs>>): Prisma__VerificationAuditLogClient<$Result.GetResult<Prisma.$VerificationAuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one VerificationAuditLog.
     * @param {VerificationAuditLogUpdateArgs} args - Arguments to update one VerificationAuditLog.
     * @example
     * // Update one VerificationAuditLog
     * const verificationAuditLog = await prisma.verificationAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationAuditLogUpdateArgs>(args: SelectSubset<T, VerificationAuditLogUpdateArgs<ExtArgs>>): Prisma__VerificationAuditLogClient<$Result.GetResult<Prisma.$VerificationAuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more VerificationAuditLogs.
     * @param {VerificationAuditLogDeleteManyArgs} args - Arguments to filter VerificationAuditLogs to delete.
     * @example
     * // Delete a few VerificationAuditLogs
     * const { count } = await prisma.verificationAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationAuditLogDeleteManyArgs>(args?: SelectSubset<T, VerificationAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationAuditLogs
     * const verificationAuditLog = await prisma.verificationAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationAuditLogUpdateManyArgs>(args: SelectSubset<T, VerificationAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one VerificationAuditLog.
     * @param {VerificationAuditLogUpsertArgs} args - Arguments to update or create a VerificationAuditLog.
     * @example
     * // Update or create a VerificationAuditLog
     * const verificationAuditLog = await prisma.verificationAuditLog.upsert({
     *   create: {
     *     // ... data to create a VerificationAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends VerificationAuditLogUpsertArgs>(args: SelectSubset<T, VerificationAuditLogUpsertArgs<ExtArgs>>): Prisma__VerificationAuditLogClient<$Result.GetResult<Prisma.$VerificationAuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of VerificationAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAuditLogCountArgs} args - Arguments to filter VerificationAuditLogs to count.
     * @example
     * // Count the number of VerificationAuditLogs
     * const count = await prisma.verificationAuditLog.count({
     *   where: {
     *     // ... the filter for the VerificationAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends VerificationAuditLogCountArgs>(
      args?: Subset<T, VerificationAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VerificationAuditLogAggregateArgs>(args: Subset<T, VerificationAuditLogAggregateArgs>): Prisma.PrismaPromise<GetVerificationAuditLogAggregateType<T>>

    /**
     * Group by VerificationAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAuditLogGroupByArgs} args - Group by arguments.
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
      T extends VerificationAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: VerificationAuditLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VerificationAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationAuditLog model
   */
  readonly fields: VerificationAuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationAuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the VerificationAuditLog model
   */ 
  interface VerificationAuditLogFieldRefs {
    readonly id: FieldRef<"VerificationAuditLog", 'String'>
    readonly userId: FieldRef<"VerificationAuditLog", 'String'>
    readonly verificationType: FieldRef<"VerificationAuditLog", 'String'>
    readonly action: FieldRef<"VerificationAuditLog", 'String'>
    readonly performedBy: FieldRef<"VerificationAuditLog", 'String'>
    readonly previousStatus: FieldRef<"VerificationAuditLog", 'String'>
    readonly newStatus: FieldRef<"VerificationAuditLog", 'String'>
    readonly reason: FieldRef<"VerificationAuditLog", 'String'>
    readonly metadata: FieldRef<"VerificationAuditLog", 'String'>
    readonly createdAt: FieldRef<"VerificationAuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationAuditLog findUnique
   */
  export type VerificationAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationAuditLog
     */
    select?: VerificationAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which VerificationAuditLog to fetch.
     */
    where: VerificationAuditLogWhereUniqueInput
  }

  /**
   * VerificationAuditLog findUniqueOrThrow
   */
  export type VerificationAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationAuditLog
     */
    select?: VerificationAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which VerificationAuditLog to fetch.
     */
    where: VerificationAuditLogWhereUniqueInput
  }

  /**
   * VerificationAuditLog findFirst
   */
  export type VerificationAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationAuditLog
     */
    select?: VerificationAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which VerificationAuditLog to fetch.
     */
    where?: VerificationAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationAuditLogs to fetch.
     */
    orderBy?: VerificationAuditLogOrderByWithRelationInput | VerificationAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationAuditLogs.
     */
    cursor?: VerificationAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationAuditLogs.
     */
    distinct?: VerificationAuditLogScalarFieldEnum | VerificationAuditLogScalarFieldEnum[]
  }

  /**
   * VerificationAuditLog findFirstOrThrow
   */
  export type VerificationAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationAuditLog
     */
    select?: VerificationAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which VerificationAuditLog to fetch.
     */
    where?: VerificationAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationAuditLogs to fetch.
     */
    orderBy?: VerificationAuditLogOrderByWithRelationInput | VerificationAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationAuditLogs.
     */
    cursor?: VerificationAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationAuditLogs.
     */
    distinct?: VerificationAuditLogScalarFieldEnum | VerificationAuditLogScalarFieldEnum[]
  }

  /**
   * VerificationAuditLog findMany
   */
  export type VerificationAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationAuditLog
     */
    select?: VerificationAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which VerificationAuditLogs to fetch.
     */
    where?: VerificationAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationAuditLogs to fetch.
     */
    orderBy?: VerificationAuditLogOrderByWithRelationInput | VerificationAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationAuditLogs.
     */
    cursor?: VerificationAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationAuditLogs.
     */
    skip?: number
    distinct?: VerificationAuditLogScalarFieldEnum | VerificationAuditLogScalarFieldEnum[]
  }

  /**
   * VerificationAuditLog create
   */
  export type VerificationAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationAuditLog
     */
    select?: VerificationAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to create a VerificationAuditLog.
     */
    data: XOR<VerificationAuditLogCreateInput, VerificationAuditLogUncheckedCreateInput>
  }

  /**
   * VerificationAuditLog createMany
   */
  export type VerificationAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationAuditLogs.
     */
    data: VerificationAuditLogCreateManyInput | VerificationAuditLogCreateManyInput[]
  }

  /**
   * VerificationAuditLog createManyAndReturn
   */
  export type VerificationAuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationAuditLog
     */
    select?: VerificationAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many VerificationAuditLogs.
     */
    data: VerificationAuditLogCreateManyInput | VerificationAuditLogCreateManyInput[]
  }

  /**
   * VerificationAuditLog update
   */
  export type VerificationAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationAuditLog
     */
    select?: VerificationAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to update a VerificationAuditLog.
     */
    data: XOR<VerificationAuditLogUpdateInput, VerificationAuditLogUncheckedUpdateInput>
    /**
     * Choose, which VerificationAuditLog to update.
     */
    where: VerificationAuditLogWhereUniqueInput
  }

  /**
   * VerificationAuditLog updateMany
   */
  export type VerificationAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationAuditLogs.
     */
    data: XOR<VerificationAuditLogUpdateManyMutationInput, VerificationAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which VerificationAuditLogs to update
     */
    where?: VerificationAuditLogWhereInput
  }

  /**
   * VerificationAuditLog upsert
   */
  export type VerificationAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationAuditLog
     */
    select?: VerificationAuditLogSelect<ExtArgs> | null
    /**
     * The filter to search for the VerificationAuditLog to update in case it exists.
     */
    where: VerificationAuditLogWhereUniqueInput
    /**
     * In case the VerificationAuditLog found by the `where` argument doesn't exist, create a new VerificationAuditLog with this data.
     */
    create: XOR<VerificationAuditLogCreateInput, VerificationAuditLogUncheckedCreateInput>
    /**
     * In case the VerificationAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationAuditLogUpdateInput, VerificationAuditLogUncheckedUpdateInput>
  }

  /**
   * VerificationAuditLog delete
   */
  export type VerificationAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationAuditLog
     */
    select?: VerificationAuditLogSelect<ExtArgs> | null
    /**
     * Filter which VerificationAuditLog to delete.
     */
    where: VerificationAuditLogWhereUniqueInput
  }

  /**
   * VerificationAuditLog deleteMany
   */
  export type VerificationAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationAuditLogs to delete
     */
    where?: VerificationAuditLogWhereInput
  }

  /**
   * VerificationAuditLog without action
   */
  export type VerificationAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationAuditLog
     */
    select?: VerificationAuditLogSelect<ExtArgs> | null
  }


  /**
   * Model Verification
   */

  export type AggregateVerification = {
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  export type VerificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    status: string | null
    provider: string | null
    providerRef: string | null
    verifiedAt: Date | null
    expiresAt: Date | null
    metadata: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    status: string | null
    provider: string | null
    providerRef: string | null
    verifiedAt: Date | null
    expiresAt: Date | null
    metadata: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    status: number
    provider: number
    providerRef: number
    verifiedAt: number
    expiresAt: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VerificationMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    status?: true
    provider?: true
    providerRef?: true
    verifiedAt?: true
    expiresAt?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    status?: true
    provider?: true
    providerRef?: true
    verifiedAt?: true
    expiresAt?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    status?: true
    provider?: true
    providerRef?: true
    verifiedAt?: true
    expiresAt?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verification to aggregate.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Verifications
    **/
    _count?: true | VerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationMaxAggregateInputType
  }

  export type GetVerificationAggregateType<T extends VerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerification[P]>
      : GetScalarType<T[P], AggregateVerification[P]>
  }




  export type VerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationWhereInput
    orderBy?: VerificationOrderByWithAggregationInput | VerificationOrderByWithAggregationInput[]
    by: VerificationScalarFieldEnum[] | VerificationScalarFieldEnum
    having?: VerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationCountAggregateInputType | true
    _min?: VerificationMinAggregateInputType
    _max?: VerificationMaxAggregateInputType
  }

  export type VerificationGroupByOutputType = {
    id: string
    userId: string
    type: string
    status: string
    provider: string | null
    providerRef: string | null
    verifiedAt: Date | null
    expiresAt: Date | null
    metadata: string | null
    createdAt: Date
    updatedAt: Date
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  type GetVerificationGroupByPayload<T extends VerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationGroupByOutputType[P]>
        }
      >
    >


  export type VerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    status?: boolean
    provider?: boolean
    providerRef?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    status?: boolean
    provider?: boolean
    providerRef?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    status?: boolean
    provider?: boolean
    providerRef?: boolean
    verifiedAt?: boolean
    expiresAt?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $VerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Verification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      status: string
      provider: string | null
      providerRef: string | null
      verifiedAt: Date | null
      expiresAt: Date | null
      metadata: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["verification"]>
    composites: {}
  }

  type VerificationGetPayload<S extends boolean | null | undefined | VerificationDefaultArgs> = $Result.GetResult<Prisma.$VerificationPayload, S>

  type VerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VerificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VerificationCountAggregateInputType | true
    }

  export interface VerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Verification'], meta: { name: 'Verification' } }
    /**
     * Find zero or one Verification that matches the filter.
     * @param {VerificationFindUniqueArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationFindUniqueArgs>(args: SelectSubset<T, VerificationFindUniqueArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Verification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VerificationFindUniqueOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Verification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationFindFirstArgs>(args?: SelectSubset<T, VerificationFindFirstArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Verification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verifications
     * const verifications = await prisma.verification.findMany()
     * 
     * // Get first 10 Verifications
     * const verifications = await prisma.verification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationWithIdOnly = await prisma.verification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationFindManyArgs>(args?: SelectSubset<T, VerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Verification.
     * @param {VerificationCreateArgs} args - Arguments to create a Verification.
     * @example
     * // Create one Verification
     * const Verification = await prisma.verification.create({
     *   data: {
     *     // ... data to create a Verification
     *   }
     * })
     * 
     */
    create<T extends VerificationCreateArgs>(args: SelectSubset<T, VerificationCreateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Verifications.
     * @param {VerificationCreateManyArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationCreateManyArgs>(args?: SelectSubset<T, VerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Verifications and returns the data saved in the database.
     * @param {VerificationCreateManyAndReturnArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Verification.
     * @param {VerificationDeleteArgs} args - Arguments to delete one Verification.
     * @example
     * // Delete one Verification
     * const Verification = await prisma.verification.delete({
     *   where: {
     *     // ... filter to delete one Verification
     *   }
     * })
     * 
     */
    delete<T extends VerificationDeleteArgs>(args: SelectSubset<T, VerificationDeleteArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Verification.
     * @param {VerificationUpdateArgs} args - Arguments to update one Verification.
     * @example
     * // Update one Verification
     * const verification = await prisma.verification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationUpdateArgs>(args: SelectSubset<T, VerificationUpdateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Verifications.
     * @param {VerificationDeleteManyArgs} args - Arguments to filter Verifications to delete.
     * @example
     * // Delete a few Verifications
     * const { count } = await prisma.verification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationDeleteManyArgs>(args?: SelectSubset<T, VerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationUpdateManyArgs>(args: SelectSubset<T, VerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Verification.
     * @param {VerificationUpsertArgs} args - Arguments to update or create a Verification.
     * @example
     * // Update or create a Verification
     * const verification = await prisma.verification.upsert({
     *   create: {
     *     // ... data to create a Verification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verification we want to update
     *   }
     * })
     */
    upsert<T extends VerificationUpsertArgs>(args: SelectSubset<T, VerificationUpsertArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCountArgs} args - Arguments to filter Verifications to count.
     * @example
     * // Count the number of Verifications
     * const count = await prisma.verification.count({
     *   where: {
     *     // ... the filter for the Verifications we want to count
     *   }
     * })
    **/
    count<T extends VerificationCountArgs>(
      args?: Subset<T, VerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VerificationAggregateArgs>(args: Subset<T, VerificationAggregateArgs>): Prisma.PrismaPromise<GetVerificationAggregateType<T>>

    /**
     * Group by Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationGroupByArgs} args - Group by arguments.
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
      T extends VerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationGroupByArgs['orderBy'] }
        : { orderBy?: VerificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Verification model
   */
  readonly fields: VerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Verification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the Verification model
   */ 
  interface VerificationFieldRefs {
    readonly id: FieldRef<"Verification", 'String'>
    readonly userId: FieldRef<"Verification", 'String'>
    readonly type: FieldRef<"Verification", 'String'>
    readonly status: FieldRef<"Verification", 'String'>
    readonly provider: FieldRef<"Verification", 'String'>
    readonly providerRef: FieldRef<"Verification", 'String'>
    readonly verifiedAt: FieldRef<"Verification", 'DateTime'>
    readonly expiresAt: FieldRef<"Verification", 'DateTime'>
    readonly metadata: FieldRef<"Verification", 'String'>
    readonly createdAt: FieldRef<"Verification", 'DateTime'>
    readonly updatedAt: FieldRef<"Verification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Verification findUnique
   */
  export type VerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findUniqueOrThrow
   */
  export type VerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findFirst
   */
  export type VerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findFirstOrThrow
   */
  export type VerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findMany
   */
  export type VerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Filter, which Verifications to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification create
   */
  export type VerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * The data needed to create a Verification.
     */
    data: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
  }

  /**
   * Verification createMany
   */
  export type VerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
  }

  /**
   * Verification createManyAndReturn
   */
  export type VerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
  }

  /**
   * Verification update
   */
  export type VerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * The data needed to update a Verification.
     */
    data: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
    /**
     * Choose, which Verification to update.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification updateMany
   */
  export type VerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
  }

  /**
   * Verification upsert
   */
  export type VerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * The filter to search for the Verification to update in case it exists.
     */
    where: VerificationWhereUniqueInput
    /**
     * In case the Verification found by the `where` argument doesn't exist, create a new Verification with this data.
     */
    create: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
    /**
     * In case the Verification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
  }

  /**
   * Verification delete
   */
  export type VerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Filter which Verification to delete.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification deleteMany
   */
  export type VerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verifications to delete
     */
    where?: VerificationWhereInput
  }

  /**
   * Verification without action
   */
  export type VerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const IdentityVerificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    status: 'status',
    provider: 'provider',
    personaInquiryId: 'personaInquiryId',
    documentType: 'documentType',
    documentNumber: 'documentNumber',
    verifiedAt: 'verifiedAt',
    expiresAt: 'expiresAt',
    failureReason: 'failureReason',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type IdentityVerificationScalarFieldEnum = (typeof IdentityVerificationScalarFieldEnum)[keyof typeof IdentityVerificationScalarFieldEnum]


  export const BackgroundCheckScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    status: 'status',
    provider: 'provider',
    checkrReportId: 'checkrReportId',
    package: 'package',
    result: 'result',
    completedAt: 'completedAt',
    expiresAt: 'expiresAt',
    consentGivenAt: 'consentGivenAt',
    criminalRecords: 'criminalRecords',
    sexOffenderRegistry: 'sexOffenderRegistry',
    globalWatchlist: 'globalWatchlist',
    ssnTrace: 'ssnTrace',
    failureReason: 'failureReason',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BackgroundCheckScalarFieldEnum = (typeof BackgroundCheckScalarFieldEnum)[keyof typeof BackgroundCheckScalarFieldEnum]


  export const VisaVerificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    visaType: 'visaType',
    status: 'status',
    verifiedAt: 'verifiedAt',
    expiresAt: 'expiresAt',
    eVerifyCase: 'eVerifyCase',
    eVerifyStatus: 'eVerifyStatus',
    documentUrls: 'documentUrls',
    i94Number: 'i94Number',
    sevisId: 'sevisId',
    failureReason: 'failureReason',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VisaVerificationScalarFieldEnum = (typeof VisaVerificationScalarFieldEnum)[keyof typeof VisaVerificationScalarFieldEnum]


  export const LicenseVerificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    licenseType: 'licenseType',
    licenseNumber: 'licenseNumber',
    state: 'state',
    status: 'status',
    verifiedAt: 'verifiedAt',
    expiresAt: 'expiresAt',
    issueDate: 'issueDate',
    boardName: 'boardName',
    disciplinaryActions: 'disciplinaryActions',
    failureReason: 'failureReason',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LicenseVerificationScalarFieldEnum = (typeof LicenseVerificationScalarFieldEnum)[keyof typeof LicenseVerificationScalarFieldEnum]


  export const VerificationAuditLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    verificationType: 'verificationType',
    action: 'action',
    performedBy: 'performedBy',
    previousStatus: 'previousStatus',
    newStatus: 'newStatus',
    reason: 'reason',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type VerificationAuditLogScalarFieldEnum = (typeof VerificationAuditLogScalarFieldEnum)[keyof typeof VerificationAuditLogScalarFieldEnum]


  export const VerificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    status: 'status',
    provider: 'provider',
    providerRef: 'providerRef',
    verifiedAt: 'verifiedAt',
    expiresAt: 'expiresAt',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type IdentityVerificationWhereInput = {
    AND?: IdentityVerificationWhereInput | IdentityVerificationWhereInput[]
    OR?: IdentityVerificationWhereInput[]
    NOT?: IdentityVerificationWhereInput | IdentityVerificationWhereInput[]
    id?: StringFilter<"IdentityVerification"> | string
    userId?: StringFilter<"IdentityVerification"> | string
    status?: StringFilter<"IdentityVerification"> | string
    provider?: StringFilter<"IdentityVerification"> | string
    personaInquiryId?: StringNullableFilter<"IdentityVerification"> | string | null
    documentType?: StringNullableFilter<"IdentityVerification"> | string | null
    documentNumber?: StringNullableFilter<"IdentityVerification"> | string | null
    verifiedAt?: DateTimeNullableFilter<"IdentityVerification"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"IdentityVerification"> | Date | string | null
    failureReason?: StringNullableFilter<"IdentityVerification"> | string | null
    metadata?: StringNullableFilter<"IdentityVerification"> | string | null
    createdAt?: DateTimeFilter<"IdentityVerification"> | Date | string
    updatedAt?: DateTimeFilter<"IdentityVerification"> | Date | string
  }

  export type IdentityVerificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    personaInquiryId?: SortOrderInput | SortOrder
    documentType?: SortOrderInput | SortOrder
    documentNumber?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IdentityVerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    personaInquiryId?: string
    AND?: IdentityVerificationWhereInput | IdentityVerificationWhereInput[]
    OR?: IdentityVerificationWhereInput[]
    NOT?: IdentityVerificationWhereInput | IdentityVerificationWhereInput[]
    userId?: StringFilter<"IdentityVerification"> | string
    status?: StringFilter<"IdentityVerification"> | string
    provider?: StringFilter<"IdentityVerification"> | string
    documentType?: StringNullableFilter<"IdentityVerification"> | string | null
    documentNumber?: StringNullableFilter<"IdentityVerification"> | string | null
    verifiedAt?: DateTimeNullableFilter<"IdentityVerification"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"IdentityVerification"> | Date | string | null
    failureReason?: StringNullableFilter<"IdentityVerification"> | string | null
    metadata?: StringNullableFilter<"IdentityVerification"> | string | null
    createdAt?: DateTimeFilter<"IdentityVerification"> | Date | string
    updatedAt?: DateTimeFilter<"IdentityVerification"> | Date | string
  }, "id" | "personaInquiryId">

  export type IdentityVerificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    personaInquiryId?: SortOrderInput | SortOrder
    documentType?: SortOrderInput | SortOrder
    documentNumber?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: IdentityVerificationCountOrderByAggregateInput
    _max?: IdentityVerificationMaxOrderByAggregateInput
    _min?: IdentityVerificationMinOrderByAggregateInput
  }

  export type IdentityVerificationScalarWhereWithAggregatesInput = {
    AND?: IdentityVerificationScalarWhereWithAggregatesInput | IdentityVerificationScalarWhereWithAggregatesInput[]
    OR?: IdentityVerificationScalarWhereWithAggregatesInput[]
    NOT?: IdentityVerificationScalarWhereWithAggregatesInput | IdentityVerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"IdentityVerification"> | string
    userId?: StringWithAggregatesFilter<"IdentityVerification"> | string
    status?: StringWithAggregatesFilter<"IdentityVerification"> | string
    provider?: StringWithAggregatesFilter<"IdentityVerification"> | string
    personaInquiryId?: StringNullableWithAggregatesFilter<"IdentityVerification"> | string | null
    documentType?: StringNullableWithAggregatesFilter<"IdentityVerification"> | string | null
    documentNumber?: StringNullableWithAggregatesFilter<"IdentityVerification"> | string | null
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"IdentityVerification"> | Date | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"IdentityVerification"> | Date | string | null
    failureReason?: StringNullableWithAggregatesFilter<"IdentityVerification"> | string | null
    metadata?: StringNullableWithAggregatesFilter<"IdentityVerification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"IdentityVerification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"IdentityVerification"> | Date | string
  }

  export type BackgroundCheckWhereInput = {
    AND?: BackgroundCheckWhereInput | BackgroundCheckWhereInput[]
    OR?: BackgroundCheckWhereInput[]
    NOT?: BackgroundCheckWhereInput | BackgroundCheckWhereInput[]
    id?: StringFilter<"BackgroundCheck"> | string
    userId?: StringFilter<"BackgroundCheck"> | string
    status?: StringFilter<"BackgroundCheck"> | string
    provider?: StringFilter<"BackgroundCheck"> | string
    checkrReportId?: StringNullableFilter<"BackgroundCheck"> | string | null
    package?: StringNullableFilter<"BackgroundCheck"> | string | null
    result?: StringNullableFilter<"BackgroundCheck"> | string | null
    completedAt?: DateTimeNullableFilter<"BackgroundCheck"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"BackgroundCheck"> | Date | string | null
    consentGivenAt?: DateTimeNullableFilter<"BackgroundCheck"> | Date | string | null
    criminalRecords?: BoolNullableFilter<"BackgroundCheck"> | boolean | null
    sexOffenderRegistry?: BoolNullableFilter<"BackgroundCheck"> | boolean | null
    globalWatchlist?: BoolNullableFilter<"BackgroundCheck"> | boolean | null
    ssnTrace?: BoolNullableFilter<"BackgroundCheck"> | boolean | null
    failureReason?: StringNullableFilter<"BackgroundCheck"> | string | null
    metadata?: StringNullableFilter<"BackgroundCheck"> | string | null
    createdAt?: DateTimeFilter<"BackgroundCheck"> | Date | string
    updatedAt?: DateTimeFilter<"BackgroundCheck"> | Date | string
  }

  export type BackgroundCheckOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    checkrReportId?: SortOrderInput | SortOrder
    package?: SortOrderInput | SortOrder
    result?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    consentGivenAt?: SortOrderInput | SortOrder
    criminalRecords?: SortOrderInput | SortOrder
    sexOffenderRegistry?: SortOrderInput | SortOrder
    globalWatchlist?: SortOrderInput | SortOrder
    ssnTrace?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackgroundCheckWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    checkrReportId?: string
    AND?: BackgroundCheckWhereInput | BackgroundCheckWhereInput[]
    OR?: BackgroundCheckWhereInput[]
    NOT?: BackgroundCheckWhereInput | BackgroundCheckWhereInput[]
    userId?: StringFilter<"BackgroundCheck"> | string
    status?: StringFilter<"BackgroundCheck"> | string
    provider?: StringFilter<"BackgroundCheck"> | string
    package?: StringNullableFilter<"BackgroundCheck"> | string | null
    result?: StringNullableFilter<"BackgroundCheck"> | string | null
    completedAt?: DateTimeNullableFilter<"BackgroundCheck"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"BackgroundCheck"> | Date | string | null
    consentGivenAt?: DateTimeNullableFilter<"BackgroundCheck"> | Date | string | null
    criminalRecords?: BoolNullableFilter<"BackgroundCheck"> | boolean | null
    sexOffenderRegistry?: BoolNullableFilter<"BackgroundCheck"> | boolean | null
    globalWatchlist?: BoolNullableFilter<"BackgroundCheck"> | boolean | null
    ssnTrace?: BoolNullableFilter<"BackgroundCheck"> | boolean | null
    failureReason?: StringNullableFilter<"BackgroundCheck"> | string | null
    metadata?: StringNullableFilter<"BackgroundCheck"> | string | null
    createdAt?: DateTimeFilter<"BackgroundCheck"> | Date | string
    updatedAt?: DateTimeFilter<"BackgroundCheck"> | Date | string
  }, "id" | "checkrReportId">

  export type BackgroundCheckOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    checkrReportId?: SortOrderInput | SortOrder
    package?: SortOrderInput | SortOrder
    result?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    consentGivenAt?: SortOrderInput | SortOrder
    criminalRecords?: SortOrderInput | SortOrder
    sexOffenderRegistry?: SortOrderInput | SortOrder
    globalWatchlist?: SortOrderInput | SortOrder
    ssnTrace?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BackgroundCheckCountOrderByAggregateInput
    _max?: BackgroundCheckMaxOrderByAggregateInput
    _min?: BackgroundCheckMinOrderByAggregateInput
  }

  export type BackgroundCheckScalarWhereWithAggregatesInput = {
    AND?: BackgroundCheckScalarWhereWithAggregatesInput | BackgroundCheckScalarWhereWithAggregatesInput[]
    OR?: BackgroundCheckScalarWhereWithAggregatesInput[]
    NOT?: BackgroundCheckScalarWhereWithAggregatesInput | BackgroundCheckScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BackgroundCheck"> | string
    userId?: StringWithAggregatesFilter<"BackgroundCheck"> | string
    status?: StringWithAggregatesFilter<"BackgroundCheck"> | string
    provider?: StringWithAggregatesFilter<"BackgroundCheck"> | string
    checkrReportId?: StringNullableWithAggregatesFilter<"BackgroundCheck"> | string | null
    package?: StringNullableWithAggregatesFilter<"BackgroundCheck"> | string | null
    result?: StringNullableWithAggregatesFilter<"BackgroundCheck"> | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"BackgroundCheck"> | Date | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"BackgroundCheck"> | Date | string | null
    consentGivenAt?: DateTimeNullableWithAggregatesFilter<"BackgroundCheck"> | Date | string | null
    criminalRecords?: BoolNullableWithAggregatesFilter<"BackgroundCheck"> | boolean | null
    sexOffenderRegistry?: BoolNullableWithAggregatesFilter<"BackgroundCheck"> | boolean | null
    globalWatchlist?: BoolNullableWithAggregatesFilter<"BackgroundCheck"> | boolean | null
    ssnTrace?: BoolNullableWithAggregatesFilter<"BackgroundCheck"> | boolean | null
    failureReason?: StringNullableWithAggregatesFilter<"BackgroundCheck"> | string | null
    metadata?: StringNullableWithAggregatesFilter<"BackgroundCheck"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BackgroundCheck"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BackgroundCheck"> | Date | string
  }

  export type VisaVerificationWhereInput = {
    AND?: VisaVerificationWhereInput | VisaVerificationWhereInput[]
    OR?: VisaVerificationWhereInput[]
    NOT?: VisaVerificationWhereInput | VisaVerificationWhereInput[]
    id?: StringFilter<"VisaVerification"> | string
    userId?: StringFilter<"VisaVerification"> | string
    visaType?: StringFilter<"VisaVerification"> | string
    status?: StringFilter<"VisaVerification"> | string
    verifiedAt?: DateTimeNullableFilter<"VisaVerification"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"VisaVerification"> | Date | string | null
    eVerifyCase?: StringNullableFilter<"VisaVerification"> | string | null
    eVerifyStatus?: StringNullableFilter<"VisaVerification"> | string | null
    documentUrls?: StringNullableFilter<"VisaVerification"> | string | null
    i94Number?: StringNullableFilter<"VisaVerification"> | string | null
    sevisId?: StringNullableFilter<"VisaVerification"> | string | null
    failureReason?: StringNullableFilter<"VisaVerification"> | string | null
    metadata?: StringNullableFilter<"VisaVerification"> | string | null
    createdAt?: DateTimeFilter<"VisaVerification"> | Date | string
    updatedAt?: DateTimeFilter<"VisaVerification"> | Date | string
  }

  export type VisaVerificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    visaType?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    eVerifyCase?: SortOrderInput | SortOrder
    eVerifyStatus?: SortOrderInput | SortOrder
    documentUrls?: SortOrderInput | SortOrder
    i94Number?: SortOrderInput | SortOrder
    sevisId?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VisaVerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VisaVerificationWhereInput | VisaVerificationWhereInput[]
    OR?: VisaVerificationWhereInput[]
    NOT?: VisaVerificationWhereInput | VisaVerificationWhereInput[]
    userId?: StringFilter<"VisaVerification"> | string
    visaType?: StringFilter<"VisaVerification"> | string
    status?: StringFilter<"VisaVerification"> | string
    verifiedAt?: DateTimeNullableFilter<"VisaVerification"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"VisaVerification"> | Date | string | null
    eVerifyCase?: StringNullableFilter<"VisaVerification"> | string | null
    eVerifyStatus?: StringNullableFilter<"VisaVerification"> | string | null
    documentUrls?: StringNullableFilter<"VisaVerification"> | string | null
    i94Number?: StringNullableFilter<"VisaVerification"> | string | null
    sevisId?: StringNullableFilter<"VisaVerification"> | string | null
    failureReason?: StringNullableFilter<"VisaVerification"> | string | null
    metadata?: StringNullableFilter<"VisaVerification"> | string | null
    createdAt?: DateTimeFilter<"VisaVerification"> | Date | string
    updatedAt?: DateTimeFilter<"VisaVerification"> | Date | string
  }, "id">

  export type VisaVerificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    visaType?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    eVerifyCase?: SortOrderInput | SortOrder
    eVerifyStatus?: SortOrderInput | SortOrder
    documentUrls?: SortOrderInput | SortOrder
    i94Number?: SortOrderInput | SortOrder
    sevisId?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VisaVerificationCountOrderByAggregateInput
    _max?: VisaVerificationMaxOrderByAggregateInput
    _min?: VisaVerificationMinOrderByAggregateInput
  }

  export type VisaVerificationScalarWhereWithAggregatesInput = {
    AND?: VisaVerificationScalarWhereWithAggregatesInput | VisaVerificationScalarWhereWithAggregatesInput[]
    OR?: VisaVerificationScalarWhereWithAggregatesInput[]
    NOT?: VisaVerificationScalarWhereWithAggregatesInput | VisaVerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VisaVerification"> | string
    userId?: StringWithAggregatesFilter<"VisaVerification"> | string
    visaType?: StringWithAggregatesFilter<"VisaVerification"> | string
    status?: StringWithAggregatesFilter<"VisaVerification"> | string
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"VisaVerification"> | Date | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"VisaVerification"> | Date | string | null
    eVerifyCase?: StringNullableWithAggregatesFilter<"VisaVerification"> | string | null
    eVerifyStatus?: StringNullableWithAggregatesFilter<"VisaVerification"> | string | null
    documentUrls?: StringNullableWithAggregatesFilter<"VisaVerification"> | string | null
    i94Number?: StringNullableWithAggregatesFilter<"VisaVerification"> | string | null
    sevisId?: StringNullableWithAggregatesFilter<"VisaVerification"> | string | null
    failureReason?: StringNullableWithAggregatesFilter<"VisaVerification"> | string | null
    metadata?: StringNullableWithAggregatesFilter<"VisaVerification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"VisaVerification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VisaVerification"> | Date | string
  }

  export type LicenseVerificationWhereInput = {
    AND?: LicenseVerificationWhereInput | LicenseVerificationWhereInput[]
    OR?: LicenseVerificationWhereInput[]
    NOT?: LicenseVerificationWhereInput | LicenseVerificationWhereInput[]
    id?: StringFilter<"LicenseVerification"> | string
    userId?: StringFilter<"LicenseVerification"> | string
    licenseType?: StringFilter<"LicenseVerification"> | string
    licenseNumber?: StringFilter<"LicenseVerification"> | string
    state?: StringFilter<"LicenseVerification"> | string
    status?: StringFilter<"LicenseVerification"> | string
    verifiedAt?: DateTimeNullableFilter<"LicenseVerification"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"LicenseVerification"> | Date | string | null
    issueDate?: DateTimeNullableFilter<"LicenseVerification"> | Date | string | null
    boardName?: StringNullableFilter<"LicenseVerification"> | string | null
    disciplinaryActions?: BoolFilter<"LicenseVerification"> | boolean
    failureReason?: StringNullableFilter<"LicenseVerification"> | string | null
    metadata?: StringNullableFilter<"LicenseVerification"> | string | null
    createdAt?: DateTimeFilter<"LicenseVerification"> | Date | string
    updatedAt?: DateTimeFilter<"LicenseVerification"> | Date | string
  }

  export type LicenseVerificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    licenseType?: SortOrder
    licenseNumber?: SortOrder
    state?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    issueDate?: SortOrderInput | SortOrder
    boardName?: SortOrderInput | SortOrder
    disciplinaryActions?: SortOrder
    failureReason?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LicenseVerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_licenseNumber_state?: LicenseVerificationUserIdLicenseNumberStateCompoundUniqueInput
    AND?: LicenseVerificationWhereInput | LicenseVerificationWhereInput[]
    OR?: LicenseVerificationWhereInput[]
    NOT?: LicenseVerificationWhereInput | LicenseVerificationWhereInput[]
    userId?: StringFilter<"LicenseVerification"> | string
    licenseType?: StringFilter<"LicenseVerification"> | string
    licenseNumber?: StringFilter<"LicenseVerification"> | string
    state?: StringFilter<"LicenseVerification"> | string
    status?: StringFilter<"LicenseVerification"> | string
    verifiedAt?: DateTimeNullableFilter<"LicenseVerification"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"LicenseVerification"> | Date | string | null
    issueDate?: DateTimeNullableFilter<"LicenseVerification"> | Date | string | null
    boardName?: StringNullableFilter<"LicenseVerification"> | string | null
    disciplinaryActions?: BoolFilter<"LicenseVerification"> | boolean
    failureReason?: StringNullableFilter<"LicenseVerification"> | string | null
    metadata?: StringNullableFilter<"LicenseVerification"> | string | null
    createdAt?: DateTimeFilter<"LicenseVerification"> | Date | string
    updatedAt?: DateTimeFilter<"LicenseVerification"> | Date | string
  }, "id" | "userId_licenseNumber_state">

  export type LicenseVerificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    licenseType?: SortOrder
    licenseNumber?: SortOrder
    state?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    issueDate?: SortOrderInput | SortOrder
    boardName?: SortOrderInput | SortOrder
    disciplinaryActions?: SortOrder
    failureReason?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LicenseVerificationCountOrderByAggregateInput
    _max?: LicenseVerificationMaxOrderByAggregateInput
    _min?: LicenseVerificationMinOrderByAggregateInput
  }

  export type LicenseVerificationScalarWhereWithAggregatesInput = {
    AND?: LicenseVerificationScalarWhereWithAggregatesInput | LicenseVerificationScalarWhereWithAggregatesInput[]
    OR?: LicenseVerificationScalarWhereWithAggregatesInput[]
    NOT?: LicenseVerificationScalarWhereWithAggregatesInput | LicenseVerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LicenseVerification"> | string
    userId?: StringWithAggregatesFilter<"LicenseVerification"> | string
    licenseType?: StringWithAggregatesFilter<"LicenseVerification"> | string
    licenseNumber?: StringWithAggregatesFilter<"LicenseVerification"> | string
    state?: StringWithAggregatesFilter<"LicenseVerification"> | string
    status?: StringWithAggregatesFilter<"LicenseVerification"> | string
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"LicenseVerification"> | Date | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"LicenseVerification"> | Date | string | null
    issueDate?: DateTimeNullableWithAggregatesFilter<"LicenseVerification"> | Date | string | null
    boardName?: StringNullableWithAggregatesFilter<"LicenseVerification"> | string | null
    disciplinaryActions?: BoolWithAggregatesFilter<"LicenseVerification"> | boolean
    failureReason?: StringNullableWithAggregatesFilter<"LicenseVerification"> | string | null
    metadata?: StringNullableWithAggregatesFilter<"LicenseVerification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LicenseVerification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LicenseVerification"> | Date | string
  }

  export type VerificationAuditLogWhereInput = {
    AND?: VerificationAuditLogWhereInput | VerificationAuditLogWhereInput[]
    OR?: VerificationAuditLogWhereInput[]
    NOT?: VerificationAuditLogWhereInput | VerificationAuditLogWhereInput[]
    id?: StringFilter<"VerificationAuditLog"> | string
    userId?: StringFilter<"VerificationAuditLog"> | string
    verificationType?: StringFilter<"VerificationAuditLog"> | string
    action?: StringFilter<"VerificationAuditLog"> | string
    performedBy?: StringNullableFilter<"VerificationAuditLog"> | string | null
    previousStatus?: StringNullableFilter<"VerificationAuditLog"> | string | null
    newStatus?: StringFilter<"VerificationAuditLog"> | string
    reason?: StringNullableFilter<"VerificationAuditLog"> | string | null
    metadata?: StringNullableFilter<"VerificationAuditLog"> | string | null
    createdAt?: DateTimeFilter<"VerificationAuditLog"> | Date | string
  }

  export type VerificationAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    verificationType?: SortOrder
    action?: SortOrder
    performedBy?: SortOrderInput | SortOrder
    previousStatus?: SortOrderInput | SortOrder
    newStatus?: SortOrder
    reason?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type VerificationAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VerificationAuditLogWhereInput | VerificationAuditLogWhereInput[]
    OR?: VerificationAuditLogWhereInput[]
    NOT?: VerificationAuditLogWhereInput | VerificationAuditLogWhereInput[]
    userId?: StringFilter<"VerificationAuditLog"> | string
    verificationType?: StringFilter<"VerificationAuditLog"> | string
    action?: StringFilter<"VerificationAuditLog"> | string
    performedBy?: StringNullableFilter<"VerificationAuditLog"> | string | null
    previousStatus?: StringNullableFilter<"VerificationAuditLog"> | string | null
    newStatus?: StringFilter<"VerificationAuditLog"> | string
    reason?: StringNullableFilter<"VerificationAuditLog"> | string | null
    metadata?: StringNullableFilter<"VerificationAuditLog"> | string | null
    createdAt?: DateTimeFilter<"VerificationAuditLog"> | Date | string
  }, "id">

  export type VerificationAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    verificationType?: SortOrder
    action?: SortOrder
    performedBy?: SortOrderInput | SortOrder
    previousStatus?: SortOrderInput | SortOrder
    newStatus?: SortOrder
    reason?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: VerificationAuditLogCountOrderByAggregateInput
    _max?: VerificationAuditLogMaxOrderByAggregateInput
    _min?: VerificationAuditLogMinOrderByAggregateInput
  }

  export type VerificationAuditLogScalarWhereWithAggregatesInput = {
    AND?: VerificationAuditLogScalarWhereWithAggregatesInput | VerificationAuditLogScalarWhereWithAggregatesInput[]
    OR?: VerificationAuditLogScalarWhereWithAggregatesInput[]
    NOT?: VerificationAuditLogScalarWhereWithAggregatesInput | VerificationAuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VerificationAuditLog"> | string
    userId?: StringWithAggregatesFilter<"VerificationAuditLog"> | string
    verificationType?: StringWithAggregatesFilter<"VerificationAuditLog"> | string
    action?: StringWithAggregatesFilter<"VerificationAuditLog"> | string
    performedBy?: StringNullableWithAggregatesFilter<"VerificationAuditLog"> | string | null
    previousStatus?: StringNullableWithAggregatesFilter<"VerificationAuditLog"> | string | null
    newStatus?: StringWithAggregatesFilter<"VerificationAuditLog"> | string
    reason?: StringNullableWithAggregatesFilter<"VerificationAuditLog"> | string | null
    metadata?: StringNullableWithAggregatesFilter<"VerificationAuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"VerificationAuditLog"> | Date | string
  }

  export type VerificationWhereInput = {
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    id?: StringFilter<"Verification"> | string
    userId?: StringFilter<"Verification"> | string
    type?: StringFilter<"Verification"> | string
    status?: StringFilter<"Verification"> | string
    provider?: StringNullableFilter<"Verification"> | string | null
    providerRef?: StringNullableFilter<"Verification"> | string | null
    verifiedAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
    metadata?: StringNullableFilter<"Verification"> | string | null
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }

  export type VerificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    provider?: SortOrderInput | SortOrder
    providerRef?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_type?: VerificationUserIdTypeCompoundUniqueInput
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    userId?: StringFilter<"Verification"> | string
    type?: StringFilter<"Verification"> | string
    status?: StringFilter<"Verification"> | string
    provider?: StringNullableFilter<"Verification"> | string | null
    providerRef?: StringNullableFilter<"Verification"> | string | null
    verifiedAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
    expiresAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
    metadata?: StringNullableFilter<"Verification"> | string | null
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }, "id" | "userId_type">

  export type VerificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    provider?: SortOrderInput | SortOrder
    providerRef?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VerificationCountOrderByAggregateInput
    _max?: VerificationMaxOrderByAggregateInput
    _min?: VerificationMinOrderByAggregateInput
  }

  export type VerificationScalarWhereWithAggregatesInput = {
    AND?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    OR?: VerificationScalarWhereWithAggregatesInput[]
    NOT?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Verification"> | string
    userId?: StringWithAggregatesFilter<"Verification"> | string
    type?: StringWithAggregatesFilter<"Verification"> | string
    status?: StringWithAggregatesFilter<"Verification"> | string
    provider?: StringNullableWithAggregatesFilter<"Verification"> | string | null
    providerRef?: StringNullableWithAggregatesFilter<"Verification"> | string | null
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"Verification"> | Date | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"Verification"> | Date | string | null
    metadata?: StringNullableWithAggregatesFilter<"Verification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
  }

  export type IdentityVerificationCreateInput = {
    id?: string
    userId: string
    status?: string
    provider?: string
    personaInquiryId?: string | null
    documentType?: string | null
    documentNumber?: string | null
    verifiedAt?: Date | string | null
    expiresAt?: Date | string | null
    failureReason?: string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IdentityVerificationUncheckedCreateInput = {
    id?: string
    userId: string
    status?: string
    provider?: string
    personaInquiryId?: string | null
    documentType?: string | null
    documentNumber?: string | null
    verifiedAt?: Date | string | null
    expiresAt?: Date | string | null
    failureReason?: string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IdentityVerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    personaInquiryId?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    documentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdentityVerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    personaInquiryId?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    documentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdentityVerificationCreateManyInput = {
    id?: string
    userId: string
    status?: string
    provider?: string
    personaInquiryId?: string | null
    documentType?: string | null
    documentNumber?: string | null
    verifiedAt?: Date | string | null
    expiresAt?: Date | string | null
    failureReason?: string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IdentityVerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    personaInquiryId?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    documentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdentityVerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    personaInquiryId?: NullableStringFieldUpdateOperationsInput | string | null
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    documentNumber?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackgroundCheckCreateInput = {
    id?: string
    userId: string
    status?: string
    provider?: string
    checkrReportId?: string | null
    package?: string | null
    result?: string | null
    completedAt?: Date | string | null
    expiresAt?: Date | string | null
    consentGivenAt?: Date | string | null
    criminalRecords?: boolean | null
    sexOffenderRegistry?: boolean | null
    globalWatchlist?: boolean | null
    ssnTrace?: boolean | null
    failureReason?: string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackgroundCheckUncheckedCreateInput = {
    id?: string
    userId: string
    status?: string
    provider?: string
    checkrReportId?: string | null
    package?: string | null
    result?: string | null
    completedAt?: Date | string | null
    expiresAt?: Date | string | null
    consentGivenAt?: Date | string | null
    criminalRecords?: boolean | null
    sexOffenderRegistry?: boolean | null
    globalWatchlist?: boolean | null
    ssnTrace?: boolean | null
    failureReason?: string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackgroundCheckUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    checkrReportId?: NullableStringFieldUpdateOperationsInput | string | null
    package?: NullableStringFieldUpdateOperationsInput | string | null
    result?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    consentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    criminalRecords?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sexOffenderRegistry?: NullableBoolFieldUpdateOperationsInput | boolean | null
    globalWatchlist?: NullableBoolFieldUpdateOperationsInput | boolean | null
    ssnTrace?: NullableBoolFieldUpdateOperationsInput | boolean | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackgroundCheckUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    checkrReportId?: NullableStringFieldUpdateOperationsInput | string | null
    package?: NullableStringFieldUpdateOperationsInput | string | null
    result?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    consentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    criminalRecords?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sexOffenderRegistry?: NullableBoolFieldUpdateOperationsInput | boolean | null
    globalWatchlist?: NullableBoolFieldUpdateOperationsInput | boolean | null
    ssnTrace?: NullableBoolFieldUpdateOperationsInput | boolean | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackgroundCheckCreateManyInput = {
    id?: string
    userId: string
    status?: string
    provider?: string
    checkrReportId?: string | null
    package?: string | null
    result?: string | null
    completedAt?: Date | string | null
    expiresAt?: Date | string | null
    consentGivenAt?: Date | string | null
    criminalRecords?: boolean | null
    sexOffenderRegistry?: boolean | null
    globalWatchlist?: boolean | null
    ssnTrace?: boolean | null
    failureReason?: string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BackgroundCheckUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    checkrReportId?: NullableStringFieldUpdateOperationsInput | string | null
    package?: NullableStringFieldUpdateOperationsInput | string | null
    result?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    consentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    criminalRecords?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sexOffenderRegistry?: NullableBoolFieldUpdateOperationsInput | boolean | null
    globalWatchlist?: NullableBoolFieldUpdateOperationsInput | boolean | null
    ssnTrace?: NullableBoolFieldUpdateOperationsInput | boolean | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BackgroundCheckUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    checkrReportId?: NullableStringFieldUpdateOperationsInput | string | null
    package?: NullableStringFieldUpdateOperationsInput | string | null
    result?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    consentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    criminalRecords?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sexOffenderRegistry?: NullableBoolFieldUpdateOperationsInput | boolean | null
    globalWatchlist?: NullableBoolFieldUpdateOperationsInput | boolean | null
    ssnTrace?: NullableBoolFieldUpdateOperationsInput | boolean | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisaVerificationCreateInput = {
    id?: string
    userId: string
    visaType: string
    status?: string
    verifiedAt?: Date | string | null
    expiresAt?: Date | string | null
    eVerifyCase?: string | null
    eVerifyStatus?: string | null
    documentUrls?: string | null
    i94Number?: string | null
    sevisId?: string | null
    failureReason?: string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VisaVerificationUncheckedCreateInput = {
    id?: string
    userId: string
    visaType: string
    status?: string
    verifiedAt?: Date | string | null
    expiresAt?: Date | string | null
    eVerifyCase?: string | null
    eVerifyStatus?: string | null
    documentUrls?: string | null
    i94Number?: string | null
    sevisId?: string | null
    failureReason?: string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VisaVerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    visaType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eVerifyCase?: NullableStringFieldUpdateOperationsInput | string | null
    eVerifyStatus?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrls?: NullableStringFieldUpdateOperationsInput | string | null
    i94Number?: NullableStringFieldUpdateOperationsInput | string | null
    sevisId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisaVerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    visaType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eVerifyCase?: NullableStringFieldUpdateOperationsInput | string | null
    eVerifyStatus?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrls?: NullableStringFieldUpdateOperationsInput | string | null
    i94Number?: NullableStringFieldUpdateOperationsInput | string | null
    sevisId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisaVerificationCreateManyInput = {
    id?: string
    userId: string
    visaType: string
    status?: string
    verifiedAt?: Date | string | null
    expiresAt?: Date | string | null
    eVerifyCase?: string | null
    eVerifyStatus?: string | null
    documentUrls?: string | null
    i94Number?: string | null
    sevisId?: string | null
    failureReason?: string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VisaVerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    visaType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eVerifyCase?: NullableStringFieldUpdateOperationsInput | string | null
    eVerifyStatus?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrls?: NullableStringFieldUpdateOperationsInput | string | null
    i94Number?: NullableStringFieldUpdateOperationsInput | string | null
    sevisId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisaVerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    visaType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    eVerifyCase?: NullableStringFieldUpdateOperationsInput | string | null
    eVerifyStatus?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrls?: NullableStringFieldUpdateOperationsInput | string | null
    i94Number?: NullableStringFieldUpdateOperationsInput | string | null
    sevisId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LicenseVerificationCreateInput = {
    id?: string
    userId: string
    licenseType: string
    licenseNumber: string
    state: string
    status?: string
    verifiedAt?: Date | string | null
    expiresAt?: Date | string | null
    issueDate?: Date | string | null
    boardName?: string | null
    disciplinaryActions?: boolean
    failureReason?: string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LicenseVerificationUncheckedCreateInput = {
    id?: string
    userId: string
    licenseType: string
    licenseNumber: string
    state: string
    status?: string
    verifiedAt?: Date | string | null
    expiresAt?: Date | string | null
    issueDate?: Date | string | null
    boardName?: string | null
    disciplinaryActions?: boolean
    failureReason?: string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LicenseVerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    boardName?: NullableStringFieldUpdateOperationsInput | string | null
    disciplinaryActions?: BoolFieldUpdateOperationsInput | boolean
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LicenseVerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    boardName?: NullableStringFieldUpdateOperationsInput | string | null
    disciplinaryActions?: BoolFieldUpdateOperationsInput | boolean
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LicenseVerificationCreateManyInput = {
    id?: string
    userId: string
    licenseType: string
    licenseNumber: string
    state: string
    status?: string
    verifiedAt?: Date | string | null
    expiresAt?: Date | string | null
    issueDate?: Date | string | null
    boardName?: string | null
    disciplinaryActions?: boolean
    failureReason?: string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LicenseVerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    boardName?: NullableStringFieldUpdateOperationsInput | string | null
    disciplinaryActions?: BoolFieldUpdateOperationsInput | boolean
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LicenseVerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    boardName?: NullableStringFieldUpdateOperationsInput | string | null
    disciplinaryActions?: BoolFieldUpdateOperationsInput | boolean
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationAuditLogCreateInput = {
    id?: string
    userId: string
    verificationType: string
    action: string
    performedBy?: string | null
    previousStatus?: string | null
    newStatus: string
    reason?: string | null
    metadata?: string | null
    createdAt?: Date | string
  }

  export type VerificationAuditLogUncheckedCreateInput = {
    id?: string
    userId: string
    verificationType: string
    action: string
    performedBy?: string | null
    previousStatus?: string | null
    newStatus: string
    reason?: string | null
    metadata?: string | null
    createdAt?: Date | string
  }

  export type VerificationAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    verificationType?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    previousStatus?: NullableStringFieldUpdateOperationsInput | string | null
    newStatus?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    verificationType?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    previousStatus?: NullableStringFieldUpdateOperationsInput | string | null
    newStatus?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationAuditLogCreateManyInput = {
    id?: string
    userId: string
    verificationType: string
    action: string
    performedBy?: string | null
    previousStatus?: string | null
    newStatus: string
    reason?: string | null
    metadata?: string | null
    createdAt?: Date | string
  }

  export type VerificationAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    verificationType?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    previousStatus?: NullableStringFieldUpdateOperationsInput | string | null
    newStatus?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    verificationType?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    previousStatus?: NullableStringFieldUpdateOperationsInput | string | null
    newStatus?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateInput = {
    id?: string
    userId: string
    type: string
    status?: string
    provider?: string | null
    providerRef?: string | null
    verifiedAt?: Date | string | null
    expiresAt?: Date | string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    status?: string
    provider?: string | null
    providerRef?: string | null
    verifiedAt?: Date | string | null
    expiresAt?: Date | string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateManyInput = {
    id?: string
    userId: string
    type: string
    status?: string
    provider?: string | null
    providerRef?: string | null
    verifiedAt?: Date | string | null
    expiresAt?: Date | string | null
    metadata?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    providerRef?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type IdentityVerificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    personaInquiryId?: SortOrder
    documentType?: SortOrder
    documentNumber?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    failureReason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IdentityVerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    personaInquiryId?: SortOrder
    documentType?: SortOrder
    documentNumber?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    failureReason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IdentityVerificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    personaInquiryId?: SortOrder
    documentType?: SortOrder
    documentNumber?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    failureReason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type BackgroundCheckCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    checkrReportId?: SortOrder
    package?: SortOrder
    result?: SortOrder
    completedAt?: SortOrder
    expiresAt?: SortOrder
    consentGivenAt?: SortOrder
    criminalRecords?: SortOrder
    sexOffenderRegistry?: SortOrder
    globalWatchlist?: SortOrder
    ssnTrace?: SortOrder
    failureReason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackgroundCheckMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    checkrReportId?: SortOrder
    package?: SortOrder
    result?: SortOrder
    completedAt?: SortOrder
    expiresAt?: SortOrder
    consentGivenAt?: SortOrder
    criminalRecords?: SortOrder
    sexOffenderRegistry?: SortOrder
    globalWatchlist?: SortOrder
    ssnTrace?: SortOrder
    failureReason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BackgroundCheckMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    checkrReportId?: SortOrder
    package?: SortOrder
    result?: SortOrder
    completedAt?: SortOrder
    expiresAt?: SortOrder
    consentGivenAt?: SortOrder
    criminalRecords?: SortOrder
    sexOffenderRegistry?: SortOrder
    globalWatchlist?: SortOrder
    ssnTrace?: SortOrder
    failureReason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type VisaVerificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    visaType?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    eVerifyCase?: SortOrder
    eVerifyStatus?: SortOrder
    documentUrls?: SortOrder
    i94Number?: SortOrder
    sevisId?: SortOrder
    failureReason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VisaVerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    visaType?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    eVerifyCase?: SortOrder
    eVerifyStatus?: SortOrder
    documentUrls?: SortOrder
    i94Number?: SortOrder
    sevisId?: SortOrder
    failureReason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VisaVerificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    visaType?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    eVerifyCase?: SortOrder
    eVerifyStatus?: SortOrder
    documentUrls?: SortOrder
    i94Number?: SortOrder
    sevisId?: SortOrder
    failureReason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type LicenseVerificationUserIdLicenseNumberStateCompoundUniqueInput = {
    userId: string
    licenseNumber: string
    state: string
  }

  export type LicenseVerificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    licenseType?: SortOrder
    licenseNumber?: SortOrder
    state?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    issueDate?: SortOrder
    boardName?: SortOrder
    disciplinaryActions?: SortOrder
    failureReason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LicenseVerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    licenseType?: SortOrder
    licenseNumber?: SortOrder
    state?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    issueDate?: SortOrder
    boardName?: SortOrder
    disciplinaryActions?: SortOrder
    failureReason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LicenseVerificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    licenseType?: SortOrder
    licenseNumber?: SortOrder
    state?: SortOrder
    status?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    issueDate?: SortOrder
    boardName?: SortOrder
    disciplinaryActions?: SortOrder
    failureReason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type VerificationAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    verificationType?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    previousStatus?: SortOrder
    newStatus?: SortOrder
    reason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type VerificationAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    verificationType?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    previousStatus?: SortOrder
    newStatus?: SortOrder
    reason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type VerificationAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    verificationType?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    previousStatus?: SortOrder
    newStatus?: SortOrder
    reason?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type VerificationUserIdTypeCompoundUniqueInput = {
    userId: string
    type: string
  }

  export type VerificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerRef?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerRef?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    provider?: SortOrder
    providerRef?: SortOrder
    verifiedAt?: SortOrder
    expiresAt?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
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

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use IdentityVerificationDefaultArgs instead
     */
    export type IdentityVerificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = IdentityVerificationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BackgroundCheckDefaultArgs instead
     */
    export type BackgroundCheckArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BackgroundCheckDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VisaVerificationDefaultArgs instead
     */
    export type VisaVerificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VisaVerificationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LicenseVerificationDefaultArgs instead
     */
    export type LicenseVerificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LicenseVerificationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VerificationAuditLogDefaultArgs instead
     */
    export type VerificationAuditLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VerificationAuditLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VerificationDefaultArgs instead
     */
    export type VerificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VerificationDefaultArgs<ExtArgs>

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