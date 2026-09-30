import type { postFooMutation } from '../__snapshots__/3.1.x/zod-transformer-output/@tanstack/react-query.gen';

it('infers bigint from the generated mutation response transformer', () => {
  type Mutation = ReturnType<typeof postFooMutation>;
  type Data = Awaited<ReturnType<NonNullable<Mutation['mutationFn']>>>;

  expectTypeOf<Data['foo']>().toEqualTypeOf<bigint>();
});
