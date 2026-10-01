import type { NodeName } from '@hey-api/codegen-core';
import { buildSymbolIn, pathToName } from '@hey-api/shared';

import type { DocLines } from '../../../py-dsl/layout/doc';
import { $ } from '../dsl';
import type { ProcessorContext } from './processor';
import type { PydanticNode } from './types';

// TODO: move this somewhere else, maybe Python utils?
export function toDocLines(title?: string, description?: string): DocLines {
  if (title && description) return [title, '', description];
  if (title) return title;
  if (description) return description;
  return [];
}

export function exportAst({
  meta,
  naming,
  namingAnchor,
  node,
  path,
  plugin,
  schema,
  tags,
}: ProcessorContext & {
  node: PydanticNode;
}): void {
  const name = pathToName(path, { anchor: namingAnchor });
  const symbol = plugin.symbol(
    buildSymbolIn({
      meta: {
        category: 'schema',
        path,
        tags,
        ...meta,
      },
      name,
      naming,
      path,
      plugin,
      schema,
    }),
  );

  const docLines = toDocLines(schema.title, schema.description);

  if (node.kind === 'enum') {
    const enumNode = $.enum(symbol)
      .members(...node.members)
      .doc(docLines);
    plugin.node(enumNode);
    return;
  }

  if (node.kind === 'model') {
    // if (plugin.config.modelType === 'BaseModel') {
    //   let baseModelSymbol: Symbol | undefined = plugin.querySymbol(BASE_MODEL_META);
    //   if (!baseModelSymbol) {
    //     baseModelSymbol = plugin.symbol('BaseModel', {
    //       children: [...plugin.imports.BaseModel.children],
    //       meta: BASE_MODEL_META,
    //     });
    //     const baseModel = createBaseModel(plugin, baseModelSymbol);
    //     plugin.node(baseModel);
    //   }
    // }

    const model = $.model(plugin, symbol)
      .doc(docLines)
      .$if(plugin.config.strict, (m) => m.config({ extra: 'forbid' }))
      .$if(node.config, (m, c) => m.config(c))
      .fields(...node.fields);
    for (const baseClass of node.baseClasses ?? []) {
      model.extends(baseClass.type as NodeName);
    }
    plugin.node(model);
    return;
  }

  if (node.kind === 'rootModel') {
    const rootModel = $.rootModel(plugin, symbol)
      .doc(docLines)
      .type(node.type)
      .$if(node.discriminator, (m, d) => m.discriminator(d));
    plugin.node(rootModel);
    return;
  }

  plugin.node($.typeAlias(plugin, symbol, node.type));
}
