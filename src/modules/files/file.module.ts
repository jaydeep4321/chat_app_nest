import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileProviders } from './file.provider';

@Module({
  controllers: [FileController],
  providers: [FileService, ...FileProviders, FileService],
  exports: [...FileProviders, FileService],
})
export class FileModule {}
