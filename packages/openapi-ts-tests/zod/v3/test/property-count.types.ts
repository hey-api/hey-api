import type { z } from 'zod';

import type { zExampleRequest } from '../__snapshots__/3.0.x/v3/property-count/zod.gen';

type ExampleRequestInput = z.input<typeof zExampleRequest>;

const acceptsExpectedInput = (input: ExampleRequestInput) => input;

acceptsExpectedInput({ options: { optionA: true } });

// @ts-expect-error optionA must remain a boolean in the generated input type.
acceptsExpectedInput({ options: { optionA: 'invalid' } });
