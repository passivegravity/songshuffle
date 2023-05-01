import requests

# Set up authentication
client_id = ""
client_secret = ""

# Set up the endpoint URL
endpoint_url = "https://accounts.spotify.com/api/token"

# Set up the request parameters
params = {
    "grant_type": "client_credentials",
    "client_id": client_id,
    "client_secret": client_secret
}

# Make the API request
response = requests.post(endpoint_url, data=params)
data = response.json()

# Extract the access token
access_token = data["access_token"]

print("Access Token:", access_token)
