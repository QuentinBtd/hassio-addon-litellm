# Changelog

## 1.0.0

- Initial Home Assistant add-on release.
- Use the pinned official LiteLLM stable image for amd64 and aarch64.
- Persist generated configuration, caches, and ChatGPT OAuth credentials under
  `/data`.
- Add LiteLLM liveness checks and direct PID 1 signal handling.
