import { Controller, Post, Body , UseGuards, Patch, Param, Query, Get} from '@nestjs/common';
import { ReportsDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';
import { Serialize } from 'src/interceptors/users.serializer';
import { ReportResponseDto } from './dtos/report-reponse.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
    constructor( private reportsService:ReportsService){}

    @Get("get-estimate")
    getEstimate(@Query() query:GetEstimateDto){
        this.reportsService.createEstimate(query)
    }

    @Post("create-report/")
    @UseGuards(AuthGuard)
    @Serialize(ReportResponseDto)
    createReport(@Body() body: ReportsDto, @CurrentUser() user:User){
        return this.reportsService.create(body, user);
    }

    @Patch("approve-report/:id")
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id:string, @Body() body:ApproveReportDto){
        return this.reportsService.makeApproval(parseInt(id), body);
    }

    
}
