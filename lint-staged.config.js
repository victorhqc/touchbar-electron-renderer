module.exports = () => ({
  '*.ts': ['prettier --config ./.prettierrc.json --write', 'eslint --fix', 'git add'],
  'package.json': ['git add'],
});
