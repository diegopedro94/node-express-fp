import * as Either from './either'

interface Semigroup<A> {
  concat (b: A): A
}

export function ap<E extends Semigroup<E>, T, U> (
	vf: Validation<E, (t: T) => U>,
	vt: Validation<E, T>
): Validation<E, U> {
  return vf.fold<Validation<E, U>>(
		(e1) =>
			vt.fold<Validation<E, U>>(
				(e2) => new Fail<E, U>(e1.concat(e2)),
				(s2) => new Fail<E, U>(e1)
			),
		(s1) =>
			vt.fold<Validation<E, U>>(
				(e2) => new Fail<E, U>(e2),
				(s2) => new OK<E, U>(s1(s2))
			)
	)
}

export function mconcat<E extends Semigroup<E>, T> (
	vl: Validation<E, T>,
	vf: Validation<E, T>
): Validation<E, T> {
  return vl.fold<Validation<E, T>>(
		(e1) =>
			vf.fold<Validation<E, T>>(
				(e2) => new Fail<E, T>(e1.concat(e2)),
				(s2) => new Fail<E, T>(e1)
			),
		(s1) =>
			vf.fold<Validation<E, T>>(
				(e2) => new Fail<E, T>(e2),
				(s2) => new OK<E, T>(s1)
			)
	)
}

export interface Validation<E extends Semigroup<E>, T> {
  map<U> (f: (t: T) => U): Validation<E, U>
  fold<X> (fail: (e: E) => X, success: (t: T) => X): X
  toEither (): Either.Either<E, T>
}

export class OK<E extends Semigroup<E>, T> implements Validation<E, T> {
  constructor (private value: T) {}
  public map<U> (f: (t: T) => U) {
    return new OK<E, U>(f(this.value))
  }
  public fold<X> (fail: (e: E) => X, success: (t: T) => X): X {
    return success(this.value)
  }
  public toEither (): Either.Either<E, T> {
    return Either.right(this.value)
  }
}

export class Fail<E extends Semigroup<E>, T> implements Validation<E, T> {
  constructor (private error: E) {}
  public map<U> (f: (t: T) => U) {
    return new Fail<E, U>(this.error)
  }
  public fold<X> (fail: (e: E) => X, success: (t: T) => X): X {
    return fail(this.error)
  }
  public toEither (): Either.Either<E, T> {
    return Either.left(this.error)
  }
}

export const ok = <E extends Semigroup<E>, T>(t: T) => new OK<E, T>(t)
export const fail = <E extends Semigroup<E>, T>(e: E) => new Fail<E, T>(e)
export const pure = ok
