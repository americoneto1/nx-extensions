import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('sveltekit e2e', () => {
  it('should create sveltekit app', async (done) => {
    const plugin = uniq('sveltekit');
    ensureNxProject('@nxext/sveltekit', 'dist/packages/sveltekit');
    await runNxCommandAsync(`generate @nxext/sveltekit:app ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('modules transformed');
    expect(result.stdout).toContain('Build executed...');

    done();
  });

  it('should lint sveltekit app', async (done) => {
    const plugin = uniq('sveltekit');
    ensureNxProject('@nxext/sveltekit', 'dist/packages/sveltekit');
    await runNxCommandAsync(`generate @nxext/sveltekit:app ${plugin}`);

    const result = await runNxCommandAsync(`lint ${plugin}`);
    expect(result.stdout).toContain('All files pass linting');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('sveltekit');
      ensureNxProject('@nxext/sveltekit', 'dist/packages/sveltekit');
      await runNxCommandAsync(
        `generate @nxext/sveltekit:app ${plugin} --directory subdir --linter none`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/src/app.html`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('sveltekit');
      ensureNxProject('@nxext/sveltekit', 'dist/packages/sveltekit');
      await runNxCommandAsync(
        `generate @nxext/sveltekit:app ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
