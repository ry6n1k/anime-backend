import { dataSource } from './../dataSource';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { RegisterDto } from './register.dto';
import { Payload } from '../auth/payload';
import { LoginDto } from '../auth/login.dto';

@Injectable()
export class UserService {
  userRepository = dataSource.getRepository(User);

  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  /*=============================================
  =            Authentication User              =
  =============================================*/
  async create(registerDTO: RegisterDto): Promise<User> {
    const { login } = registerDTO;
    const user = await this.userRepository.findOne({ where: { login } });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }
    const newUser = new User();
    newUser.username = registerDTO.username;
    newUser.login = registerDTO.login;
    newUser.password = registerDTO.password;
    return await this.userRepository.save(newUser);
  }

  async findByPayload(payload: Payload) {
    const { login } = payload;
    return this.userRepository.findOne({ where: { login } });
  }

  async findByLogin(UserDTO: LoginDto) {
    const { login, password } = UserDTO;
    const user = await this.userRepository.findOne({ where: { login } });
    if (!user) {
      throw new HttpException('user does not exists', HttpStatus.BAD_REQUEST);
    }
    //if (await bcrypt.compare(password, user.password)) {
    if (password === user.password) {
      return user;
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }
}
