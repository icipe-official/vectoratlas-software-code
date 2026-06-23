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
import { Response } from 'express';
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

    // Get accepted encodings from the request headers
    const acceptEncoding = res.req.headers['accept-encoding'] || '';

    // Supported compression extensions and their content-encoding values
    const compressionMap: Record<string, string> = {
      '.br': 'br',
      '.gz': 'gzip',
    };

    // Try to find a compressed version that matches the accepted encoding
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
          // File doesn't exist, try next encoding
        }
      }
    }

    // If no compressed version found or accepted, use the original file
    if (!contentEncoding) {
      filePath = baseFilePath;
    }

    // Get file stats and check existence
    let fileStats: Stats;
    try {
      fileStats = await stat(filePath);
    } catch (e) {
      this.logger.error(`File not found: ${filePath}`);
      throw new NotFoundException(`File not found: ${fullFileName}`);
    }

    const lastModifiedString = fileStats.mtime.toUTCString();
    const eTag = `W/"${fileStats.size}-${fileStats.mtime.getTime()}"`;

    // Set standard Cache-Control headers
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    res.setHeader('Last-Modified', lastModifiedString);
    res.setHeader('ETag', eTag);

    // Check client validation headers
    const ifNoneMatch = req.headers['if-none-match'];
    const ifModifiedSince = req.headers['if-modified-since'];

    const isEtagMatch = ifNoneMatch === eTag;
    const isDateMatch =
      ifModifiedSince && new Date(ifModifiedSince) >= fileStats.mtime;

    // 6. Short-circuit if not modified
    if (isEtagMatch || isDateMatch) {
      return res.status(HttpStatus.NOT_MODIFIED).send();
    }

    const fileStream = createReadStream(filePath);

    // Determine content type based on file extension
    let contentType = 'application/octet-stream';
    switch (extension.toLowerCase()) {
      case 'json':
        contentType = 'application/json';
        break;
      case 'geojson':
        contentType = 'application/geo+json';
        break;
    }

    // Set response headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', fileStats.size);

    if (contentEncoding) {
      res.setHeader('Content-Encoding', contentEncoding);
    }

    // Pipe the stream to the response and end it
    fileStream.pipe(res);
  }
}
