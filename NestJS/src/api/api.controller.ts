import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiService } from './api.service';


@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  // @Post()
  // create(@Body() createApiDto: CreateApiDto) {
  //   return this.apiService.create(createApiDto);
  // }

  @Get('leads')
  findAll( @Query('query') query?: string | null) {
    return this.apiService.findAll(query);
  }
 
  @Get('leads/:query')
  
  findOne(@Param('query') query: string ) {
    return this.apiService.findOne(query);
  }

}
