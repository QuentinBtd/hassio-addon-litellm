# LiteLLM Home Assistant Add-on

Run a pinned, multi-architecture LiteLLM gateway inside Home Assistant:

```text
HA Assist -> native LiteLLM integration -> LiteLLM add-on -> providers
```

The add-on uses LiteLLM's official stable container image and adds only Home
Assistant option handling, persistent state paths, and health monitoring. It
supports any provider LiteLLM supports, including ChatGPT subscription OAuth,
OpenAI API, Anthropic, Gemini, Ollama, and OpenAI-compatible endpoints.

## Installation

1. In Home Assistant, open **Settings > Apps > App store** (called **Add-ons**
   on older releases).
2. Open **Repositories** and add
   `https://github.com/QuentinBtd/hassio-addon-litellm`.
3. Install **LiteLLM**.
4. Set a strong `master_key` beginning with `sk-` and followed by at least 16
   characters, review the LiteLLM YAML, save, and start the add-on.

The API listens on container port `4000`. The host port defaults to `4000` and
can be changed in the add-on's **Network** settings without changing the
LiteLLM configuration.

## Configuration

| Option | Required | Description |
| --- | --- | --- |
| `master_key` | Yes | LiteLLM administrator/API key. It must begin with `sk-` and include at least 16 additional characters. |
| `salt_key` | No | Stable encryption salt needed when LiteLLM stores encrypted credentials in a database. Never change it after use. |
| `log_level` | Yes | `debug`, `info`, `warning`, `error`, or `critical`. Avoid debug logging except while troubleshooting. |
| `litellm_config` | Yes | Raw LiteLLM YAML merged only with the add-on-managed master key setting. |

