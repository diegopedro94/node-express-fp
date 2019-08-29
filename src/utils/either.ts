export interface Left<E> {
  readonly left: E
}

export interface Right<T> {
  readonly right: T
}

export type Either<E, T> = Left<E> | Right<T>

export function left<E = never, T = never> (e: E): Either<E, T> {
  return { left: e }
}

export function right<E = never, T = never> (t: T): Either<E, T> {
  return { right: t }
}

export function isLeft<E, T> (e: Either<E, T>): e is Left<E> {
  return 'left' in e
}

export function isRight<E, T> (v: Either<E, T>): v is Right<T> {
  return 'right' in v
}

export function fold<E, T, V> (fl: (e: E) => V, fr: (v: T) => V): (either: Either<E, T>) => V {
  return (either) => (isLeft(either) ? fl(either.left) : fr(either.right))
}

export function map<E, T, V> (f: (v: T) => V, either: Either<E, T>): Either<E, V> {
  return isRight(either) ? right(f(either.right)) : either
}

export function of<E, V> (v: V): Either<E, V> {
  return right(v)
}

export function flatMap<E, T, V> (f: (v: T) => Either<E, V>, either: Either<E, T>): Either<E, V> {
  return isRight(either) ? f(either.right) : either
}
