import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    Query,
  } from '@nestjs/common';
  import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from './category.entity';
  
  @Controller('categories')
  export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
  
    @Get()
    findAll() {
      return this.categoriesService.findAll();
    }

    @Get('top')
    getTopCategories(@Query('limit') limit: string): Promise<Category[]> {
      const parsedLimit = parseInt(limit, 10) || 8;
      return this.categoriesService.findTop(parsedLimit);
    }
  
    @Get(':id')
    findOne(@Param('id') id: number) {
      return this.categoriesService.findOne(id);
    }
  
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
      return this.categoriesService.create(createCategoryDto);
    }
  
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
      return this.categoriesService.update(id, updateCategoryDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: number) {
      return this.categoriesService.remove(id);
    }
  }
  