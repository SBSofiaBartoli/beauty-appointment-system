import { AppDataSource, userRepository } from "../config/data-source";
import { JWT_SECRET } from "../config/envs";
import { ILoginResponseDto, IResponseUserDto } from "../dto/IResponseUserDto";
import type { IUserDto } from "../dto/UserDto";
import { Credential } from "../entities/Credential";
import { User, UserRole } from "../entities/User";
import {
  createCredentialService,
  validateCredentialService,
} from "./credentialService";
import jwt from "jsonwebtoken";

export const getAllUsersService = async (): Promise<User[]> => {
  return await userRepository.find({ relations: { appointments: true } });
};

export const getUserByIdService = async (id: number): Promise<User | null> => {
  const user = await userRepository.findOne({
    where: { id },
    relations: { appointments: true },
  });
  if (!user) throw new Error("Usuario no encontrado");
  return user;
};

export const createUserService = async (
  userData: IUserDto,
): Promise<IResponseUserDto> => {
  const resultUser = await AppDataSource.transaction(async (entityManager) => {
    const existingUser = await entityManager.findOne(User, {
      where: [
        { email: userData.email },
        { credential: { username: userData.username } },
      ],
      relations: ["credential"],
    });
    if (existingUser) {
      throw new Error("Ya existe un usuario con ese email o nombre de usuario");
    }

    const newCredential: Credential = await createCredentialService(
      entityManager,
      userData.username,
      userData.password,
    );

    const newUser: User = entityManager.create(User, {
      name: userData.name,
      email: userData.email,
      birthdate: userData.birthdate,
      nDni: userData.nDni,
      credential: newCredential,
      role: userData.role === "admin" ? UserRole.ADMIN : UserRole.CLIENT,
    });

    return await entityManager.save(User, newUser);
  });

  return {
    id: resultUser.id,
    name: resultUser.name,
    email: resultUser.email,
    birthdate: resultUser.birthdate,
    nDni: resultUser.nDni,
    role: resultUser.role,
  };
};

export const loginUserService = async (
  username: string,
  password: string,
): Promise<ILoginResponseDto> => {
  const credentialId = await validateCredentialService(username, password);
  const foundUser: User | null = await userRepository.findOne({
    where: { credential: { id: credentialId } },
    select: ["id", "name", "email", "birthdate", "nDni", "role"],
  });
  if (!foundUser) throw new Error("Usuario no encontrado");

  const token = jwt.sign(
    { id: foundUser.id, role: foundUser.role },
    JWT_SECRET as string,
    { expiresIn: "8h" },
  );
  return {
    token,
    user: {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      birthdate: foundUser.birthdate,
      nDni: foundUser.nDni,
      role: foundUser.role,
    },
  };
};
