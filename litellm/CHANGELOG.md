## [1.1.0](https://github.com/QuentinBtd/hassio-addon-litellm/compare/v1.0.0...v1.1.0) (2026-09-01)

### Features

* automate releases with semantic-release ([434ead1](https://github.com/QuentinBtd/hassio-addon-litellm/commit/434ead1d54e7122f53d2018f25f309aab71e7ff7))

### Bug Fixes

* use compatible conventional changelog preset ([553b13e](https://github.com/QuentinBtd/hassio-addon-litellm/commit/553b13ed74fc55a120562675141d3aefd69270bf))

# Changelog

## 1.0.0

- Initial Home Assistant add-on release.
- Use the pinned official LiteLLM stable image for amd64 and aarch64.
- Persist generated configuration, caches, and ChatGPT OAuth credentials under
  `/data`.
- Add LiteLLM liveness checks and direct PID 1 signal handling.
