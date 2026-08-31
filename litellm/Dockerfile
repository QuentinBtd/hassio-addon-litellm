# renovate: datasource=docker depName=ghcr.io/berriai/litellm
FROM ghcr.io/berriai/litellm:v1.98.0@sha256:20b5044b619055374061a6d5b7b08754cad75aeabbf82ddf4f69cc0cf80ddaf4

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
