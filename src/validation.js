export class ValidationError extends Error {
  constructor (errors) {
    super('Validation Error')
    this.errors = errors
    this.name = this.constructor.name
  }
}


export const validationErrorHandler = (err, _, res, next) => {
  if (err instanceof ValidationError) {
    res.status(422).json(err.errors)
  } else {
    next(err)
  }
}

export const validate = (schema) => async (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (result.success) {
    next()
  } else {
    next(new ValidationError(result.error.flatten().fieldErrors))
  }
}
