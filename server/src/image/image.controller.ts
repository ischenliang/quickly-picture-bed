import { Controller, Post, Body, UseGuards, HttpCode, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ImageService } from './image.service';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/local-auth.guard';
import { RoleGuard } from 'src/common/role.guard';
import { User } from 'src/common/user.decorator';
import { User as UserType } from 'src/user/entities/user.entity'
import { FilesInterceptor } from '@nestjs/platform-express';
import { AxiosRequestConfig } from 'axios';
import IP2Region from 'ip2region'
import { HttpService } from '@nestjs/axios';
import { ImageFilter, ImageIdDto } from './dto/create-image.dto';
import { Ip } from 'src/common/ip.decorator';

// 插件配置项items项
interface IPluginLabelOption {
  label: string
  value: string | number | boolean
}
// 插件配置项
interface IPluginConfig {
  type: "string" | "password" | "option" | "choice" // 字段类型
  label: string // 表单提示文字
  field: string // 生成节点key名称
  default: string | number | boolean // 默认值
  required?: boolean // 是否必填项，为true时会经过校验
  placeholder?: string // 输入框提示文字
  tips?: string // 填写时的底部提示
  hidden?: boolean // 是否隐藏当前节点
  options?: Array<IPluginLabelOption> // 下拉框选择项
  choices?: {
    active: IPluginLabelOption // 打开时显示的内容
    inactive: IPluginLabelOption // 关闭时显示的内容
  }
}
// 插件
interface IPlugin {
  config: Array<IPluginConfig>
  handle: (ctx: any) => AxiosRequestConfig
  [propName: string]: any
}



@Controller({
  path: 'image',
  version: '1'
})
@ApiTags('图片管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class ImageController {
  constructor(
    private readonly imageService: ImageService, 
    private httpService: HttpService) {}

  @Post('upload')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          }
        },
        bucket_id: {
          type: 'number',
          description: '存储桶id',
          nullable: false
        },
        album_id: {
          type: 'number',
          description: '相册id，可选',
          nullable: true
        },
        image_id: {
          type: 'number',
          description: '图片id，可选(传值时代表更新图片)',
          nullable: true
        }
      }
    }
  })
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: '上传图片', description: '上传图片' })
  @ApiResponse({ status: 200, description: '上传成功' })
  async upload(@UploadedFiles() files: Array<Express.Multer.File>, @Ip() ip: string, @Body() param: { bucket_id: number; album_id: number; image_id: number }, @User() user: UserType) {
    // 还需要考虑是否是更新图片：如果是更新是否需要删除原文件
    return this.imageService.upload(files, ip, param, user.id)

    // 根据ip获取定位
    // const query = new IP2Region();
    // const res = query.search('218.81.70.50');
    // console.log([res.province, res.city].join(' '))
    // console.log(res)
  }

  @Post('list')
  @HttpCode(200)
  @ApiOperation({ summary: '图片列表', description: '查询图片列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Body() param: ImageFilter, @User() user: UserType) {
    return this.imageService.findAll(param, user.id);
  }

  @Post('detail')
  @HttpCode(200)
  @ApiOperation({ summary: '图片详情', description: '查询图片详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findOne(@Body() param: ImageIdDto, @User() user: UserType) {
    return this.imageService.findOne(param.id, user.id);
  }

  @Post('update')
  @HttpCode(200)
  @ApiOperation({ summary: '更新图片', description: '更新图片' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Body() param: UpdateImageDto, @Ip() ip: string, @User() user: UserType) {
    return this.imageService.update(param, ip, user.id);
  }

  @Post('delete')
  @HttpCode(200)
  @ApiOperation({ summary: '删除图片', description: '删除图片' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Body() param: ImageIdDto, @Ip() ip: string, @User() user: UserType) {
    return this.imageService.remove(param.id, ip, user.id);
  }

  @Post('sort')
  @HttpCode(200)
  @ApiOperation({ summary: '拖拽排序', description: '拖拽排序' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        from: {
          type: 'number',
          description: '拖拽目标id'
        },
        to: {
          type: 'number',
          description: '存放目标id'
        }
      }
    }
  })
  sort(@Body('from') from: number, @Body('to') to: number, @User() user: UserType) {
    return this.imageService.sort(from, to, user.id);
  }
}
