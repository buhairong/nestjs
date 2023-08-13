import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Logs } from '../logs/logs.entity';
import { getUserDto } from './dto/get-user.dto';
import { conditionUtils } from '../utils/db.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}

  findAll(query: getUserDto) {
    const { limit, page, username, gender, role } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    // return this.userRepository.find({
    //   select: {
    //     id: true,
    //     username: true,
    //     profile: {
    //       gender: true,
    //     },
    //   },
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   where: {
    //     username,
    //     profile: {
    //       gender,
    //     },
    //     roles: {
    //       id: role,
    //     },
    //   },
    //   take,
    //   skip: (page - 1) * take,
    // });

    const obj = {
      'user.username': username,
      'profile.gender': gender,
      'roles.id': role,
    };

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');

    const newQuery = conditionUtils<User>(queryBuilder, obj);

    // if (username) {
    //   queryBuilder.where('user.username = :username', { username });
    // } else {
    //   queryBuilder.where('user.username IS NOT NULL');
    // }

    // if (username) {
    //   queryBuilder.where('user.username = :username', { username });
    // } else {
    //   queryBuilder.where('user.username IS NOT NULL');
    // }

    // if (gender) {
    //   queryBuilder.andWhere('profile.gender = :gender', { gender });
    // }

    // if (role) {
    //   queryBuilder.andWhere('roles.id = :role', { role });
    // }

    return newQuery.take(take).skip(skip).getMany();
  }

  find(username: string) {
    return this.userRepository.find({ where: { username } });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User) {
    const userTmp = await this.userRepository.create(user);
    try {
      const res = this.userRepository.save(userTmp);
      return res;
    } catch (error) {
      if (error.errno && error.errno === 1062) {
        throw new HttpException(error.sqlMessage, 500);
      }
    }
  }

  async update(id: number, user: Partial<User>) {
    const userTemp = await this.findProfile(id);
    const newUser = this.userRepository.merge(userTemp, user);
    return this.userRepository.save(newUser);
    //return this.userRepository.update(id, user);
  }

  async remove(id: number) {
    //return this.userRepository.delete(id);
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }

  async findUserLogs(id: number) {
    const user = await this.findOne(id);
    return this.logsRepository.find({
      where: {
        user: user.logs,
      },
      // relations: {
      //   user: true,
      // },
    });
  }

  findLogsByGroup(id: number) {
    // SELECT logs.result as rest, COUNT(logs.result) as count from logs, user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result;
    // return this.logsRepository.query(
    //   'SELECT logs.result as rest, COUNT(logs.result) as count from logs, user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result',
    // );
    return (
      this.logsRepository
        .createQueryBuilder('logs')
        .select('logs.result', 'result')
        .addSelect('COUNT("logs.result")', 'count')
        .leftJoinAndSelect('logs.user', 'user')
        .where('user.id = :id', { id })
        .groupBy('logs.result')
        .orderBy('count', 'DESC')
        .addOrderBy('result', 'DESC')
        .offset(2)
        .limit(3)
        // .orderBy('result', 'DESC')
        .getRawMany()
    );
  }
}
