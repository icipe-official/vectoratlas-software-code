import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { Dataset } from '../shared/entities/dataset.entity';
import { UploadedDataset } from '../uploaded-dataset/entities/uploaded-dataset.entity';
import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from './organization.input';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    @InjectRepository(Dataset)
    private readonly datasetRepository: Repository<Dataset>,

    @InjectRepository(UploadedDataset)
    private readonly uploadedDatasetRepository: Repository<UploadedDataset>,
  ) {}

  async create(input: CreateOrganizationInput): Promise<Organization> {
    const name = input.name?.trim();
    await this.assertNameAvailable(name);

    const organization = this.organizationRepository.create({
      ...input,
      name,
    });
    return this.organizationRepository.save(organization);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({
      order: { modified: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async update(input: UpdateOrganizationInput): Promise<Organization> {
    const organization = await this.findOne(input.id);

    if (input.name !== undefined && input.name !== null) {
      const name = input.name.trim();
      if (name !== organization.name) {
        await this.assertNameAvailable(name);
      }
      organization.name = name;
    }
    if (input.website !== undefined) organization.website = input.website;
    if (input.logo !== undefined) organization.logo = input.logo;
    if (input.acknowledgement !== undefined) {
      organization.acknowledgement = input.acknowledgement;
    }
    if (input.terms_and_conditions !== undefined) {
      organization.terms_and_conditions = input.terms_and_conditions;
    }

    return this.organizationRepository.save(organization);
  }

  async remove(id: string): Promise<Organization> {
    const organization = await this.findOne(id);

    // 1. Block if any ingested dataset credited to this organization has occurrences
    const occurrenceCount = await this.datasetRepository
      .createQueryBuilder('dataset')
      .innerJoin('dataset.organization', 'organization')
      .innerJoin('dataset.occurrence', 'occurrence')
      .where('organization.id = :id', { id })
      .getCount();

    if (occurrenceCount > 0) {
      throw new ConflictException(
        'This organization cannot be deleted because it has datasets with occurrence records.',
      );
    }

    // 2. Block if uploaded datasets still point at it (not yet ingested),
    //    otherwise their credit would be silently cleared
    const uploadedCount = await this.uploadedDatasetRepository.count({
      where: { organization: { id } },
    });

    if (uploadedCount > 0) {
      throw new ConflictException(
        'This organization cannot be deleted because uploaded datasets are linked to it.',
      );
    }

    // remove() clears the id on the entity, so return a copy taken before it
    const deleted = { ...organization } as Organization;
    await this.organizationRepository.remove(organization);
    return deleted;
  }

  private async assertNameAvailable(name: string): Promise<void> {
    const existing = await this.organizationRepository.findOne({
      where: { name },
    });
    if (existing) {
      throw new ConflictException(
        `An organization named "${name}" already exists.`,
      );
    }
  }
}
