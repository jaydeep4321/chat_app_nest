import { Inject, Injectable, Req } from '@nestjs/common';
import { File } from './entities/file.entity';
import { FILE_REPOSITORY } from 'src/core/constants';

@Injectable()
export class FileService {
  constructor(
    @Inject(FILE_REPOSITORY) private readonly FileRepository: typeof File,
  ) {}

  async createFile(File: File): Promise<File> {
    console.log('inside the createFile ===>', File);

    return await this.FileRepository.create(File);
  }

  async getFiles(): Promise<File[]> {
    return await this.FileRepository.findAll();
  }
}
