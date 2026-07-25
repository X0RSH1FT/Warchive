# Provisioning a secret token for ArcaneCore to fetch private ActionPlan dependencies

Recommendation: repository secret is the better fit for this case.

## Purpose
- Allow ArcaneCore CI to fetch private contents from X0RSH1FT/ActionPlan during builds.
- The credential must support cross-repository read access.

## Credential choice
- Use a GitHub App token if ArcaneCore already uses app-based automation.
- Otherwise use a fine-grained PAT scoped to the ActionPlan repository.
- Avoid classic PATs for new setups unless there is no viable alternative.

## Minimum permissions
- Grant read-only access to repository contents on X0RSH1FT/ActionPlan.
- Add package read access only if the dependency is fetched through GitHub Packages instead of git.

## Where to store it
- Default: store as a repository secret on ArcaneCore.
- Alternative: use an organization secret only if the same credential must be shared across multiple repositories.

## When to use an environment secret
- Use an environment secret only when the job needs environment protection rules or approval gates.
- Environment secrets add control, but they are not required for a simple pre-install dependency fetch.

## Naming recommendation
- Use ACTION_PLAN_TOKEN as the secret name.

## Minimal workflow example
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure git auth for private dependencies
        run: |
          printf "machine github.com\nlogin x-access-token\npassword ${{ secrets.ACTION_PLAN_TOKEN }}\n" > ~/.netrc
          chmod 600 ~/.netrc

      - name: Install dependencies
        run: |
          uv sync --all-groups --all-extras
          uv pip install -e .
```

## Caveats
- Least privilege: grant the minimum read-only access required.
- Expiration and rotation: prefer tokens with an expiration date and a rotation plan.
- Cross-repository access: the token must be able to read X0RSH1FT/ActionPlan.
- GitHub Actions `GITHUB_TOKEN` is insufficient for this cross-repository private fetch.

## References
- Encrypted secrets for GitHub Actions
- Managing secrets for repositories, organizations, and environments
- About the GITHUB_TOKEN
- Creating a personal access token
