require("dotenv").config();
const express = require("express");
const cors = require('cors');
const axios = require('axios');
const path = require("path");
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + '/src/'));

/**
 * Making sure that the required environment variables are filled out
 */
const requiredEnvParams = [
  'BINDID_CLIENT_ID',
  'BINDID_CLIENT_SECRET',
  'REDIRECT_URI',
  'PORT'
];

for (const param of requiredEnvParams) {
  if (!process.env[param] || process.env[param].length === 0) {
    console.warn(
      `WARNING: Parameter ${param} is undefined, unexpected behaviour may occur, check your environment file`
    );
  }
}

/**
 * Site root
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/src/index.html`));
});

/**
 * The page your users will return to post authentication
 */
app.get("/redirect", (req, res) => {
  res.sendFile(path.join(`${__dirname}/src/redirect.html`));
});

/**
 *  Exchanges auth code for the user token id
 */
app.post('/token', async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', req.body.code);
    params.append('redirect_uri', process.env.REDIRECT_URI);
    params.append('client_id', process.env.BINDID_CLIENT_ID);
    params.append('client_secret', process.env.BINDID_CLIENT_SECRET);

    const tokenResponse = await axios({
      method: 'post',
      url: 'https://signin.bindid-sandbox.io/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: params
    });
    res.status(200).json(tokenResponse.data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post('/set-alias', async (req, res) => {
  const { alias, accessToken } = req.body;

  if (!alias, !accessToken) {
    res.status(500).json({ error: `Missing body params required by BindID API` });
    return;
  }

  const data = {
    'subject_session_at': accessToken,
    'reports': [{
      'type': 'authentication_performed',
      'alias': alias,
      'time': Math.round(Date.now() / 1000)
    }]
  }

  let feedbackAuth = crypto.createHmac('sha256', process.env.BINDID_CLIENT_SECRET).update(accessToken).digest('base64');
  let authorizationHeader = `BindIdBackend AccessToken ${accessToken}; ${feedbackAuth}`;

  const sessionFeedbackUrl = "https://api.bindid-sandbox.io/session-feedback";
  
  try {
    const aliasResponse = await axios({
      method: "post",
      url: sessionFeedbackUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorizationHeader
      },
      data: data,
    });
    res.status(200).json(aliasResponse.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Internal Server Error` });
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Example app listening port ${port}`)
})
