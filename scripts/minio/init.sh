#!/bin/sh
set -e
mc alias set local http://minio:${MINIO_PORT:-9000} ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}
mc mb -p local/${S3_BUCKET_EVIDENCE:-evidence} || true
mc mb -p local/${S3_BUCKET_REPORTS:-reports} || true
mc anonymous set none local/${S3_BUCKET_EVIDENCE:-evidence}
mc anonymous set none local/${S3_BUCKET_REPORTS:-reports}
echo "MinIO buckets initialized"
