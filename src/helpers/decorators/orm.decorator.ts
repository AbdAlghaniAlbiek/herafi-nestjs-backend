import { AutoMap } from '@automapper/classes';
import { applyDecorators } from '@nestjs/common';
import { Column, ColumnOptions, PrimaryGeneratedColumn } from 'typeorm';

export function AutoMapColumn(
	columnOptions: ColumnOptions | undefined = undefined
) {
	return applyDecorators(AutoMap, Column(columnOptions));
}

export function AutoMapPrimaryGeneratedColumn() {
	return applyDecorators(AutoMap, PrimaryGeneratedColumn('increment'));
}
