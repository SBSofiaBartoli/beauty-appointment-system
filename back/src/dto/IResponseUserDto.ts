export interface IResponseUserDto {
  id: number;
  name: string;
  email: string;
  birthdate: Date;
  nDni: number;
  role: string;
}

export interface ILoginResponseDto {
  token: string;
  user: IResponseUserDto;
}
