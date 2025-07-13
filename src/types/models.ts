export interface Phone {
  phoneId?: number
  phoneTypeId: number | null
  phoneNumber: string
  clientId: number
}

export interface Client {
  clientId: number
  firstName: string
  lastName: string
  email: string | null
  isArchived: boolean | null
  phones: Phone[]
}

export interface PhoneType {
  phoneTypeId: number
  type: string
}