import requests

# Function to create a virtual account using Paystack API
def create_virtual_account(email, first_name, last_name):
    url = "https://api.paystack.co/dedicated_account"  # Paystack endpoint for virtual accounts
    headers = {
        "Authorization": "Bearer sk_live_b413933d1d3c91d10c6c3dfe5395bca5a86967f0",  # Replace with your Paystack secret key
        "Content-Type": "application/json"
    }
    
    # Payload for creating a virtual account
    data = {
        "customer": {
            "email": email,
            "first_name": first_name,
            "last_name": last_name
        },
        "preferred_bank": "wema-bank",  # You can specify a preferred bank or leave it out
        "split_code": None  # Optional, for revenue split setups
    }
    
    # Send the API request
    response = requests.post(url, headers=headers, json=data)
    return response

# Example usage
try:
    email = "test@example.com"
    first_name = "John"
    last_name = "Doe"
    
    # Call the function to create a virtual account
    response = create_virtual_account(email, first_name, last_name)
    
    if response.status_code == 200:
        print("Virtual Account Created Successfully:")
        print(response.json())
    else:
        print("Failed to Create Virtual Account:")
        print(response.status_code, response.json())
except Exception as e:
    print(f"An error occurred: {e}")





# import requests

# # Function to create a virtual account using either BVN or NIN
# def create_virtual_account(email, bvn=None, nin=None):
#     url = "https://api.flutterwave.com/v3/virtual-account-numbers"
#     headers = {
#         "Authorization": "Bearer FLWSECK_TEST-87d4f597b740408fe0c39fad8037e92f-X"
#     }
    
#     # Construct the payload dynamically
#     data = {
#         "email": email,
#         "is_permanent": True
#     }
    
#     # Add BVN or NIN based on availability
#     if bvn:
#         data["bvn"] = bvn
#     elif nin:
#         data["nin"] = nin
#     else:
#         raise ValueError("Either BVN or NIN must be provided")
    
#     # Send the API request
#     response = requests.post(url, headers=headers, json=data)
#     return response

# # Example usage
# try:
#     email = "test@example.com"
#     bvn = "22555040319"  # Replace with a valid BVN or None
#     nin = "65460919817"  # Replace with a valid NIN or None
    
#     response = create_virtual_account(email, bvn=bvn, nin=nin)
#     print(response.status_code, response.json())
# except ValueError as e:
#     print(f"Error: {e}")
