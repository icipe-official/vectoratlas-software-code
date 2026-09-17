import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  Logger,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as path from 'path';
import { createReadStream, Stats } from 'fs';
import { access, stat } from 'fs/promises';
import config from 'src/config/config';

@Controller('full-occurrence-data')
export class FullOccurrenceDataController {
  private readonly logger = new Logger(FullOccurrenceDataController.name);

  private getFolderPath(): string {
    return config.get('fullOccurrenceDataFolder');
  }

  @Get('/:file_name')
  async getFile(
    @Param('file_name') fileName: string,
    @Query('ext') extension: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const folderPath = this.getFolderPath();
    const fullFileName = `${fileName}.${extension}`;
    const baseFilePath = path.join(folderPath, fullFileName);

    const acceptEncoding = req.headers['accept-encoding'] || '';

    const compressionMap: Record<string, string> = {
      '.br': 'br',
      '.gz': 'gzip',
    };

    let filePath = baseFilePath;
    let contentEncoding: string | null = null;

    for (const [ext, encoding] of Object.entries(compressionMap)) {
      if (acceptEncoding.includes(encoding)) {
        const compressedPath = `${baseFilePath}${ext}`;
        try {
          await access(compressedPath);
          filePath = compressedPath;
          contentEncoding = encoding;
          break;
        } catch {
          // Compressed variant unavailable
        }
      }
    }

    let fileStats: Stats;
    try {
      fileStats = await stat(filePath);
    } catch (e) {
      this.logger.error(`File not found: ${filePath}`);
      throw new NotFoundException(`File not found: ${fullFileName}`);
    }

    const fileSize = fileStats.size;
    const lastModifiedString = fileStats.mtime.toUTCString();
    // 🟢 Strong ETag (Required for byte-range 206 responses)
    const eTag = `"${fileStats.size}-${fileStats.mtime.getTime()}"`;

    // 1. Browser Caching Validation (304 Not Modified)
    res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate');
    res.setHeader('Last-Modified', lastModifiedString);
    res.setHeader('ETag', eTag);

    const ifNoneMatch = req.headers['if-none-match'];
    const ifModifiedSince = req.headers['if-modified-since'];

    const isEtagMatch = ifNoneMatch === eTag;
    const isDateMatch =
      ifModifiedSince && new Date(ifModifiedSince) >= fileStats.mtime;

    if (isEtagMatch || isDateMatch) {
      return res.status(HttpStatus.NOT_MODIFIED).send();
    }

    // 2. Determine Content-Type
    let contentType = 'application/octet-stream';
    switch (extension.toLowerCase()) {
      case 'json':
        contentType = 'application/json';
        break;
      case 'geojson':
        contentType = 'application/geo+json';
        break;
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('X-Accel-Buffering', 'no');

    if (contentEncoding) {
      res.setHeader('Content-Encoding', contentEncoding);
    }

    // 3. HTTP Range Requests (206 Partial Content)
    // Note: Range requests apply to uncompressed bytes only
    const range = req.headers.range;
    if (range && range.startsWith('bytes=') && !contentEncoding) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const parsedEnd = parseInt(parts[1], 10);
      const end = !isNaN(parsedEnd) && parsedEnd < fileSize ? parsedEnd : fileSize - 1;

      if (start >= fileSize || start > end) {
        res.setHeader('Content-Range', `bytes */${fileSize}`);
        res.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE).send();
        return;
      }

      const chunkSize = end - start + 1;

      res.status(HttpStatus.PARTIAL_CONTENT);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Content-Length', chunkSize);

      const fileStream = createReadStream(filePath, { start, end });
      fileStream.pipe(res);
    } else {
      // 4. Full Download (200 OK)
      res.setHeader('Content-Length', fileSize);
      const fileStream = createReadStream(filePath);
      fileStream.pipe(res);
    }
  }
}
