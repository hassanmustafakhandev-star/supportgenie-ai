import os
from celery import Celery

# Uses Redis URL from environment or uses default
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Note: Depending on where Celery starts from, the include path might need adjustment.
celery_app = Celery(
    "supportgenie_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=['workers.training_worker'] # Point to the module containing the tasks
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)
