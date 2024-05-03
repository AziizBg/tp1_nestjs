import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { History } from './entities/history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HistoryService {
  constructor(    @InjectRepository(History) private historyRepository: Repository<History>) {}

  async addHistoryEntry(entry: CreateHistoryDto): Promise<History> { 
    return this.historyRepository.save(entry);
  }
}
