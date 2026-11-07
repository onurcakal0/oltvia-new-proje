"""Basit, bağımlılıksız in-memory rate limiter.

Not: Sayaçlar süreç belleğinde tutulur. Birden fazla worker/sunucu ile çalışıldığında
sayaçlar paylaşılmaz; production ölçeğinde Redis tabanlı bir limiter'a taşınmalıdır.
"""
import threading
import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request, status


class RateLimiter:
    def __init__(self) -> None:
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def hit(self, key: str, limit: int, window_seconds: int) -> bool:
        """İsteği kaydeder; limit aşıldıysa False döner."""
        now = time.monotonic()
        cutoff = now - window_seconds
        with self._lock:
            bucket = self._hits[key]
            while bucket and bucket[0] <= cutoff:
                bucket.popleft()
            if len(bucket) >= limit:
                return False
            bucket.append(now)
            # Bellek temizliği: boş kovaları zaman zaman sil
            if len(self._hits) > 10_000:
                for k in [k for k, v in self._hits.items() if not v]:
                    del self._hits[k]
            return True

    def reset(self) -> None:
        with self._lock:
            self._hits.clear()


limiter = RateLimiter()


def client_ip(request: Request) -> str:
    # Reverse proxy arkasında çalışılıyorsa uvicorn `--proxy-headers --forwarded-allow-ips`
    # ile çalıştırılmalıdır; X-Forwarded-For burada doğrudan güvenilmez.
    return request.client.host if request.client else "unknown"


def enforce(key: str, limit: int, window_seconds: int) -> None:
    if not limiter.hit(key, limit, window_seconds):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Çok fazla deneme yaptınız. Lütfen bir süre sonra tekrar deneyiniz.",
            headers={"Retry-After": str(window_seconds)},
        )
