import { applyNaming, resolveNaming, toCase } from '../naming';
import type { Casing, NamingConfig } from '../types';

const cases: ReadonlyArray<Casing> = [
  'camelCase',
  'PascalCase',
  'SCREAMING_SNAKE_CASE',
  'snake_case',
];

const scenarios: ReadonlyArray<{
  PascalCase: string;
  SCREAMING_SNAKE_CASE: string;
  camelCase: string;
  snake_case: string;
  stripLeadingSeparators?: boolean;
  value: string;
}> = [
  {
    PascalCase: 'FooDtoById',
    SCREAMING_SNAKE_CASE: 'FOO_DTO_BY_ID',
    camelCase: 'fooDtoById',
    snake_case: 'foo_dto_by_id',
    value: 'fooDTOById',
  },
  {
    PascalCase: 'FooDtos',
    SCREAMING_SNAKE_CASE: 'FOO_DTOS',
    camelCase: 'fooDtos',
    snake_case: 'foo_dtos',
    value: 'fooDTOs',
  },
  {
    PascalCase: 'FooDtosById',
    SCREAMING_SNAKE_CASE: 'FOO_DTOS_BY_ID',
    camelCase: 'fooDtosById',
    snake_case: 'foo_dtos_by_id',
    value: 'fooDTOsById',
  },
  {
    PascalCase: 'DtoById',
    SCREAMING_SNAKE_CASE: 'DTO_BY_ID',
    camelCase: 'dtoById',
    snake_case: 'dto_by_id',
    value: 'DTOById',
  },
  {
    PascalCase: 'Dtos',
    SCREAMING_SNAKE_CASE: 'DTOS',
    camelCase: 'dtos',
    snake_case: 'dtos',
    value: 'DTOs',
  },
  {
    PascalCase: 'DtosById',
    SCREAMING_SNAKE_CASE: 'DTOS_BY_ID',
    camelCase: 'dtosById',
    snake_case: 'dtos_by_id',
    value: 'DTOsById',
  },
  {
    PascalCase: 'SomeJsonFile',
    SCREAMING_SNAKE_CASE: 'SOME_JSON_FILE',
    camelCase: 'someJsonFile',
    snake_case: 'some_json_file',
    value: 'SOME_JSON_FILE',
  },
  {
    PascalCase: 'SomeJsonsFile',
    SCREAMING_SNAKE_CASE: 'SOME_JSONS_FILE',
    camelCase: 'someJsonsFile',
    snake_case: 'some_jsons_file',
    value: 'SOME_JSONs_FILE',
  },
  {
    PascalCase: 'PostHtmlGuide',
    SCREAMING_SNAKE_CASE: 'POST_HTML_GUIDE',
    camelCase: 'postHtmlGuide',
    snake_case: 'post_html_guide',
    value: 'postHTMLGuide',
  },
  {
    PascalCase: 'PostHtmlScale',
    SCREAMING_SNAKE_CASE: 'POST_HTML_SCALE',
    camelCase: 'postHtmlScale',
    snake_case: 'post_html_scale',
    value: 'postHTMLScale',
  },
  {
    PascalCase: 'SnakeCase',
    SCREAMING_SNAKE_CASE: 'SNAKE_CASE',
    camelCase: 'snakeCase',
    snake_case: 'snake_case',
    value: 'snake_case',
  },
  {
    PascalCase: 'CamelCase',
    SCREAMING_SNAKE_CASE: 'CAMEL_CASE',
    camelCase: 'camelCase',
    snake_case: 'camel_case',
    value: 'camelCase',
  },
  {
    PascalCase: 'PascalCase',
    SCREAMING_SNAKE_CASE: 'PASCAL_CASE',
    camelCase: 'pascalCase',
    snake_case: 'pascal_case',
    value: 'PascalCase',
  },
  {
    PascalCase: 'IsXRated',
    SCREAMING_SNAKE_CASE: 'IS_X_RATED',
    camelCase: 'isXRated',
    snake_case: 'is_x_rated',
    value: 'isXRated',
  },
  {
    PascalCase: 'IsHtmlSafe',
    SCREAMING_SNAKE_CASE: 'IS_HTML_SAFE',
    camelCase: 'isHtmlSafe',
    snake_case: 'is_html_safe',
    value: 'isHTMLSafe',
  },
  {
    PascalCase: 'MyAspirations',
    SCREAMING_SNAKE_CASE: 'MY_ASPIRATIONS',
    camelCase: 'myAspirations',
    snake_case: 'my_aspirations',
    value: 'MyAspirations',
  },
  {
    PascalCase: 'IoK8sApimachineryPkgApisMetaV1DeleteOptions',
    SCREAMING_SNAKE_CASE: 'IO_K8S_APIMACHINERY_PKG_APIS_META_V1_DELETE_OPTIONS',
    camelCase: 'ioK8sApimachineryPkgApisMetaV1DeleteOptions',
    snake_case: 'io_k8s_apimachinery_pkg_apis_meta_v1_delete_options',
    value: 'io.k8sApimachinery.pkg.apis.meta:v1.DeleteOptions',
  },
  {
    PascalCase: 'GenericSchemaDuplicateIssue1SystemBoolean',
    SCREAMING_SNAKE_CASE: 'GENERIC_SCHEMA_DUPLICATE_ISSUE_1_SYSTEM_BOOLEAN',
    camelCase: 'genericSchemaDuplicateIssue1SystemBoolean',
    snake_case: 'generic_schema_duplicate_issue_1_system_boolean',
    value: 'Generic.Schema.Duplicate.Issue`1[System.Boolean]',
  },
  {
    PascalCase: 'GetApiVApiVersionUsersUserIdLocationLocationId',
    SCREAMING_SNAKE_CASE: 'GET_API_V_API_VERSION_USERS_USER_ID_LOCATION_LOCATION_ID',
    camelCase: 'getApiVApiVersionUsersUserIdLocationLocationId',
    snake_case: 'get_api_v_api_version_users_user_id_location_location_id',
    value: 'GET /api/v{api-version}/users/{userId}/location/{locationId}',
  },
  {
    PascalCase: 'IPhoneS',
    SCREAMING_SNAKE_CASE: 'I_PHONE_S',
    camelCase: 'iPhoneS',
    snake_case: 'i_phone_s',
    value: 'iPhone S',
  },
  {
    PascalCase: '-100',
    SCREAMING_SNAKE_CASE: '-100',
    camelCase: '-100',
    snake_case: '-100',
    stripLeadingSeparators: false,
    value: '-100',
  },
  {
    PascalCase: 'MyFoo',
    SCREAMING_SNAKE_CASE: 'MY_FOO',
    camelCase: 'myFoo',
    snake_case: 'my_foo',
    stripLeadingSeparators: false,
    value: 'MyFoo',
  },
  {
    PascalCase: 'ExperimentalOver200K',
    SCREAMING_SNAKE_CASE: 'EXPERIMENTAL_OVER200K',
    // SCREAMING_SNAKE_CASE: 'EXPERIMENTAL_OVER_200K',
    camelCase: 'experimentalOver200K',
    snake_case: 'experimental_over200k',
    // snake_case: 'experimental_over_200k',
    value: 'experimentalOver200K',
  },
  {
    PascalCase: 'ModelCostExperimentalOver200kCache',
    // PascalCase: 'ModelCostExperimentalOver200KCache',
    SCREAMING_SNAKE_CASE: 'MODEL_COST_EXPERIMENTAL_OVER200K_CACHE',
    // SCREAMING_SNAKE_CASE: 'MODEL_COST_EXPERIMENTAL_OVER_200K_CACHE',
    camelCase: 'modelCostExperimentalOver200kCache',
    // camelCase: 'modelCostExperimentalOver200KCache',
    snake_case: 'model_cost_experimental_over200k_cache',
    // snake_case: 'model_cost_experimental_over_200k_cache',
    value: 'ModelCostExperimentalOver200KCache',
  },
  {
    PascalCase: 'Z3eNum1Период',
    SCREAMING_SNAKE_CASE: 'Z3E_NUM_1_ПЕРИОД',
    camelCase: 'z3eNum1Период',
    snake_case: 'z3e_num_1_период',
    value: 'z3e-num_1Период',
  },
  {
    PascalCase: 'ShowTheDogSTail',
    SCREAMING_SNAKE_CASE: 'SHOW_THE_DOG_S_TAIL',
    camelCase: 'showTheDogSTail',
    snake_case: 'show_the_dog_s_tail',
    value: "show the dog's tail",
  },
];

