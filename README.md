# Strontium

A boilerplate TypeScript and React framework usable for SPAs that (as of 2018-Jan-10) is in its infancy, but relatively usable.

This project is built against React v16, and is usable with the current version of React (v16.2, as of this writing).

Some notes, which will change over time as this project progresses and matures:

* Testing is present, via Jest and Enzyme, but test coverage is still needs improvement.  Tests will be a major focus going forward, and will play a significant role in refactoring the code for readability, testability, and usability.
* This project has added features available to it, if React Transition Group, Bootstrap, and React-Bootstrap components are incorporated into your build process or included via `script` tags in your application.
* React itself is not a dependency of this project.  That is intentional, and left up to you to decide how to integrate.
* TypeScript definitions for all classes and modules are included in the package, allowing you to import this project and utilize it in other TypeScript projects.

## Building Locally

1. Clone the repo
1. Install dependencies via yarn: `yarn install`
1. Run tests: `yarn run test`
1. Build output: `yarn run build`

## Project Use

This package is currently deployed to npm as *react-strontium* package.  APIs have changed significantly between tagged alpha versions, and will continue changing until stabilized at v1.

More to come later, on actual usage.
