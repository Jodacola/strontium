# Changelog
Starting with v0.7.0, this changelog will be maintained to describe notable changes to the project.

Until v1.0.0, expect breaking changes between minor version bumps.

## [0.7.0] - 2019-05-25
### Changed
- Removed `componentWillReceiveProps` lifecycle from `SrUiComponent`, per recommendation from [UNSAFE_componentWillReceiveProps documentation](https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops).
- Added `componentDidUpdate` lifecycle to `SrUiComponent`.
- Changed `SrUiComponent.onNewProps(props: P)` to `SrUiComponent.onUpdated(prevProps: Readonly<P>, prevState: Readonly<S>)`, called when `componentDidUpdate` is invoked.
  - **Migration strategy**: `onNewProps` implemented on derviced classes should be updated to `onUpdated`, with the new signature, and logic should be modified to read from the component's current props as the *new* state and the `prevProps` argument to `onUpdated` as the *previous* state.