describe('toCase', () => {
  describe.each(cases)('%s', (casing) => {
    switch (casing) {
      case 'PascalCase':
        it.each(scenarios)(
          '$value -> $PascalCase',
          ({ PascalCase, stripLeadingSeparators, value }) => {
            expect(toCase(value, casing, { stripLeadingSeparators })).toBe(PascalCase);
          },
        );
        break;
      case 'camelCase':
        it.each(scenarios)(
          '$value -> $camelCase',
          ({ camelCase, stripLeadingSeparators, value }) => {
            expect(toCase(value, casing, { stripLeadingSeparators })).toBe(camelCase);
          },
        );
        break;
      case 'SCREAMING_SNAKE_CASE':
        it.each(scenarios)(
          '$value -> $SCREAMING_SNAKE_CASE',
          ({ SCREAMING_SNAKE_CASE, stripLeadingSeparators, value }) => {
            expect(toCase(value, casing, { stripLeadingSeparators })).toBe(SCREAMING_SNAKE_CASE);
          },
        );
        break;
      case 'snake_case':
        it.each(scenarios)(
          '$value -> $snake_case',
          ({ snake_case, stripLeadingSeparators, value }) => {
            expect(toCase(value, casing, { stripLeadingSeparators })).toBe(snake_case);
          },
        );
        break;
    }
  });
});

