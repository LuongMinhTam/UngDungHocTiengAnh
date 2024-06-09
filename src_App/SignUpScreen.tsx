import React, { useEffect, useState } from 'react'
import { Alert, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FIREBASE_AUTH, FIREBASE_DB } from './untils/firebase'
import { useNavigation } from '@react-navigation/native'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { readDataToRealTimeDB } from './untils/DataHelper'

interface Level {
    id: string;
    LevelSTT: number;
    Name: string;
    Description: string;
    NumRequired: number;
  }

function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassWord] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [idLevel, setIdLevel] = useState('');
    const [levelsData, setLevelsData] = useState<Level[]>([]);
    const auth = FIREBASE_AUTH;
    const navigation = useNavigation();

    useEffect(() => {
        readDataToRealTimeDB('Levels', (data: any[]) => {
          const level : Level[] = data.map((item) => ({id:item.id,...item}));
          setLevelsData(level);
        });
      }, []);
      
      useEffect(() => {
        const firstLevelId = levelsData.length > 0 ? levelsData[0].id : '';
        console.log('ID của level đầu tiên:', firstLevelId);
        setIdLevel(firstLevelId)
      }, [levelsData]);

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                updateProfile(user, {
                    displayName: name
                }).then(() => {
                    const userId = user.uid;
                    const userProgressDataRef = ref(FIREBASE_DB, `UserProgress/${userId}`);
                    set(userProgressDataRef, {
                        idLevel: idLevel,
                        displayName : name,// Ghi ID của người dùng vào node UserProgress
                        xp: 0,
                    });
                    const userDataref = ref(FIREBASE_DB, `Users/${userId}`);
                    set(userDataref, {
                        displayName: name,
                        email: email,
                        password: password,
                    })
                })
            });

            

            FIREBASE_AUTH.signOut();
            Alert.alert('Check your emails!')
            navigation.navigate('Login' as never);
        } catch (error : any) {
            console.error(error);
            Alert.alert('Sign up failed: ' + error.message)
        } finally {
            setLoading(false);
        }
    }

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'}></StatusBar>
        <View style={styles.preScreen}>
            <TouchableOpacity style={styles.btnPreScreen} onPress={() => {navigation.navigate('Login' as never)}}>
                <Text style={styles.btnPreScreenText}>Back</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.title}>
            <Text style={{fontWeight:'bold', fontSize:30, color:'black'}}>ĐĂNG KÝ</Text>
        </View>
        <View style={styles.form}>
            <View style={styles.group1}>
                <TextInput
                    placeholder="Email"
                    value = {email}
                    onChangeText={text => setEmail(text)}
                    style={styles.ip}
                />
            </View>
            <View style={styles.group1}>
                <TextInput
                    placeholder="Tên của bạn"
                    value = {name}
                    onChangeText={text => setName(text)}
                    style={styles.ip}
                />
            </View>
            <View style={styles.group1}>
                <TextInput
                    secureTextEntry={true}
                    placeholder='Mật khẩu'
                    value={password}
                    onChangeText={text => setPassWord(text)} 
                    style={styles.ip}
                />
            </View>
            <View style={styles.group2}>
                <View>
                    <TouchableOpacity style={styles.btn} onPress={signUp} >
                        <Text style={styles.btnText}>ĐĂNG KÝ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 30
    },
    preScreen: {
        marginTop:10 
    },
    btnPreScreen: {

    },
    btnPreScreenText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    title:{
        marginTop: 30,
        alignItems: 'center'
    },
    form:{
        flex:3,
        marginTop: 30
    },
    
    ip:{
        borderWidth:1,
        backgroundColor: '#fff',
        borderColor: '#e3e5e6', 
        borderRadius: 10,
        padding: 10,
        fontSize: 18
    },
    group1:{
        marginTop: 10,
    },
    group2:{
        marginTop: 20
    },
    btn:{
        borderRadius: 10,
        backgroundColor: '#7ac70c',
        marginTop: 10,
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: 'gray'
    },
    btnText:{
        fontSize: 23,
        color: '#f0f0f2',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    bottom: {
        flex:1,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
})