# Changelog
Starting with v0.7.0, this changelog will be maintained to describe notable changes to the project.

Until v1.0.0, expect breaking changes between minor version bumps.

## [0.9.0] - 2024-02-20
### Changed
- Removes Yarn support in favor of npm, since that does the trick these days.
- Upgrades most dependencies to make this compatiable with React 18.2.
- Migrates from Enzyme to RTL for component testing.
- Updates some lib files for buildability with latest TypeScript version.
- Updates README with important info regarding this library.

## [0.8.6] - 2020-12-31
### Changed
- Fixes the `Logger` class for context outputs to search for constructors starting with `function` _and_ `class`.
- Update to `SrComponentStateHelpers` to return an appropriate `Promise<TState>` from all paths in `setAsync`.
- Happy New Year! Goodbye, 2020!

## [0.8.5] - 2020-01-13
### Changed
- Adds optional and default batching to the `SrComponentStateHelpers.setPartial` function.

## [0.8.4] - 2020-01-11
### Changed
- Update `SrUiComponent.setRef` to have a generic argument, which supports a new optional callback argument passed to `SrUiComponent.assignRef`
- Update `SrUiComponent.assignRef` to have a generic argument and to accept an optional callback that is called (if present) when a ref is set and `assignRef` is called.
- These updates allow finer-grained control over application behavior when a ref is set, while still benefiting from the once-created function created by `setRef`.

## [0.8.3] - 2020-01-05
### Changed
- Add optional chaining to all `SrUiComponent.stateHelper` calls for runtime safety when state calls are made during component teardown.

## [0.8.2] - 2019-12-04
### Changed
- Update `asObject` to exclude empty query parameters from parsing.

## [0.8.1] - 2019-11-22
### Changed
- Fix `asObject` to decode URI components from the query string.

## [0.8.0] - 2019-11-22
### Changed
- Adds new common app message, `CommonMessages.AppLaunch`
- Core application awaits final initialization until applications built on top of Strontium broadcast `CommonMessages.AppLaunch`, providing tighter control to developers to set up the environment prior to final UI initialization.

## [0.7.1] - 2019-07-31
### Changed
- Adds the ability to disable encoding of query parameters when using the `buildQuery` function (defaults to `true`).

## [0.7.0] - 2019-05-25
### Changed
- Removed `componentWillReceiveProps` lifecycle from `SrUiComponent`, per recommendation from [UNSAFE_componentWillReceiveProps documentation](https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops).
- Added `componentDidUpdate` lifecycle to `SrUiComponent`.
- Changed `SrUiComponent.onNewProps(props: P)` to `SrUiComponent.onUpdated(prevProps: Readonly<P>, prevState: Readonly<S>)`, called when `componentDidUpdate` is invoked.
  - **Migration strategy**: `onNewProps` implemented on derviced classes should be updated to `onUpdated`, with the new signature, and logic should be modified to read from the component's current props as the *new* state and the `prevProps` argument to `onUpdated` as the *previous* state.