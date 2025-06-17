// ZAP Authentication Script for Ebooks App
// This script can be used to handle authentication during DAST scanning

function authenticate(helper, paramsValues, credentials) {
    print("Starting authentication for user: " + credentials.getParam("username"));
    
    // Navigate to login page
    var loginUrl = paramsValues.get("loginUrl") || "http://localhost:80/login";
    helper.sendAndReceive(helper.prepareMessage(new HttpRequestHeader("GET " + loginUrl + " HTTP/1.1\nHost: localhost\n")));
    
    // Extract any CSRF tokens or required form fields
    var loginPageResponse = helper.getLastResponse();
    
    // Prepare login request
    var loginData = "email=" + encodeURIComponent(credentials.getParam("username")) + 
                   "&password=" + encodeURIComponent(credentials.getParam("password"));
    
    var loginRequest = helper.prepareMessage(
        new HttpRequestHeader("POST " + loginUrl + " HTTP/1.1\nHost: localhost\nContent-Type: application/x-www-form-urlencoded\n"),
        loginData
    );
    
    // Send login request
    helper.sendAndReceive(loginRequest);
    
    var loginResponse = helper.getLastResponse();
    
    // Check if authentication was successful
    if (loginResponse.getStatusCode() == 200 || loginResponse.getStatusCode() == 302) {
        print("Authentication successful");
        return helper.getCorrespondingHttpState();
    } else {
        print("Authentication failed with status: " + loginResponse.getStatusCode());
        return null;
    }
}

function getRequiredParamsNames() {
    return ["loginUrl"];
}

function getOptionalParamsNames() {
    return [];
}

function getCredentialsParamsNames() {
    return ["username", "password"];
}
