import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  // Cliente S3 compatível com MinIO (path-style para ambiente local).
  private client = new S3Client({
    endpoint: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
    forcePathStyle: true,
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
  });

  // Guarda objecto de evidência/report no bucket definido.
  async putObject(bucket: string, key: string, body: string, contentType: string) {
    await this.client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
    return `s3://${bucket}/${key}`;
  }

  // Lê objecto para processamento interno (normalização/enriquecimento).
  async getObjectAsString(bucket: string, key: string) {
    const out = await this.client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    return out.Body?.transformToString() ?? '';
  }
}