The default YAML configures `chatgpt/gpt-5.4`. Replace or extend it using the
normal [LiteLLM config format](https://docs.litellm.ai/docs/proxy/configs).
Provider credentials may use LiteLLM's `environment_variables` section. The
option and generated `/data/litellm-config.yaml` must be treated as secrets;
the generated file is mode `0600` and its contents are never logged.
Home Assistant presents `litellm_config` as a plain multiline field, so raw
credentials remain visible to Home Assistant administrators and through the
Supervisor options API. Prefer narrowly scoped provider keys and restrict
administrator access.

Example with several provider types:

```yaml
model_list:
  - model_name: openai-gpt
    litellm_params:
      model: openai/gpt-5
      api_key: os.environ/OPENAI_API_KEY
  - model_name: claude
    litellm_params:
      model: anthropic/claude-sonnet-4-5
      api_key: os.environ/ANTHROPIC_API_KEY
  - model_name: gemini
    litellm_params:
      model: gemini/gemini-2.5-flash
      api_key: os.environ/GEMINI_API_KEY
  - model_name: local-ollama
    litellm_params:
      model: ollama/llama3.2
      api_base: http://192.168.1.20:11434

environment_variables:
  OPENAI_API_KEY: replace-me
  ANTHROPIC_API_KEY: replace-me
  GEMINI_API_KEY: replace-me
```

The add-on deliberately does not translate provider-specific settings. Any
valid LiteLLM top-level section, including `router_settings`,
`litellm_settings`, `general_settings`, and `environment_variables`, can be
entered directly. `general_settings.master_key` is always replaced with the
add-on's protected `master_key` option. The add-on also reserves `HOME`,
`XDG_CACHE_HOME`, `LITELLM_MASTER_KEY`, `LITELLM_SALT_KEY`, `LITELLM_LOG`,
`LITELLM_MODE`, `CHATGPT_TOKEN_DIR`, `CHATGPT_AUTH_FILE`, and
`CONFIG_FILE_PATH`; do not set them in `environment_variables`.

## Home Assistant LiteLLM Integration

Home Assistant 2026.8 or newer includes the native LiteLLM integration.

1. Start the add-on and verify that its log says LiteLLM is listening.
2. Open **Settings > Devices & services > Add integration > LiteLLM**.
3. Enter `http://<HOME_ASSISTANT_IP>:4000` as the URL, substituting the host
   port selected in the add-on Network settings.
4. Enter the configured `master_key` as the API key.
5. Add a conversation agent for one of the discovered models.
6. Select that conversation agent in the Assist pipeline.

For tighter access control, configure LiteLLM's database and create a scoped
virtual key for Home Assistant instead of using the master key.

## ChatGPT Subscription OAuth

LiteLLM supports `chatgpt/*` models for eligible ChatGPT Pro/Max subscriptions
using OAuth device authorization. This is LiteLLM's documented integration;
this add-on does not implement or reverse-engineer OpenAI APIs.

There is no separate login command. With the default configuration,
authentication normally starts while LiteLLM initializes the ChatGPT model:

1. Configure a supported `chatgpt/*` model and start the add-on.
2. Watch the add-on log for the verification URL and device code.
3. Open the URL on another device, sign in, and enter the code within 15
   minutes. LiteLLM finishes startup after authorization.
4. If LiteLLM starts without prompting, send one request to that model to
   trigger the device flow, then watch the log and keep the request open.
5. Retry a timed-out request after authorization completes.

Example request:

```bash
curl http://HOME_ASSISTANT_IP:4000/v1/chat/completions \
  -H 'Authorization: Bearer sk-your-master-key' \
  -H 'Content-Type: application/json' \
  -d '{"model":"chatgpt/gpt-5.4","messages":[{"role":"user","content":"Hello"}]}'
```

During initial enrollment, one LiteLLM worker waits synchronously for device
authorization. When a `chatgpt/*` model is configured, the container allows a
16-minute startup health grace for this flow. Outside that bounded startup
window, health checks use `/health/liveliness` strictly.

LiteLLM stores access, refresh, and ID tokens in
`/data/chatgpt/auth.json` through `CHATGPT_TOKEN_DIR`. Home Assistant preserves
and backs up `/data`, so authorization survives add-on restarts and upgrades.
The token file is a secret. LiteLLM refreshes it as needed. The add-on uses one
worker because the released OAuth implementation uses one process-wide auth
file and does not provide cross-process file locking. Avoid concurrent initial
enrollment requests. Upstream token updates are not atomic, which is also why
the add-on uses cold backups.

The ChatGPT provider is intended primarily for `/v1/responses`; LiteLLM bridges
`/v1/chat/completions` for supported models such as `chatgpt/gpt-5.4`, which is
the endpoint used by Home Assistant. Not every Codex or Pro model supports that
bridge. See the current [LiteLLM ChatGPT provider documentation](https://docs.litellm.ai/docs/providers/chatgpt)
before changing models.

## Persistence And Backups

All add-on-owned runtime state is under `/data`:

| Path | Purpose |
| --- | --- |
| `/data/options.json` | Home Assistant-managed options and secrets |
| `/data/litellm-config.yaml` | Generated effective LiteLLM configuration |
| `/data/chatgpt/auth.json` | ChatGPT OAuth credentials |
| `/data/.cache` | Runtime caches |

The add-on requests cold backups so mutable credentials and any database files
under `/data` are captured consistently. External PostgreSQL or Redis data must
be backed up separately.

## Upgrades

The add-on version controls the GHCR image tag. Releases are automated with
[semantic-release](https://github.com/semantic-release/semantic-release) from
Conventional Commits on `main`. semantic-release updates `config.yaml` and
`CHANGELOG.md`, builds and publishes the versioned multi-architecture image,
and publishes the GitHub Release only after the image succeeds. The release is
kept as a draft while the image builds, so a failed image build never exposes
an unusable release. Each image is built from a
specific LiteLLM stable tag and multi-architecture image digest; rolling
`latest` and `main-latest` tags are never used. Review `CHANGELOG.md`, back up
Home Assistant, and then update normally from the app/add-on store.

LiteLLM is pinned in `Dockerfile`. Dependabot can propose Docker digest/tag
updates, which should be tested before increasing the add-on version in
`config.yaml` and publishing a release. Version changes are normally made by
semantic-release rather than edited manually: `fix:` creates a patch release,
`feat:` creates a minor release, and a `BREAKING CHANGE:` footer creates a
major release. A failed image publication can be retried by manually running
the Build workflow on the release tag with `publish` enabled and the matching
version supplied; that workflow also publishes the pending draft release after
the image succeeds.

## Troubleshooting

- **The integration cannot connect:** confirm the add-on is running, use the
  Home Assistant host address rather than `localhost`, and verify the selected
  host port in Network settings.
- **401 Unauthorized:** use the exact master or virtual key, including its
  `sk-` prefix.
- **No models are discovered:** ensure `model_list` is present and valid in
  `litellm_config`, then inspect the add-on log for a configuration error.
- **ChatGPT request appears stuck:** first authorization waits for device-flow
  completion. Read the add-on log and complete the URL/code flow within 15
  minutes.
- **ChatGPT authorization repeats after an upgrade:** verify the log does not
  report a permissions error for `/data/chatgpt/auth.json`; do not manually
  move the token outside `/data`.
- **Health checks fail:** `/health/liveliness` does not call providers or spend
  tokens. Check startup errors rather than testing `/health`, which performs
  real model calls and can incur provider charges.
- **Database-backed credentials stop decrypting:** restore the original
  `salt_key`. It must remain stable for the lifetime of encrypted data.

Enabling debug logging can expose request details. Revert to `info` or a less
verbose level after diagnosis.
