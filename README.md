# Web Login Example

Build app-less, passwordless login experiences with BindID for customers that want to access your web application. This sample web app uses Node.js to complete strong authentication flows with the BindID service to sign in your users.

## Prerequisites

Before you begin, you'll need to have an application configured in the [BindID Admin Portal](https://admin.bindid-sandbox.io/console/#/applications). From the application settings, obtain the client credentials and configure `http://localhost:8080/redirect` as a redirect URI for this client so that you can run the sample app on your local machine. For more, see [BindID Admin Portal: Get Started](https://developer.bindid.io/docs/guides/admin_portal/topics/getStarted/get_started_admin_portal).

## Instructions

To run the sample on your local machine:  

1 - Install all the needed dependencies:
```bash
npm install
```  

2 - Rename the `.env.template` file to `.env` and configure your client credentials in the file:
```bash
'BINDID_CLIENT_ID' # Client ID obtained from the BindID Admin Portal
'BINDID_CLIENT_SECRET' # Client secret obtained from the BindID Admin Portal
```  

3 - Update the `xm-bind-id-client_id` meta tag in `src/index.html` and `src/redirect.html` with your application's client ID.  

4 - Run the script with nodemon:
```bash 
npm run start
```  

Open [this page](http://localhost:8080) to try out the sample app.  

Note: To run the app on a custom environment, you'll also need to add the redirect URI to your client (via BindID Admin Portal), update the corresponding environment variables, update the `xm-bind-id-redirect_uri` meta tag, and update the `tokenUrl` variable in `src/redirect.js` to your server's `/token` endpoint. 

## What is BindID?
The BindID service is an app-less, strong portable authenticator offered by Transmit Security. BindID uses FIDO-based biometrics for secure, frictionless, and consistent customer authentication. With one click to create new accounts or sign into existing ones, BindID eliminates passwords and the inconveniences of traditional credential-based logins.<br><br>
[Learn more about how you can boost your experiences with BindID.](https://www.transmitsecurity.com/developer)

## Author
Transmit Security, https://github.com/TransmitSecurity

## License
This project is licensed under the MIT license. See the LICENSE file for more info.