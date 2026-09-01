## [1.2.0](https://github.com/QuentinBtd/hassio-addon-litellm/compare/v1.1.2...v1.2.0) (2026-09-01)

### Features

* enable GitHub Copilot OAuth ([5ee9d12](https://github.com/QuentinBtd/hassio-addon-litellm/commit/5ee9d1212d3eacaefcbc651d7241bb0dd518c9e1))

## [1.1.2](https://github.com/QuentinBtd/hassio-addon-litellm/compare/v1.1.1...v1.1.2) (2026-09-01)

### Bug Fixes

* restore ChatGPT non-streaming support ([a1d2e11](https://github.com/QuentinBtd/hassio-addon-litellm/commit/a1d2e11a87b04c2bf1a695973f53ae342313eb26))

## [1.1.1](https://github.com/QuentinBtd/hassio-addon-litellm/compare/v1.1.0...v1.1.1) (2026-09-01)

### Bug Fixes

* normalize workflow publish input ([f567e3f](https://github.com/QuentinBtd/hassio-addon-litellm/commit/f567e3fafb082d0393d2940871150ab84f70a580))

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
