// Minimal ambient declaration of the global `Temporal` API.
// TODO: move the Temporal test to a separate package with Temporal global
// configured through tsconfig.json and remove this declaration.
declare namespace Temporal {
  interface Instant {
    readonly epochMilliseconds: number;
  }
  interface PlainDate {
    readonly day: number;
    readonly month: number;
    readonly year: number;
  }
  const Instant: {
    from(value: unknown): Instant;
  };
  const PlainDate: {
    from(value: unknown): PlainDate;
  };
}
