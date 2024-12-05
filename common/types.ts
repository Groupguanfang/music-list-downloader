export interface RequestBase {
  cookie?: string
}

export interface Limitable {
  limit?: number
}

export interface Offsetable {
  offset?: number
}

export interface Paginationable extends Limitable, Offsetable {}

export interface Idable {
  id: number | string
}

export interface Nameable {
  name: string
}

export interface Coverable {
  cover: string
}

export interface Describeable {
  description: string
}
