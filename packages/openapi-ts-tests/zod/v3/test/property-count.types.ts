import type { z } from 'zod';

import type { zExampleRequest } from '../__snapshots__/3.0.x/v3/property-count/zod.gen';

type ExampleRequestInput = z.input<typeof zExampleRequest>;
type ExampleRequestOutput = z.output<typeof zExampleRequest>;

const acceptsExpectedInput = (input: ExampleRequestInput) => input;
const acceptsExpectedOutput = (output: ExampleRequestOutput) => output;

acceptsExpectedInput({ options: { optionA: true } });
acceptsExpectedOutput({ options: { optionA: true } });

// @ts-expect-error optionA must remain a boolean in the generated input type.
acceptsExpectedInput({ options: { optionA: 'invalid' } });

// @ts-expect-error optionA must remain a boolean in the generated output type.
acceptsExpectedOutput({ options: { optionA: 'invalid' } });
