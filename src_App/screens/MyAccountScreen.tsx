import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { User, signOut, updateProfile } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_STORAGE } from '../untils/firebase';
import { storageRef } from '../untils/firebase'; // Import Firebase storage methods
import {uploadBytes, getDownloadURL} from 'firebase/storage'
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { snapshotEqual } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import background from './backgroud.png'

interface CustomImagePickerResponse {
  uri: string;
  // Các thuộc tính khác bạn muốn bao gồm trong đối tượng ImagePickerResponse
}

const MyAccountScreen = () => {
  const nagivation = useNavigation();
  const [user, setUser] = useState<User | null>(null);
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubcride = FIREBASE_AUTH.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubcride();
  }, []);

  const ImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1, 
    }).then(res => {
      if(!res.didCancel){
        //@ts-ignore
        setAvatar(res.assets[0].uri);
        handleUpload();
      }
    }).catch(error => {
      console.log(error);
    })
  }
  const handleUpload = async() => {
    if (avatar) {
      const response = await fetch(avatar); 
      const blob = await response.blob();

      const reference = storageRef(FIREBASE_STORAGE, "images/randomimages");

      uploadBytes(reference, blob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          if (user) {
            updateProfile(user, { photoURL: downloadURL }).then(() => {
              console.log('Avatar updated successfully.');
            }).catch((error) => {
              console.error('Error updating avatar:', error);
            });
          }
        })
      })
    } 
  }

  const handleSignOut = () => {
    if (user) {
      FIREBASE_AUTH.signOut();
    }
  }
  const handleEditPress = () => {

  }

  return (
    <SafeAreaView>
      {user && (
        <View>
         <View style={styles.headerContainer}>
            <Image
              style={styles.coverPhoto}
              source={background}
            />
            <View style={styles.profileContainer}>
              {user.photoURL && (<Image
                style={styles.profilePhoto}
                source={{uri: user.photoURL}}
              />)}
              <Text style={styles.nameText}>{user.displayName}</Text>
            </View>
          </View>
        <View style={styles.statsContainer}>
          <View style={styles.statContainer}>
            <Text style={styles.statCount}>1</Text>
            <Text style={styles.statLabel}>Levels</Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.statCount}>8</Text>
            <Text style={styles.statLabel}>Kinh nghiệm</Text>
          </View>
          <View style={styles.statContainer}>
            <Text style={styles.statCount}>1</Text>
            <Text style={styles.statLabel}>Số bài tập</Text>
          </View>
        </View>
        <View style={styles.form2}>
          <View style={styles.formButton}>
            <TouchableOpacity style={styles.button} onPress={() => nagivation.navigate('editAccount' as never)}>
              <Text style={styles.buttonText}>Edit profile</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
              <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View> 
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
  },
  coverPhoto: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
  },
  profilePhotoOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }], // Sử dụng mảng các đối tượng transform
    zIndex: 1,
  }, 
  profileContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bioContainer: {
    padding: 15,
  },
  bioText: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  statContainer: {
    alignItems: 'center',
    flex: 1,
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 16,
    color: '#999',
  },
  form2: {

  },
  formButton: {

  }, 
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  footer: {
    marginTop: 10 ,
    bottom: 0
  },
});

export default MyAccountScreen;
