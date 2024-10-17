// src/dataset/dataset.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dataset } from './entities/dataset.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class DatasetService {
  constructor(
    @InjectRepository(Dataset)
    private datasetRepository: Repository<Dataset>,
    private authService: AuthService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    datasetId: string,
    dataType: string,
    dataSource: string,
    doi: string,
    description: string,
    title: string,
    location: string,
    createdBy: string,
    region: string,
  ): Promise<Dataset> {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    // Simulate uploading to a blob store and return a URL.
    const blobUrl = await this.uploadToBlobStore(file);

    // Save the metadata to the database.
    const newDataset = this.datasetRepository.create({
      dataType,
      dataSource,
      doi,
      description,
      title,
      location,
      region,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      UpdatedBy: createdBy,
      UpdatedAt: new Date(),
      status: 'Uploaded',
    });

    return this.datasetRepository.save(newDataset);
  }

  async uploadToBlobStore(file: Express.Multer.File): Promise<string> {
    console.log(`Uploading ${file.originalname} to blob store...`);
    return `https://blobstore.example.com/${file.originalname}`;
  }

  async findOneById(id: string): Promise<Dataset> {
    await this.authService.init();
    const dataset = await this.datasetRepository.findOne({ where: { id } });
    if (dataset) {
      dataset.UpdatedBy = await this.authService.getEmailFromUserId(
        dataset.UpdatedBy || 'N/A',
      );
    }
    return dataset;
  }
  async findOneByIdWithChildren(id: string): Promise<Dataset | null> {
    const dataset = await this.datasetRepository.findOne({
      where: { id },
      relations: ['bionomics', 'occurrence'],
    });
    return dataset || null;
  }
}
