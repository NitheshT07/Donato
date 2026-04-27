import requests
import os

BASE_URL = "http://localhost:8000"

def test_upload(email, expected_status):
    print(f"\nTesting upload for {email} (Expected: {expected_status})")
    url = f"{BASE_URL}/food/upload"
    
    # Create a dummy image
    with open("test_image.jpg", "wb") as f:
        f.write(b"fake image data")
        
    files = {
        'image_file': ('test_image.jpg', open('test_image.jpg', 'rb'), 'image/jpeg')
    }
    
    data = {
        'food_type': 'Test Food',
        'quantity': '10',
        'prepared_time': '2023-10-10T10:10:10',
        'location': 'Test Location',
        'donor_email': email
    }
    
    try:
        response = requests.post(url, data=data, files=files)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == expected_status:
            print("SUCCESS: Result matches expectation.")
        else:
            print(f"FAILURE: Expected {expected_status}, got {response.status_code}")
            
    except Exception as e:
        print(f"Error during request: {e}")
    finally:
        files['image_file'][1].close()
        if os.path.exists("test_image.jpg"):
            os.remove("test_image.jpg")

if __name__ == "__main__":
    # Test with NGO (should be 403)
    test_upload("ngo@test.com", 403)
    
    # Test with Donor (should be 200, assuming they exist and are donors)
    test_upload("donor@test.com", 200)
    
    # Test with non-existent user (should be 403)
    test_upload("nonexistent@void.com", 403)
