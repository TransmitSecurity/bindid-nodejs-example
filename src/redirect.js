function sendAuthCodeToServer(authCode) {
    const tokenUrl = 'http://localhost:8080/token';

    // Send the authCode to the application server
    fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authCode }),
    }).then((res) => res.json())
        .then(body => {
            const accessToken = body.access_token;
            const tokenData = JSON.parse(atob(body.id_token.split('.')[1], 'base64'));
            document.getElementById('rawTokenData').textContent = JSON.stringify(tokenData, null, 4);
            setPassportTableData(tokenData);
            setAliasState(tokenData, accessToken);
            document.getElementById('successCard').classList.remove('visually-hidden');
        }).catch((error) => {
            console.error(error);
        });
}

function handleError(err) {
    // Process the authentication error
    console.error(err);
}

window.addEventListener('DOMContentLoaded', (event) => {

    window.XmBindId.processRedirectResponse().then(
        (res) => {
            sendAuthCodeToServer(res.code);
        },
        (err) => {
            handleError(err);
        }
    );
});


function setPassportTableData(tokenData) {
    const tableData = [
        {
            tableRowId: 'tableUserId',
            tableRowData: tokenData.sub
        },
        {
            tableRowId: 'tableUserAlias',
            tableRowData: tokenData.bindid_alias || 'Not set'
        },
        {
            tableRowId: 'tableUserRegistered',
            tableRowData: Date(tokenData.bindid_network_info?.user_registration_time)
        },
        {
            tableRowId: 'tableUserFirstSeen',
            tableRowData: Date(tokenData.bindid_info.capp_first_login)
        },
        {
            tableRowId: 'tableUserFirstConfirmed',
            tableRowData: Date(tokenData.bindid_info.capp_first_confirmed_login) || 'Never'
        },
        {
            tableRowId: 'tableUserLastSeen',
            tableRowData: Date(tokenData.bindid_info?.capp_last_login) || 'Never'
        },
        {
            tableRowId: 'tableUserLastSeenByNetwork',
            tableRowData: Date(tokenData.bindid_network_info?.user_last_seen) || 'Never'
        },
        {
            tableRowId: 'tableTotalProvidersConfirmed',
            tableRowData: tokenData.bindid_network_info?.confirmed_capp_count || '0'
        },
        {
            tableRowId: 'tableRegisteredDevice',
            tableRowData: Date(tokenData.bindid_info?.capp_last_login_from_authenticating_device) || 'Never'
        },
        {
            tableRowId: 'tableConfirmedDevice',
            tableRowData: tokenData.acr?.includes('ts.bindid.app_bound_cred') ? 'Yes' : 'No'
        },
        {
            tableRowId: 'tableAuthDeviceLastSeen',
            tableRowData: Date(tokenData.bindid_info?.capp_last_login_from_authenticating_device) || 'Never'
        },
        {
            tableRowId: 'tableAuthDeviceLastSeenByNetwork',
            tableRowData: Date(tokenData.bindid_network_info?.authenticating_device_last_seen) || 'Never'
        },
        {
            tableRowId: 'tableTotalDevices',
            tableRowData: tokenData.bindid_network_info?.device_count || 0
        }
    ];

    for (const elem of tableData) {
        document.getElementById(elem.tableRowId).textContent = elem.tableRowData;
    }
}

function setAliasState(tokenData, accessToken){
    if (tokenData.bindid_alias) return;

    document.getElementById("setAliasContainer").style.display = "block";
    document.getElementById("setAliasButton").onclick = () => {
        const message = `
        Please type an Alias to associate with this user.\n
        Before using the feedback API to set the user alias remember to first 
        identify the user with your existing authentication method.
        `;
        const selectedAlias = prompt(message);
        if (!selectedAlias || selectedAlias.length === 0) return;

        updateUserAlias(selectedAlias, accessToken);
    }
}

function updateUserAlias(alias, accessToken) {
    const tokenUrl = 'http://localhost:8080/set-alias';
    
    fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alias, accessToken }),
    }).then((res) => res.json())
        .then(body => {
            document.getElementById("setAliasContainer").style.display = "none";
            document.getElementById("tableUserAlias").innerText = alias;
        }).catch((error) => {
            console.error(error);
        });
}    
