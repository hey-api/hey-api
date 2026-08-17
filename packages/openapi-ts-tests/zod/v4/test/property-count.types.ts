import type { z } from 'zod';

import type { zExampleRequest as zMiniExampleRequest } from '../__snapshots__/3.0.x/mini/property-count/zod.gen';
import type { zExampleRequest as zV4ExampleRequest } from '../__snapshots__/3.0.x/v4/property-count/zod.gen';

type V4ExampleRequestInput = z.input<typeof zV4ExampleRequest>;
type MiniExampleRequestInput = z.input<typeof zMiniExampleRequest>;

const acceptsV4Input = (input: V4ExampleRequestInput) => input;
const acceptsMiniInput = (input: MiniExampleRequestInput) => input;

acceptsV4Input({ options: { optionA: true } });
acceptsMiniInput({ options: { optionA: true } });

// @ts-expect-error optionA must remain a boolean in the generated input type.
acceptsV4Input({ options: { optionA: 'invalid' } });

// @ts-expect-error optionA must remain a boolean in the generated input type.
acceptsMiniInput({ options: { optionA: 'invalid' } });
