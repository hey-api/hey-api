import type { PyNode as _PyNode, PyNodeBase as _PyNodeBase } from './nodes/base';
import type {
  PyComprehension as _PyComprehension,
  PyComprehensionNode as _PyComprehensionNode,
} from './nodes/comprehension';
import type { PyClassDeclaration as _PyClassDeclaration } from './nodes/declarations/class';
import type { PyFunctionDeclaration as _PyFunctionDeclaration } from './nodes/declarations/function';
import type { PyFunctionParameter as _PyFunctionParameter } from './nodes/declarations/function-parameter';
import type { PyExpression as _PyExpression } from './nodes/expression';
import type { PyAsyncExpression as _PyAsyncExpression } from './nodes/expressions/async';
import type { PyAwaitExpression as _PyAwaitExpression } from './nodes/expressions/await';
import type {
  PyBinaryExpression as _PyBinaryExpression,
  PyBinaryOperator as _PyBinaryOperator,
} from './nodes/expressions/binary';
import type { PyCallExpression as _PyCallExpression } from './nodes/expressions/call';
import type { PyDictComprehension as _PyDictComprehension } from './nodes/expressions/comprehensions/dict';
import type { PyListComprehension as _PyListComprehension } from './nodes/expressions/comprehensions/list';
import type { PySetComprehension as _PySetComprehension } from './nodes/expressions/comprehensions/set';
import type { PyDictExpression as _PyDictExpression } from './nodes/expressions/dict';
import type { PyFStringExpression as _PyFStringExpression } from './nodes/expressions/f-string';
import type { PyGeneratorExpression as _PyGeneratorExpression } from './nodes/expressions/generator';
import type { PyIdentifier as _PyIdentifier } from './nodes/expressions/identifier';
import type { PyKeywordArgument as _PyKeywordArgument } from './nodes/expressions/keyword-arg';
import type { PyLambdaExpression as _PyLambdaExpression } from './nodes/expressions/lambda';
import type { PyListExpression as _PyListExpression } from './nodes/expressions/list';
import type {
  PyLiteral as _PyLiteral,
  PyLiteralValue as _PyLiteralValue,
} from './nodes/expressions/literal';
import type { PyMemberExpression as _PyMemberExpression } from './nodes/expressions/member';
import type { PyRStringExpression as _PyRStringExpression } from './nodes/expressions/r-string';
import type { PySetExpression as _PySetExpression } from './nodes/expressions/set';
import type { PySubscriptExpression as _PySubscriptExpression } from './nodes/expressions/subscript';
import type { PySubscriptSlice as _PySubscriptSlice } from './nodes/expressions/subscript-slice';
import type { PyTupleExpression as _PyTupleExpression } from './nodes/expressions/tuple';
import type { PyYieldExpression as _PyYieldExpression } from './nodes/expressions/yield';
import type { PyYieldFromExpression as _PyYieldFromExpression } from './nodes/expressions/yield-from';
import { factory } from './nodes/factory';
import { PyNodeKind } from './nodes/kinds';
import type { PyStatement as _PyStatement } from './nodes/statement';
import type { PyAssignment as _PyAssignment } from './nodes/statements/assignment';
import type {
  PyAugmentedAssignment as _PyAugmentedAssignment,
  PyAugmentedOperator as _PyAugmentedOperator,
} from './nodes/statements/augmented-assignment';
import type { PyBlock as _PyBlock } from './nodes/statements/block';
import type { PyBreakStatement as _PyBreakStatement } from './nodes/statements/break';
import type { PyContinueStatement as _PyContinueStatement } from './nodes/statements/continue';
import type { PyEmptyStatement as _PyEmptyStatement } from './nodes/statements/empty';
import type { PyExceptClause as _PyExceptClause } from './nodes/statements/except';
import type { PyExpressionStatement as _PyExpressionStatement } from './nodes/statements/expression';
import type { PyForStatement as _PyForStatement } from './nodes/statements/for';
import type { PyIfStatement as _PyIfStatement } from './nodes/statements/if';
import type { PyImportStatement as _PyImportStatement } from './nodes/statements/import';
import type { PyRaiseStatement as _PyRaiseStatement } from './nodes/statements/raise';
import type { PyReturnStatement as _PyReturnStatement } from './nodes/statements/return';
import type { PyTryStatement as _PyTryStatement } from './nodes/statements/try';
import type { PyWhileStatement as _PyWhileStatement } from './nodes/statements/while';
import type { PyWithStatement as _PyWithStatement } from './nodes/statements/with';
import type { PyWithItem as _PyWithItem } from './nodes/statements/with-item';
import type { PyComment as _PyComment } from './nodes/structure/comment';
import type { PySourceFile as _PySourceFile } from './nodes/structure/source-file';
import type { PyPrinter as _PyPrinter, PyPrinterOptions as _PyPrinterOptions } from './printer';
import { createPrinter } from './printer';

