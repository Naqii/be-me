import { Response } from 'express';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { ReadableStream } from 'stream/web';

type DownloadParams = {
  url: string;
  filename: string;
  res: Response;
};

export const downloadFromCloudinary = async ({
  url,
  filename,
  res,
}: DownloadParams): Promise<void> => {
  const response = await fetch(url);

  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch file (${response.status})`);
  }

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const webStream = response.body as unknown as ReadableStream<Uint8Array>;

  const nodeStream = Readable.fromWeb(webStream);

  await pipeline(nodeStream, res);
};
