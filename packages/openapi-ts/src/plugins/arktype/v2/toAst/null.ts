import type { SchemaWithType } from '@hey-api/shared';

import { identifiers } from '../../constants';
import type { Ast, IrSchemaToAstOptions } from '../../shared/types';

export const nullToAst = (
  _args: IrSchemaToAstOptions & {
    schema: SchemaWithType<'null'>;
  },
): Omit<Ast, 'typeName'> => {
  const result: Partial<Omit<Ast, 'typeName'>> = {};
  result.def = identifiers.primitives.null;
  return result as Omit<Ast, 'typeName'>;
};
