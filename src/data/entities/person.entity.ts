import {
	AutoMappedColumn,
	AutoMappedPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import { Entity, JoinColumn, ManyToOne, OneToMany, Point } from 'typeorm';
import { Favourite } from './favourite.entity';
import { History } from './history.entity';
import { Level } from './level.entity';
import { Photo } from './photo.entity';
import { Position } from './position.entity';
import { Report } from './report.entity';
import { Request } from './request.entity';
import { Role } from './role.entity';

@Entity()
export class Person {
	@AutoMappedPrimaryGeneratedColumn()
	public id: number;

	@AutoMappedPrimaryGeneratedColumn()
	public firstName: string;

	@AutoMappedPrimaryGeneratedColumn()
	public lastName: string;

	@AutoMappedColumn()
	public email: string;

	@AutoMappedColumn({ select: false })
	public password: string;

	@AutoMappedColumn()
	public phoneNumber: string;

	@AutoMappedColumn()
	public dateJoin: Date;

	@AutoMappedColumn()
	public sizeQueue: number;

	@AutoMappedColumn({
		type: 'geometry'
	})
	public location: Point;

	@AutoMappedColumn()
	public roleId: number;

	@AutoMappedColumn()
	public facebookId: string;

	@AutoMappedColumn()
	public microsoftId: string;

	@AutoMappedColumn()
	public googleId: string;

	@AutoMappedColumn()
	public fingerprintId: string;

	@AutoMappedColumn()
	public secureId: number;

	@AutoMappedColumn()
	public verifyCode: string;

	@AutoMappedColumn()
	public identityNumber: string;

	@AutoMappedColumn()
	public lowestCost: number;

	@AutoMappedColumn()
	public highestCost: number;

	@AutoMappedColumn()
	public blockNumber: number;

	@AutoMappedColumn()
	public blockStartDate: Date;

	@AutoMappedColumn()
	public blockFinishDate: Date;

	@AutoMappedColumn()
	public refreshToken: string;

	@AutoMappedColumn()
	public levelId: number;

	@AutoMappedColumn()
	public positionId: number;

	@OneToMany(() => Favourite, (favourite) => favourite.person, {
		cascade: true,
		eager: true,
		onDelete: 'CASCADE',
		nullable: true
	})
	public favourites: Favourite[];

	@OneToMany(() => History, (history) => history.person, {
		cascade: true,
		eager: true,
		onDelete: 'CASCADE',
		nullable: true
	})
	public history: History[];

	@OneToMany(() => Photo, (photo) => photo.person, {
		cascade: true,
		eager: true,
		onDelete: 'CASCADE'
	})
	public photos: Photo[];

	@OneToMany(() => Report, (report) => report.person, {
		cascade: true,
		eager: true,
		onDelete: 'CASCADE',
		nullable: true
	})
	public reports: Report[];

	@OneToMany(() => Request, (request) => request.person, {
		cascade: true,
		eager: true,
		onDelete: 'CASCADE',
		nullable: true
	})
	public requests: Request[];

	@ManyToOne(() => Role, (role) => role.persons, {
		eager: true
	})
	@JoinColumn({
		name: 'role_id',
		referencedColumnName: 'id'
	})
	public role: Role;

	@ManyToOne(() => Level, (level) => level.persons, {
		eager: true,
		nullable: true
	})
	@JoinColumn({
		name: 'level_id',
		referencedColumnName: 'id'
	})
	public level: Level;

	@ManyToOne(() => Position, (postion) => postion.persons, {
		eager: true,
		nullable: true
	})
	@JoinColumn({
		name: 'position_id',
		referencedColumnName: 'id'
	})
	public position: Position;
}
