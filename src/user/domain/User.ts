import { UserId } from "./UserId";

export type UserType = "entrepreneur" | "investor";

export class User {
  readonly id: UserId;
  readonly name: string;
  readonly email: string;
  readonly type: UserType;
  readonly phone: string;
  readonly password: string;
  profilePhoto: string;
  readonly createdAt: string;
  updatedAt: string;

  constructor(
    id: UserId,
    name: string,
    email: string,
    type: UserType,
    phone: string,
    password: string,
    profilePhoto = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.type = type;
    this.phone = phone;
    this.password = password;
    this.profilePhoto = profilePhoto;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(params: {
    name: string;
    email: string;
    type: UserType;
    phone: string;
    password: string;
  }): User {
    return new User(
      UserId.random(),
      params.name,
      params.email,
      params.type,
      params.phone,
      params.password
    );
  }

  static fromPrimitives(params: {
    id: string;
    name: string;
    email: string;
    type: UserType;
    phone: string;
    password: string;
    profilePhoto: string;
    createdAt: string;
    updatedAt: string;
  }): User {
    return new User(
      new UserId(params.id),
      params.name,
      params.email,
      params.type,
      params.phone,
      params.password,
      params.profilePhoto,
      params.createdAt,
      params.updatedAt
    );
  }

  updateProfilePhoto(profilePhoto: string) {
    this.profilePhoto = profilePhoto;
    this.updatedAt = new Date().toISOString();
  }

  toPrimitives() {
    return {
      id: this.id.value,
      name: this.name,
      email: this.email,
      type: this.type,
      phone: this.phone,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
