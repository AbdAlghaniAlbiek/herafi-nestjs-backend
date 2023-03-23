import {
	AutoMapColumn,
	AutoMapPrimaryGeneratedColumn
} from 'src/helpers/decorators/orm.decorator';
import {
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	Point
} from 'typeorm';
import { Favourite } from './favourite.entity';
import { History } from './history.entity';
import { Level } from './level.entity';
import { Photo } from './photo.entity';
import { Position } from './position.entity';
import { Report } from './report.entity';
import { Request } from './request.entity';
import { Role } from './role.entity';
import { SocialProvider } from './social-provider.entity';

@Entity()
export class Person {
	@AutoMapPrimaryGeneratedColumn()
	public id: number;

	@AutoMapColumn()
	public firstName: string;

	@AutoMapColumn()
	public lastName: string;

	@AutoMapColumn()
	public email: string;

	@AutoMapColumn({ select: false })
	public password: string;

	@AutoMapColumn()
	public phoneNumber: string;

	@AutoMapColumn()
	public dateJoin: Date;

	@AutoMapColumn()
	public sizeQueue: number;

	@AutoMapColumn({
		type: 'geometry'
	})
	public location: Point;

	@AutoMapColumn()
	public roleId: number;

	@AutoMapColumn()
	public fingerprintId: string;

	@AutoMapColumn()
	public secureId: string;

	@AutoMapColumn()
	public identityNumber: string;

	@AutoMapColumn()
	public lowestCost: number;

	@AutoMapColumn()
	public highestCost: number;

	@AutoMapColumn()
	public blockNumber: number;

	@AutoMapColumn()
	public blockStartDate: Date;

	@AutoMapColumn()
	public blockFinishDate: Date;

	@AutoMapColumn()
	public levelId: number;

	@AutoMapColumn()
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

	@OneToOne(() => SocialProvider, (socialProvider) => socialProvider.person, {
		eager: true,
		cascade: true,
		nullable: false,
		onDelete: 'CASCADE'
	})
	public socialProvider: SocialProvider;
}
