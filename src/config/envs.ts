
import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars {

      PORT: number

      API_KEY_TESTING: string

      SECRET_KEY_TESTING: string

}

const envsSchema = joi.object({

      PORT: joi.number().required(),

      API_KEY_TESTING: joi.string().required(),

      SECRET_KEY_TESTING: joi.string().required()

}).unknown(true)

const { error, value } = envsSchema.validate(process.env)

if (error) {

      throw new Error(`Config validation error: ${error.message}`)

}

const envVars: EnvVars = value;

export const envs = {

      port: envVars.PORT,

      apiKey: envVars.API_KEY_TESTING,

      secretKey: envVars.SECRET_KEY_TESTING,

}