import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { ReportsDto } from './dtos/report.dto';
import { User } from 'src/users/users.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo:Repository<Report> ){}

    async createEstimate({make, model, longitude, latitude, year, mileage}:GetEstimateDto){
        return this.repo.createQueryBuilder()
        .select('AVG(price)', 'price')
        .where('make = :make', { make })
        .andWhere('model = :model', { model })
        .andWhere('longitude - :longitude BETWEEN -5 AND 5', { longitude })
        .andWhere('latitude - :longitude BETWEEN -5 AND 5', { latitude })
        .andWhere('year - :year BETWEEN -3 AND 3', { year })
        .orderBy("ABS(mileage - :mileage)", "DESC")
        .setParameters({mileage})
        .limit(3)
        .getRawOne()
    }

    async create(payload:ReportsDto, user:User){
        const report = this.repo.create(payload)
        report.user = user
        return this.repo.save(report)
    }

    async makeApproval(id:number, payload:ApproveReportDto){
        const report = await this.repo.findOne(id)
        report.approve = payload.approved
        return this.repo.save(report)
    }
}
