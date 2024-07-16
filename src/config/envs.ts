
import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars {

      PORT: number

      NATS_SERVERS: string[],

      API_KEY: string
      SECRET_KEY: string

      CREATE_PAYMENT_SESSION_URL: string
      GET_PAYMENT_URL: string

      SUCCESS_URL: string
      BACK_URL: string
      NOTIFICATION_URL: string

}

const envsSchema = joi.object({

      PORT: joi.number().required(),

      NATS_SERVERS: joi.array().items(joi.string()).required(),

      API_KEY: joi.string().required(),
      SECRET_KEY: joi.string().required(),

      CREATE_PAYMENT_SESSION_URL: joi.string().required(),
      GET_PAYMENT_URL: joi.string().required(),

      SUCCESS_URL: joi.string().required(),
      BACK_URL: joi.string().required(),
      NOTIFICATION_URL: joi.string().required()

}).unknown(true)

const { error, value } = envsSchema.validate({
      ...process.env,
      NATS_SERVERS: process.env.NATS_SERVERS.split(',')
})

if (error) {

      throw new Error(`Config validation error: ${error.message}`)

}

const envVars: EnvVars = value;

export const envs = {

      port: envVars.PORT,

      natsServers: envVars.NATS_SERVERS,

      apiKey: envVars.API_KEY,
      secretKey: envVars.SECRET_KEY,

      createPaymentSessionUrl: envVars.CREATE_PAYMENT_SESSION_URL,
      getPaymentUrl: envVars.GET_PAYMENT_URL,

      successUrl: envVars.SUCCESS_URL,
      backUrl: envVars.BACK_URL,
      notificationUrl: envVars.NOTIFICATION_URL

}