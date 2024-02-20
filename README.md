# Strontium

## ⚠️⚠️⚠️
2024-02-20: This library is super outdated! It was a pet project of mine for a few years, several years ago, and I've not maintained it since, aside from a few updates I just pushed today. Please do not expect further updates to this library from me.

If you find it useful and want to fork it or continue contributing here, I'll pop my head in every once in a while, but a few words:

* React has changed a lot since I wrote this library, and I don't personally use class components anymore, nor do I recommend them.
* When I originally wrote this, I blazed past all sorts of TypeScript best practices, which means the definitions and such provided by the distribution of this library are... wanting. Tread with caution.
* The library contains a lot of cruft from unfinished projects within the code, so be prepared for some headscratchers if you dive in.

All that said, I enjoyed working on this project, and if it's helped you with anything, then I'm very happy! You're welcome to message in the Issues tracker if I can help with anything, but, again, I won't be contributing anything further to this library.

Thank you!

## Overview

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
