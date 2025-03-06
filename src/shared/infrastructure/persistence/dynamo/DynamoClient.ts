import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  QueryInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoBaseEntity } from "./DynamoBaseEntity";

interface UpsertPayload extends Omit<UpdateItemCommandInput, "TableName"> {
  TableName?: string;
}

/**
 * Esta clase sirve para realizar operaciones en DynamoDB
 * @template T Objeto que se almacena en la tabla
 * @template K Primary Key de la tabla (simple o compuesta)
 */
export class DynamoDbClient<
  T extends DynamoBaseEntity,
  K
> extends DynamoDBClient {
  private readonly table: string;

  constructor(table: string) {
    super();
    this.table = table;
  }

  /**
   * Método para guardar un objeto en una tabla
   *
   * @param item Objeto que se guardará
   */
  async save(item: T): Promise<void> {
    await this.send(
      new PutItemCommand({
        TableName: this.table,
        Item: marshall(item.toPrimitives()),
      })
    );
  }

  /**
   * Método para obtener un objeto de una tabla
   *
   * @param key Primary key de la tabla (simple o compuesta)
   * @returns
   */
  async findOne(key: K): Promise<T | undefined> {
    const item = (
      await this.send(
        new GetItemCommand({
          TableName: this.table,
          Key: marshall(key),
        })
      )
    ).Item;

    if (!item) return undefined;

    return unmarshall(item) as T;
  }

  /**
   * Método para actualizar un item dentro de una tabla
   * Si no existe el item se crea uno nuevo
   *
   * @param payload Configuración para actualizar el item
   */
  async upsert(payload: UpsertPayload): Promise<void> {
    await this.send(
      new UpdateItemCommand({ ...payload, TableName: this.table })
    );
  }

  /**
   * Método para hacer una query a una tabla de dynamo
   *
   * @param payload Configuración para realizar la query
   */
  async query(payload: Partial<QueryInput>): Promise<T[] | undefined> {
    const records = (
      await this.send(new QueryCommand({ ...payload, TableName: this.table }))
    ).Items;

    if (
      records === undefined ||
      records.length === 0 ||
      records[0] === undefined
    ) {
      return undefined;
    }

    return records.map((item) => unmarshall(item) as T);
  }
}
