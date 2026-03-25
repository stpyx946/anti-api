# WinGet Packaging

This directory is for Anti-API's Windows Package Manager distribution pipeline.

What lives in the repository:

- `scripts/build-winget-package.ts` builds a Windows portable bundle directory with:
  - `anti-api.exe`
  - `anti-proxy.exe`
  - `public/`
- `scripts/update-winget-manifest.ts` generates WinGet manifests after the zip and SHA256 are ready.
- `scripts/sync-winget-pkgs.sh` copies the generated manifests into a local fork of `microsoft/winget-pkgs`.
- `.github/workflows/windows-winget-package.yml` builds the Windows zip on GitHub Actions and can upload it to a release.

Recommended release flow:

1. Publish a new Anti-API release tag.
2. Run the `windows-winget-package` workflow with `upload_to_release=true`.
3. Generate manifests with:
   - `bun run winget:manifest -- --version <version> --sha256 <sha256>`
4. Sync the generated manifests into a `winget-pkgs` fork:
   - `bun run winget:sync -- /path/to/winget-pkgs <version>`
5. Submit the manifest PR to `microsoft/winget-pkgs`.

After the PR is merged, users can install with:

```powershell
winget install anti-api
```

After installation, users should be able to open any terminal and run:

```powershell
anti-api
```
