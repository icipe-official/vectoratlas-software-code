// src/dataset/dataset.service.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Dataset } from './entities/dataset.entity';
import { UploadedDataset } from '../uploaded-dataset/entities/uploaded-dataset.entity';
import { AuthService } from 'src/auth/auth.service';
import { OccurrenceService } from '../occurrence/occurrence.service';
@Injectable()
export class DatasetService {
  constructor(
    @InjectRepository(Dataset)
    private datasetRepository: Repository<Dataset>,
    private authService: AuthService,
    private logger: Logger,
    @InjectEntityManager() private entityManager: EntityManager,
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
      this.logger.error('No file uploaded.');
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

  async findAll(): Promise<Dataset[]> {
    return await this.datasetRepository.find({
      order: {
        UpdatedAt: 'DESC', // Optional: sorts the results by update time
      },
    });
  }

  async updateUploadedDatasetId(
    id: string,
    uploadedDataset: UploadedDataset,
  ): Promise<Dataset> {
    await this.authService.init();
    const dataset = await this.datasetRepository.findOne({
      where: { id: id },
    });
    dataset.uploaded_dataset = uploadedDataset;
    dataset.status = 'Approved';
    this.datasetRepository.save(dataset);
    return dataset;
  }

  async getDatasetByUploadedDatasetId(
    uploadedDatasetId: string,
  ): Promise<Dataset> {
    const ds: Dataset = await this.entityManager
      .createQueryBuilder(Dataset, 'dataset')
      .select()
      .where('dataset.uploadedDatasetId= :uploadedDatasetId', {
        uploadedDatasetId: uploadedDatasetId,
      })
      .getOne();

    return ds;
  }

  async removeByUploadedDatasetId(
    uploadedDatasetId: string,
  ): Promise<Dataset | Dataset[] | null> {
    const ds: Dataset = await this.entityManager
      .createQueryBuilder(Dataset, 'dataset')
      .select()
      .where('dataset.uploadedDatasetId= :uploadedDatasetId', {
        uploadedDatasetId: uploadedDatasetId,
      })
      .getOne();
    if (ds) {
      return await this.datasetRepository.remove(ds);
    }
    return null;
  }

  async remove(id: string) {
    // delete occurrence
    const ds: Dataset = await this.datasetRepository.findOne({
      where: { id },
    });
    if (ds) {
      return this.datasetRepository.remove(ds);
    }
  }

  async findOneByIdWithChildren(id: string): Promise<Dataset | null> {
    const dataset = await this.datasetRepository.findOne({
      where: { id },
      relations: ['bionomics', 'occurrence'],
    });
    return dataset || null;
  }
}
