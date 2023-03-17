import {
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
	isLatitude,
	isLongitude
} from 'class-validator';
import { Point } from 'typeorm';

function isPoint(obj: any): obj is Point {
	return 'type' in obj && 'coordinates' in obj;
}

@ValidatorConstraint({ name: 'isPoint' })
export class IsPointConstraint implements ValidatorConstraintInterface {
	validate(pointValue: any, args: ValidationArguments) {
		if (
			isPoint(pointValue) &&
			isLatitude((pointValue as Point).coordinates[0].toString()) &&
			isLongitude((pointValue as Point).coordinates[1].toString())
		) {
			return true;
		}

		return false;
	}
}

export function IsPoint(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsPointConstraint
		});
	};
}
