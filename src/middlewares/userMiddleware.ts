import { NextFunction, Request, Response } from 'express'
import { User } from '../models/user'
import * as V from '../utils/validation'

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userRequest = req.body as User
  const validation: V.Validation<Error[], User> =
        V.ap(
            V.pure(() => ({ name: userRequest.name, lastname: userRequest.lastname, email: userRequest.email, age: userRequest.age })),
            ageValidation(userRequest.age)
        )
  res.locals.validation = validation
  next()
}

const ageValidation = (age: number): V.Validation<Error[], number> => {
  return age > 18 ? V.ok(age) : V.fail([new Error('The user must be older than 18.')])
}
