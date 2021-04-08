import { getRepository } from 'typeorm';

import { compare, hash } from 'bcryptjs';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });
    if (checkUserExists) {
      throw new Error('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user.password) {
      const passwordMatched = await compare(password, user.password);
      if (!passwordMatched) {
        throw new Error('Incorrect email/password combination');
      }
    }

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
