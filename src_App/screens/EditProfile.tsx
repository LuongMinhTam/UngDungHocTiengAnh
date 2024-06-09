import { User, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { FIREBASE_AUTH, FIREBASE_STORAGE, storageRef } from '../untils/firebase';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getDownloadURL, uploadBytes } from 'firebase/storage';

function EditProfile() {
    const navigation = useNavigation<any>();
    type AccountScreenRouteProp = RouteProp<{ account: { name: string } }, 'account'>;
    const [user, setUser] = useState<User | null>(null)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [passWord, setPassWord] = useState('');
    const [avatar, setAvatar] = useState(null);

useEffect(() => {
    const unsubcride = FIREBASE_AUTH.onAuthStateChanged((user) => {
      setUser(user);
      if(user) {
        setName(user.displayName || '');
      }
    });

    return () => unsubcride();
  }, []);

  const handleChange = async () => {
    try{
        if(!user) {return;}
        else{
            await updateProfile(user, {displayName: name}); 
            navigation.navigate("account", {name: user.displayName});
            console.log("Edit successful")
        }  
    } catch (error) {
        console.error("Error editing  profile: ", error);
    }
  }
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

      const reference = storageRef(FIREBASE_STORAGE, `images/${user?.uid}`);

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

return (
    <View style={styles.container}>
        <View style={styles.avatarContainer}>
          {avatar && (
            <Image
            source={{ uri: avatar }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          )}
          {!avatar && user?.photoURL && (
            <Image
            source={{ uri: user.photoURL }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          )}
            <TouchableOpacity style={styles.changeAvatarButton} onPress={() => {ImagePicker()}}>
                <Text style={styles.changeAvatarButtonText}>Change Avatar</Text>
            </TouchableOpacity>
        </View>
        {user && user.displayName && user.email && (
            <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder={user.email}
                editable= {false}
            />
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
            />
            <TouchableOpacity style={styles.button} onPress={() => handleChange()}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
        )}
        
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    },
    form: {
    width: '80%',
    },
    label: {
    marginTop: 20,
    },
    input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    },
    button: {
    marginTop: 20,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    },
    buttonText: {
    color: '#fff',
    fontSize: 18,
    },
    avatarContainer: {
    marginTop: 20,
    alignItems: 'center',
    },
    avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    },
    changeAvatarButton: {
    marginTop: 10,
    },
    changeAvatarButtonText: {
    color: '#1E90FF',
    fontSize: 18,
    },
});

export default EditProfile