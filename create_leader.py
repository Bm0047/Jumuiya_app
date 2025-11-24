#!/usr/bin/env python3
"""
Script to create initial leader account for Maria Magdalena Community App

INSTRUCTIONS:
1. Download your Firebase service account key from Firebase Console > Project Settings > Service Accounts
2. Save it as 'firebase-service-account.json' in the same directory as this script
3. Run: python create_leader.py
"""

import firebase_admin
from firebase_admin import credentials, auth, firestore
import json
import os

def create_leader_account():
    """Create initial leader account in Firebase Auth and Firestore"""

    # Check if service account key exists
    if not os.path.exists('firebase-service-account.json'):
        print("❌ ERROR: firebase-service-account.json not found!")
        print("📥 Please download your Firebase service account key from:")
        print("   Firebase Console > Project Settings > Service Accounts > Generate new private key")
        print("💾 Save it as 'firebase-service-account.json' in this directory")
        return None, None, None

    try:
        # Initialize Firebase Admin SDK
        cred = credentials.Certificate('firebase-service-account.json')
        firebase_admin.initialize_app(cred)

        db = firestore.client()

        # Leader credentials
        leader_email = "leader@mariamagdalena.org"
        leader_password = "Leader2024!"  # Change this to a secure password
        leader_name = "Maria Magdalena Leader"

        # Check if user already exists
        try:
            existing_user = auth.get_user_by_email(leader_email)
            print(f"⚠️  Leader account already exists: {existing_user.uid}")
            return existing_user.uid, leader_email, leader_password
        except auth.UserNotFoundError:
            pass  # User doesn't exist, proceed with creation

        # Create user in Firebase Auth
        user = auth.create_user(
            email=leader_email,
            password=leader_password,
            display_name=leader_name
        )

        print(f"✅ Created Firebase Auth user: {user.uid}")

        # Create user document in Firestore members collection
        member_data = {
            'name': leader_name,
            'role': 'Leader',
            'group': 'UWAKA',
            'joinDate': firestore.SERVER_TIMESTAMP,
            'email': leader_email,
            'phoneNumber': '+255-XXX-XXX-XXX',  # Update with actual phone
            'whatsappNumber': '+255-XXX-XXX-XXX',  # Update with actual WhatsApp
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        }

        # Add to members collection
        db.collection('members').document(user.uid).set(member_data)

        print("✅ Created leader document in Firestore")
        print(f"📧 Email: {leader_email}")
        print(f"🔑 Password: {leader_password}")
        print(f"🆔 User ID: {user.uid}")

        return user.uid, leader_email, leader_password

    except Exception as e:
        print(f"❌ Error creating leader account: {e}")
        return None, None, None

if __name__ == "__main__":
    print("🚀 Creating initial leader account for Maria Magdalena Community App")
    print("=" * 70)
    print("This script will create the initial leader account for the community app.")
    print("Make sure you have downloaded the Firebase service account key first!")
    print("=" * 70)

    user_id, email, password = create_leader_account()

    if user_id:
        print("\n" + "=" * 70)
        print("🎉 LEADER ACCOUNT CREATED SUCCESSFULLY!")
        print("=" * 70)
        print(f"Login Email: {email}")
        print(f"Login Password: {password}")
        print("\n⚠️  IMPORTANT: Change the password after first login!")
        print("🔗 App URL: https://maria-magdalena-de-pazzi.web.app")
        print("\n📋 Next Steps:")
        print("1. Login to the app with the credentials above")
        print("2. Change the default password immediately")
        print("3. Start adding community members through Roster Management")
    else:
        print("❌ Failed to create leader account")
        print("Please check the error messages above and try again.")
