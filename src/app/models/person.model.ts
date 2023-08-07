import { Address } from "./Address.model";

export interface Person {
    id: number;
    name: string;
    birthdate: Date;
    addresses: Address[];
}