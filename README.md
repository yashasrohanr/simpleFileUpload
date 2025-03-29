### Starting Client

In the `client` folder, Use following commands for various tasks -

- Run `npm install` to install all the dependencies
- Run `npm start` to start the server in development mode [http://localhost:3000](http://localhost:3000)
- Run `npm test` Launches the test runner in the interactive watch mode
- Run `npm run build` Builds the app for production to the `build` folder.

### Starting Server

Create `.env` file in server folder, following environment variables are required to get started, see config file to get the whole list of env data.
- `NODE_ENV` Server environment
- `PORT` Server port
- `DB_URI` Database URL(MongoDB)
- `API_URL` URL of CLient App


#### Setup

In `server` folder, Use following commands for various tasks -

- Run `npm install` to install all the dependencies
- Run `npm run dev` to run the dev server in watch mode
- Run `npm run build` to build the application
- Run `npm start` to start the server

## To Use Cloud Functionality

The app supports both local file storage and AWS S3 cloud storage. To enable cloud functionality (S3), add the following optional variables in your `.env` file:

- `AWS_ACCESS_KEY_ID` Your AWS access key ID (provided by AWS).
- `AWS_SECRET_ACCESS_KEY`  Your AWS secret access key (provided by AWS).
- `AWS_REGION` The AWS region where your S3 bucket is hosted (e.g., us-east-1, eu-west-1).
- `AWS_S3_BUCKET_NAME` The name of your S3 bucket where files will be stored and retrieved from.

Make sure these variables are added to your environment configuration to enable S3-based file handling.
