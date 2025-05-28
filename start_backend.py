
#!/usr/bin/env python3
"""
Simple script to start the Storm Platform backend
Run this with: python start_backend.py
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    try:
        print("Installing requirements...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "fastapi", "uvicorn", "sqlalchemy", "bcrypt", "pyjwt", "python-multipart"])
        print("Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Failed to install requirements: {e}")
        return False
    return True

def start_server():
    """Start the FastAPI server"""
    try:
        print("Starting Storm Platform API server on http://localhost:8000")
        print("Press Ctrl+C to stop the server")
        subprocess.run([sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"])
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to start server: {e}")

if __name__ == "__main__":
    print("Storm Platform Backend Starter")
    print("=" * 50)
    
    if not os.path.exists("main.py"):
        print("Error: main.py not found in current directory")
        sys.exit(1)
    
    # Install requirements first
    if install_requirements():
        # Start the server
        start_server()
    else:
        print("Failed to install requirements. Please install them manually:")
        print("pip install fastapi uvicorn sqlalchemy bcrypt pyjwt python-multipart")
