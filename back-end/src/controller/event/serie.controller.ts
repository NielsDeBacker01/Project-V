import { BadRequestException, Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { SerieService } from 'src/service/serie/serie.service';

@Controller('serie')
export class SerieController {
  constructor(private readonly serieService: SerieService) {}
  @Get('series-ids')
  getSerieIdsByTeamName(@Query('team_name') teamName: string): Promise<any> {
    return this.serieService.getSerieIdsByTeamName(teamName);
  }

  @Get('team-id')
  getTeamIdByTeamName(@Query('team_name') teamName: string): Promise<any> {
    return this.serieService.getTeamIdByTeamName(teamName);
  }
}