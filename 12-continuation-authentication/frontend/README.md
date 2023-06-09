# Frontend

## GOTCHAS

- env variables are given when using create-react-app projects so you dont need to install dotenv
- your variable names in the .env need to start with `REACT_APP_`

```.env

REACT_APP_BACKEND_URL=http://localhost:8000

```

```js
const backendUrl = process.env.REACT_APP_BACKEND_URL;
```

---

## Auth

```js
try {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formState.inputs.name.value,
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
      }),
    }
  );

  const responseData = await response.json();
  console.log(responseData);
} catch (err) {
  console.log(err);
}
```

## fixing Cross origin resource sharing (CORS errors)

- needs to be run on same domain, to fix by adjusting headers using cors

## Hiding google api key

- store the key in .env on server
- create an endpoint to handle requests from frontend and return data via server endpoint

## FormData with image binary data

```js
const formData = new FormData(); //we can attach text and binary data to formdata
formData.append('email', formState.inputs.email.value);
formData.append('name', formState.inputs.name.value);
formData.append('password', formState.inputs.password.value);
formData.append('image', formState.inputs.image.value);
const responseData = await sendRequest(
  `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
  'POST',

  // JSON.stringify({
  //   name: formState.inputs.name.value,
  //   email: formState.inputs.email.value,
  //   password: formState.inputs.password.value,
  // }),

  //because we are adding image data, we use FormData - and NB... it automatically adds the form headers
  formData
);
```

## Delete file from server

```js
//app.js
// handler for all previous middleware yielding errors
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    }); //use file system to delete file off server.
    //we get a callback when delete is done (err)=>{} - you get err if there is an error
  }
});
```

## when uploading a file to server, to gain access to file via api

- specify which files in which folder to return

```js
const path = require('path');
app.use('/uploads/images/', express.static(path.join('uploads', 'images'))); //only files in uploads/images are returned...
```

## useAuth hook

- the useAuth hook destructures and plugs into AuthContext.Provider

```js
//App.js
import { useAuth } from './shared/hooks/auth-hook';
import { AuthContext } from './shared/context/auth-context';

const { token, login, logout, userId } = useAuth();

<AuthContext.Provider
  value={{
    isLoggedIn: !!token, //token converted to boolean
    token: token,
    userId: userId,
    login: login,
    logout: logout,
  }}
></AuthContext.Provider>;
```

## env variables on frontend

- in .env file (automatically picked up by react-scripts)
- has to start with "REACT_APP\_"

## building for production (USING Render)

- react scripts automatically picks up file named .env.production if you need to set variables for production put it in this file
- this is useful if you want to use different api keys for production vs development

- instead of using Heroku (no free tier anymore) use render https://dashboard.render.com/

- render.com - if you add the project - it asks for build command
- render by default uses node version 14.17.0
- to use different version add a env variable called NODE_VERSION=18.14.2 (fetch is only supported from node v17 onwards)

```shell
npm i
```

- start command

```shell
npm run start
```

### deploying the frontend

- using static hosting site such as firebase
- install firebase cli https://firebase.google.com/docs/cli#install-cli-windows

- (google account)

- should you have trouble deploying because "Error: Failed to get Firebase project maximilian-nodejsmern-frontend. Please make sure the project exists and your account has permission to access it." first logout `firebase logout`

```shell
firebase logout
firebase login
```

-(from the folder you want firebase to host) eg. frontend/ folder

```shell
firebase init
```

- deploy frontend

```shell
firebase deploy
```

###
