# CONTRIBUTING

This guide is for anyone who wants to contribute to the Webiny project.

## Working on an issue

> IMPORTANT: Before working on a PR, please open an issue and discuss your intended changes with the maintainers. They may provide invaluable info and point you in the right direction to get the most out of your contribution.

### Branches

`master` is the main branch from which we publish packages. All `issue` branches should be branched from `master` branch, unless you're working on an issue that belongs to one of our [projects](https://github.com/webiny/webiny-js/projects). In that case, a project branch will be specified in the project board. If you're not sure about the branch, don't hesitate to contact us.

### Features/Fixes

- create an issue branch
- commit your changes
- open a PR
- try to keep your PRs small in scope (try to only work on 1 issue in a single PR)
- you can add as many commits as you wish to your PR
- the only commit message that matters is the PR merge commit, and that is handled by the project maintainers

## Repo overview

Once you clone the repository, you will have a monorepo which consists of a bunch of different packages, located in `/packages` and `/components` directory.

- `components` folder contains `serverless` components that are responsible for deployment of your infrastructure.
- `packages` folder contains app packages, api packages, utility packages, etc.

Packages prefixed with `app-` are React apps. The ones with the `api-` prefix are API plugins. All the other packages are utility packages.

`examples` folder is the place that simulates a project structure of a project created using `@webiny/cli`. This is your development sandbox.

## Prerequisites

1. Node `10.14` or higher

2. `yarn 1.0` or higher (because our project setup uses workspaces).
   If you don't already have `yarn`, visit [yarnpkg.com](https://yarnpkg.com/en/docs/install) to install it.

3. Webiny uses MongoDB as its go-to database, so you'll need to have one ready. We recommend [Mongo Atlas](https://docs.atlas.mongodb.com/getting-started/) (there is a free tier for developers, so don't worry about having to pay for anything).

## Local setup

1. Fork and clone the repo

2. Install all dependencies:

   ```
   yarn
   ```

3. Run `sudo yarn setup-repo`. This will setup all the necessary environment config files and build the necessary packages. You need to manually update the DB connection string, edit your `examples/api/.env.json` file.

4. Deploy you API to use with local React apps by running `webiny deploy-api` from the `examples` folder. Once deployed, it will automatically update you React apps' `.env.json` files with the necessary variables.

> NOTE: `webiny` should be run from the root of the Webiny project, and since `examples` folder is a `sandbox`, this is the place to run your `webiny` commands from.

5. Begin working on React apps by navigating to `examples/apps/{admin|site}` and run `yarn start`. React apps are regular `create-react-app` apps, slightly modified, but all the CRA rules apply.

## Tests

You can find examples of tests in some of the utility packages (`validation`, `i18n`, `plugins`).

`api-files` contains an example of testing your GraphQL API.

We'll be strongly focusing on tests in the near future, and of course contributions of tests are most welcome :)

## Release notes
This section is mostly intended for project owners, since they are the ones who can cut a release, but it is nice for contributors to be aware of how things work. 

> NOTE: this process represents our current way of developing, and it MAY and most probably WILL change in the future, as the community and number of contributions grow.

We use `lerna` to publish our packages in the `independent` mode, using `conventional-commits`.
Each package MUST have a `prepublishOnly` script which creates a build ready to be published to `npm` in the `dist` folder.

Since we use `@webiny` scope, each package that is intended for `npm` MUST have a `"publishConfig": {"access": "public"}` in its `package.json`.

At this point CI is not integrated, as we want to manually review and publish each release. This will also be automated as the 
project advances and we add more tests for a reliable CI workflow.

### Release process
This is the safest approach as you get a chance to review packages before each step, and particularly before publishing to `npm`.

```
// Validate package.json structure of each package
yarn validate-packages

// Fetch all tags from origin
git fetch

// Create github tags and release
GH_TOKEN=xyz lerna version

// Publish to NPM
NPM_TOKEN=xyz lerna publish from-package
```

If `lerna publish from-package` fails along the way, you can fix whatever the issue was and re-run the step, as it is publishing packages from local package folders, so published packages will not be re-published.
