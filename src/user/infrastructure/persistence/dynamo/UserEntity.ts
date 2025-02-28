import { DynamoBaseEntity } from "src/shared/infrastructure/persistence/dynamo/DynamoBaseEntity";

export class UserEntity extends DynamoBaseEntity {
  readonly pk: string;
  readonly sk: string;
  readonly name: string;
  readonly email: string;
  readonly type: string;
  readonly phone: string;
  readonly password: string;
  readonly profilePhoto: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(
    id: string,
    name: string,
    email: string,
    type: string,
    phone: string,
    password: string,
    profilePhoto: string,
    createdAt: string,
    updatedAt: string
  ) {
    super();
    this.pk = id;
    this.sk = "USER";
    this.name = name;
    this.email = email;
    this.type = type;
    this.phone = phone;
    this.password = password;
    this.profilePhoto = profilePhoto;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toPrimitives(): object {
    return {
      pk: this.pk,
      sk: this.sk,
      name: this.name,
      email: this.email,
      type: this.type,
      phone: this.phone,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      profilePhoto: this.profilePhoto,
      "gsi1-sk": this.email,
    };
  }
}
