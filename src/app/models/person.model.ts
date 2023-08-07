import { Address } from "./address.model";

export interface Person {
    id: number;
    name: string;
    birthdate: Date;
    addresses: Address[];
}