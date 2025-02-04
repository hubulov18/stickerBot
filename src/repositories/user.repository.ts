import {User} from "../entitities/user.entity";
import {getRepository, Repository} from "typeorm";
import {EntityRepository} from "typeorm";

export const getUser = async (userId):  Promise<User> => {

   const query = await getRepository(User)
       .createQueryBuilder("user")
       .where("user.userId = :userId", {userId})
       .getMany()
   return query[0]
}

export const createUser = async (userId) => {
   const userRepository = getRepository(User)
   const user = userRepository.create({userId})
   return await userRepository.save(user)
}