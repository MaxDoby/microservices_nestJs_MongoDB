export default {
  input: 'tmp/openapi/api-gateway.openapi.json',
  output: {
    path: 'libs/generated-api/src/lib',
    postProcess: ['prettier'],
  },
  plugins: [
    {
      name: '@hey-api/typescript',
      style: 'PascalCase',
    },
    {
      name: 'zod',
      exportFromIndex: true,
    },
  ],
};