export namespace py {
  // Base / Core
  export type Node = _PyNode;
  export type NodeBase = _PyNodeBase;
  export type NodeKind = PyNodeKind;
  export type Expression = _PyExpression;
  export type Statement = _PyStatement;

  // Structure
  export type SourceFile = _PySourceFile;
  export type Comment = _PyComment;

  // Declarations
  export type ClassDeclaration = _PyClassDeclaration;
  export type FunctionDeclaration = _PyFunctionDeclaration;
  export type FunctionParameter = _PyFunctionParameter;

  // Statements
  export type Assignment = _PyAssignment;
  export type AugmentedAssignment = _PyAugmentedAssignment;
  export type AugmentedOperator = _PyAugmentedOperator;
  export type Block = _PyBlock;
  export type BreakStatement = _PyBreakStatement;
  export type ContinueStatement = _PyContinueStatement;
  export type EmptyStatement = _PyEmptyStatement;
  export type ExceptClause = _PyExceptClause;
  export type ExpressionStatement = _PyExpressionStatement;
  export type ForStatement = _PyForStatement;
  export type IfStatement = _PyIfStatement;
  export type ImportStatement = _PyImportStatement;
  export type RaiseStatement = _PyRaiseStatement;
  export type ReturnStatement = _PyReturnStatement;
  export type TryStatement = _PyTryStatement;
  export type WhileStatement = _PyWhileStatement;
  export type WithItem = _PyWithItem;
  export type WithStatement = _PyWithStatement;

  // Expressions
  export type AsyncExpression = _PyAsyncExpression;
  export type AwaitExpression = _PyAwaitExpression;
  export type BinaryExpression = _PyBinaryExpression;
  export type BinaryOperator = _PyBinaryOperator;
  export type CallExpression = _PyCallExpression;
  export type DictExpression = _PyDictExpression;
  export type FStringExpression = _PyFStringExpression;
  export type GeneratorExpression = _PyGeneratorExpression;
  export type Identifier = _PyIdentifier;
  export type KeywordArgument = _PyKeywordArgument;
  export type LambdaExpression = _PyLambdaExpression;
  export type ListExpression = _PyListExpression;
  export type Literal = _PyLiteral;
  export type MemberExpression = _PyMemberExpression;
  export type RStringExpression = _PyRStringExpression;
  export type SetExpression = _PySetExpression;
  export type SubscriptExpression = _PySubscriptExpression;
  export type SubscriptSlice = _PySubscriptSlice;
  export type TupleExpression = _PyTupleExpression;
  export type YieldExpression = _PyYieldExpression;
  export type YieldFromExpression = _PyYieldFromExpression;

  // Comprehensions
  export type Comprehension = _PyComprehension;
  export type ComprehensionNode = _PyComprehensionNode;
  export type DictComprehension = _PyDictComprehension;
  export type ListComprehension = _PyListComprehension;
  export type SetComprehension = _PySetComprehension;

  // Printer
  export type PrinterOptions = _PyPrinterOptions;
  export type Printer = _PyPrinter;

  // Miscellaneous
  export type LiteralValue = _PyLiteralValue;
}

export const py = {
  PyNodeKind,
  createPrinter,
  factory,
} as const;
