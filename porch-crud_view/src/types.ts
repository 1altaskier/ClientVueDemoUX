// src/types.ts
export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isArchived: Boolean;
  phones: Phone[];
}

export interface Phone {
  phoneId: number;
  //clientId: number;
  phoneNumber: string;
  phoneTypeId: number;
}

export interface PhoneType {
  phoneTypeId: number;
  phoneType: string;
}
