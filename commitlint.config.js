module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-prefix': [2, 'always', ['ompblink-', 'OMPBLINK-']],
  },
  plugins: [
    {
      rules: {
        'scope-prefix': (parsed, when = 'always', value = []) => {
          if (!parsed.scope) {
            return [false, `scope must start with [${value.join(', ')}]`];
          }

          // only use comma sign as seperator
          const scopeSegments = parsed.scope.split(',');

          const check = (value, valueArr) => {
            if (value === undefined) {
              return false;
            }
            if (!Array.isArray(valueArr)) {
              return false;
            }
            return valueArr.findIndex((v) => value.startsWith(v)) > -1;
          };

          const negated = when === 'never';
          const result = value.length === 0 || scopeSegments.every((scope) => check(scope, value));

          return [negated ? !result : result, `scope must ${negated ? `not` : null} start with [${value.join(', ')}]`];
        },
      },
    },
  ],
};
