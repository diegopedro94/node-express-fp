import { NextFunction, Request, Response } from 'express'
import { User } from '../models/user'
import * as E from '../utils/either'
import * as V from '../utils/validation'

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const validation = res.locals.validation as V.Validation<Error[], User>
  const valueEither = validation.toEither()
  return E.fold<Error[], User, Response>((errors) => res.status(400).json({ error: errors.map(error => error.message) }), (user) => res.status(200).json({ user }))(valueEither)
}