describe('resolveNaming', () => {
  it('returns empty object for undefined', () => {
    expect(resolveNaming(undefined)).toEqual({});
  });

  it('wraps a template string into { name }', () => {
    expect(resolveNaming('z{{name}}')).toEqual({ name: 'z{{name}}' });
  });

  it('wraps a function into { name }', () => {
    const fn = (name: string) => `z${name}`;
    expect(resolveNaming(fn)).toEqual({ name: fn });
  });

  it('passes through a NamingConfig object unchanged', () => {
    const config: NamingConfig = { casing: 'camelCase', name: 'z{{name}}' };
    expect(resolveNaming(config)).toBe(config);
  });

  it('passes through a NamingConfig with deprecated case field unchanged', () => {
    const config: NamingConfig = { case: 'PascalCase' };
    expect(resolveNaming(config)).toBe(config);
  });
});

describe('applyNaming', () => {
  describe('no-op cases', () => {
    it('returns value unchanged when config is empty', () => {
      expect(applyNaming('myValue', {})).toBe('myValue');
    });

    it('preserves casing when casing is preserve', () => {
      expect(applyNaming('myValue', { casing: 'preserve' })).toBe('myValue');
    });
  });

  describe('casing only', () => {
    it('applies camelCase', () => {
      expect(applyNaming('my-value', { casing: 'camelCase' })).toBe('myValue');
    });

    it('applies PascalCase', () => {
      expect(applyNaming('my-value', { casing: 'PascalCase' })).toBe('MyValue');
    });

    it('applies snake_case', () => {
      expect(applyNaming('myValue', { casing: 'snake_case' })).toBe('my_value');
    });

    it('applies SCREAMING_SNAKE_CASE', () => {
      expect(applyNaming('myValue', { casing: 'SCREAMING_SNAKE_CASE' })).toBe('MY_VALUE');
    });

    it('respects deprecated case field', () => {
      expect(applyNaming('my-value', { case: 'PascalCase' })).toBe('MyValue');
    });

    it('casing takes precedence over deprecated case', () => {
      expect(applyNaming('my-value', { case: 'PascalCase', casing: 'camelCase' })).toBe('myValue');
    });
  });

  describe('name template', () => {
    it('substitutes {{name}} with value', () => {
      expect(applyNaming('value', { name: 'z{{name}}' })).toBe('zvalue');
    });

    it('applies casing after template substitution', () => {
      expect(applyNaming('my-value', { casing: 'camelCase', name: 'z{{name}}' })).toBe('zMyValue');
    });

    it('handles leading-digit name after prefix', () => {
      expect(applyNaming('3e-num_1Период', { casing: 'camelCase', name: 'z{{name}}' })).toBe(
        'z3eNum1Период',
      );
    });

    it('handles {{name}} in the middle of template', () => {
      expect(applyNaming('value', { casing: 'camelCase', name: 'pre{{name}}Post' })).toBe(
        'preValuePost',
      );
    });

    it('handles {{name}} with no surrounding text', () => {
      expect(applyNaming('my-value', { casing: 'camelCase', name: '{{name}}' })).toBe('myValue');
    });
  });

  describe('name function', () => {
    it('applies function transformer', () => {
      expect(applyNaming('value', { name: (n) => `z${n}` })).toBe('zvalue');
    });

    it('applies casing after function transformer', () => {
      expect(applyNaming('my-value', { casing: 'camelCase', name: (n) => `z${n}` })).toBe(
        'zmyValue',
      );
    });

    it('function returning empty string produces empty string', () => {
      expect(applyNaming('value', { name: () => '' })).toBe('');
    });
  });
});
