import { compare, hash } from "bcrypt";
import { ICreate, IUpdate } from "../interfaces/UsersInterfaces";
import { UserRepository } from "../repositories/UserRepository";
import { s3 } from "../config/aws";
import { request } from "express";
import {v4 as uuid} from 'uuid'
import { sign } from "jsonwebtoken";

class UsersServices {
  private usersRepository: UserRepository;

  constructor() {
    this.usersRepository = new UserRepository();
  }
  async create({ name, email, password }: ICreate) {
    const findUser = await this.usersRepository.findUserByEmail(email);

    if (findUser) {
      throw new Error("User exists");
    }

    const hashPassword = await hash(password, 10);

    const create = await this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    });

    return create;
  }
  async update({ name, oldPassword, newPassword, avatar_url, user_id }: IUpdate) {
    let password 

    if(oldPassword && newPassword){
      const findUserById = await this.usersRepository.findUserById(user_id);
      if(!findUserById){
        throw new Error("User not found");
    }
      const passawordMatch = await compare(oldPassword, findUserById.password); 
      if(!passawordMatch){
        throw new Error("User or password invalid");
      }
      password = await hash(newPassword, 10);

      await this.usersRepository.updatePassword(password, user_id);
    }

    if(avatar_url){
      const uploadImage = avatar_url?.buffer;
      const uploadS3 = await s3.upload({
          Bucket: 'samana-heroi',
          Key: `${uuid()}-${avatar_url?.originalname}`,
          //ACL: 'public-read',
          Body: uploadImage,
      }).promise();
      console.log('url', uploadS3.Location);

      await this.usersRepository.update(name, uploadS3.Location, user_id);
    }
    return {
      message: "User updated"
    };
    
  }

  async auth(email: string, password: string ) {
    const findUser = await this.usersRepository.findUserByEmail(email);

    if(!findUser){
        throw new Error("User or password invalid");
    }
    const passwordMatch = await compare(password, findUser.password);
    if(!passwordMatch){
        throw new Error("User or password invalid");
    }
    let secretKey: string  | undefined = process.env.ACCESS_KEY_TOKEN;

    if(!secretKey){
      throw new Error("There is no secret key");
    }
    const token = sign({email}, secretKey, {
      subject: findUser.id,
      expiresIn: 60 * 30,
    })
    return {
      token,
      user:{
        name: findUser.name,
        email: findUser.email
      }
    }
  }
}

export { UsersServices };