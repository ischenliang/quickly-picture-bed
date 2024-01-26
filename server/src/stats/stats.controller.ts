import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from 'src/common/role.guard';
import { User } from 'src/common/user.decorator';
import { User as UserType } from 'src/user/entities/user.entity';
import { Role } from 'src/common/role.descorator';

@Controller({
  path: 'stats',
  version: '1'
})
@ApiTags('数据统计')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {
  }
  
  @Post('banner')
  @HttpCode(200)
  @ApiOperation({ summary: '统计banner', description: '获取统计页面顶部面板数据' })
  @ApiResponse({ status: 200, description: '操作成功' })
  banner(@User() user: UserType, @Body('type') type: 'admin' | 'user') {
    if (user.role === 10 && type === 'admin') {
      return this.statsService.getAdminBanner()
    } else {
      return this.statsService.getBanner(user.id)
    }
  }
  
  @Post('rencentLog')
  @HttpCode(200)
  @ApiOperation({ summary: '近期动态', description: '查询近一周的日志情况' })
  @ApiResponse({ status: 200, description: '操作成功' })
  rencentLog (@User() user: UserType) {
    return this.statsService.getRecentLogs(user.id)
  }
  
  @Post('percentData')
  @HttpCode(200)
  @ApiOperation({ summary: '占比数据', description: '查询占比数据，其中包括存储桶、相册、容量、知识库文章' })
  @ApiResponse({ status: 200, description: '操作成功' })
  percentData (@User() user: UserType, @Body('type') type: 'admin' | 'user') {
    if (user.role === 10 && type === 'admin') {
      return this.statsService.getAdminPercentData()
    } else {
      return this.statsService.getPercentData(user.id)
    }
  }
}
