# LiteLLM

This add-on runs the official LiteLLM gateway image and persists configuration,
caches, and OAuth credentials for ChatGPT and GitHub Copilot under `/data`.

Set a strong `master_key`, configure models with native LiteLLM YAML in
`litellm_config`, and use `http://<HOME_ASSISTANT_IP>:4000` with Home
Assistant's native LiteLLM integration. The host-side port can be changed in
the add-on Network settings.

For provider examples, ChatGPT and GitHub Copilot device authorization
instructions, persistence, upgrades, and troubleshooting, see the complete
[add-on documentation](https://github.com/QuentinBtd/hassio-addon-litellm/blob/main/litellm/README.md).
