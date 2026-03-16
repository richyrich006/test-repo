"""
notifier.py — Send trade alerts via a Discord or Slack webhook.

Set WEBHOOK_URL in your .env to enable. Leave it blank to disable silently.

Discord: Server Settings → Integrations → Webhooks → Copy Webhook URL
Slack:   https://api.slack.com/messaging/webhooks
"""

import logging

import requests

import config

logger = logging.getLogger(__name__)


def notify(message: str) -> None:
    """Post *message* to the configured webhook. No-ops if WEBHOOK_URL is unset."""
    if not config.WEBHOOK_URL:
        return
    try:
        resp = requests.post(
            config.WEBHOOK_URL,
            json={"content": message},
            timeout=5,
        )
        resp.raise_for_status()
    except Exception as exc:
        logger.warning("Webhook notification failed: %s", exc)
