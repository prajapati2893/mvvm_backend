export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum State {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum FeeType {
  ADMISSION = 'ADMISSION',
  TUTION = 'TUTION',
  EXAM = 'EXAM',
  SPORTS = 'SPORTS',
  TRANSPORT = 'TRANSPORT',
  OTHER = 'OTHER',
}

export enum FeeState {
  SUBMITTED = 'SUBMITTED',
  DUE = 'DUE',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum PaymentMode {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  ONLINE = 'ONLINE',
  OTHER = 'OTHER',
}

export enum RelationType {
  MOTHER = 'MOTHER',
  FATHER = 'FATHER',
  GUARDIAN = 'GUARDIAN',
  SPOUSE = 'SPOUSE',
}

export enum RelationContext {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
}
