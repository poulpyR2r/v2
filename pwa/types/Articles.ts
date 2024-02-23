import { Item } from "./item";

export class Articles implements Item {
  public "@id"?: string;

  constructor(_id?: string, public title?: string, public content?: string) {
    this["@id"] = _id;
  }
}
