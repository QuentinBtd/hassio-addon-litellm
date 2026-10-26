# renovate: datasource=docker depName=ghcr.io/berriai/litellm
# v1.90.0+ breaks non-streaming chatgpt/* requests; see LiteLLM #34094/#34095.
FROM ghcr.io/berriai/litellm:v1.106.4@sha256:c169fb3adc514fcf210377c203f3de406d54f10bfdacf13948a4a839db9af7de

ARG BUILD_VERSION=dev

LABEL \
    io.hass.version="${BUILD_VERSION}" \
    io.hass.type="app" \
    io.hass.arch="aarch64|amd64" \
    org.opencontainers.image.source="https://github.com/QuentinBtd/hassio-addon-litellm" \
    org.opencontainers.image.description="LiteLLM Home Assistant add-on"

ENV HOME=/data \
    XDG_CACHE_HOME=/data/.cache \
    LITELLM_MODE=PRODUCTION \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY rootfs /

RUN chmod 0755 /usr/local/bin/start-litellm /usr/local/bin/litellm-healthcheck

EXPOSE 4000/tcp

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD ["/usr/local/bin/litellm-healthcheck"]

ENTRYPOINT ["/usr/local/bin/start-litellm"]
