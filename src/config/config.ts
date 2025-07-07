import dotenv from 'dotenv';
dotenv.config();


interface ConfigType {
  JWT_SECRET_KEY: string | any;
  JWT_EXPIRATION: string | any;
  JWT_COOKIE_EXPIRATION: string | any;
  S3_BUCKET_NAME: string | any;
  S3_DIRECTORY_NAME: string | any;
  APP_PORT: string | any;
  AWS_ACCESS_KEY: string | any;
  AWS_SECRET_KEY: string | any;
  AWS_REGION: string | any;
}

const CONFIG: ConfigType = {
  'JWT_SECRET_KEY': process.env.JWT_SECRET_KEY,
  'JWT_EXPIRATION': process.env.JWT_EXPIRATION,
  'JWT_COOKIE_EXPIRATION': process.env.JWT_COOKIE_EXPIRATION,
  'S3_BUCKET_NAME': process.env.S3_BUCKET_NAME,
  'S3_DIRECTORY_NAME': process.env.S3_DIRECTORY_NAME,
  'APP_PORT': process.env.APP_PORT,
  'AWS_ACCESS_KEY': process.env.AWS_ACCESS_KEY,
  'AWS_SECRET_KEY': process.env.AWS_SECRET_KEY,
  'AWS_REGION':process.env.AWS_REGION
};

export default CONFIG;