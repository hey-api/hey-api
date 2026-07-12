import type { TsVariableDeclarationList } from '../declarations/variable-declaration-list';
import type { TsExpression } from '../expression';

export type TsForInitializer = TsExpression | TsVariableDeclarationList;
