import { View, Text, StatusBar, StyleSheet, SafeAreaView, TouchableOpacity, Alert, TextInput } from 'react-native'
import React, { useState } from 'react'
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH} from './untils/firebase';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
const LoginScreen = ()=>{
    const [email, setEmail] = useState('')
    const [password, setPassWord] = useState('')
    const [loading, setLoading] = useState(false)
    const auth = FIREBASE_AUTH;
    const navigation = useNavigation();

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error : any) {
            console.error(error);
            Alert.alert('Sign in failed: ' + error.message)
        } finally {
            setLoading(false);
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'}></StatusBar>
                <View style={styles.title}>
                    <Text style={{fontWeight:'bold', fontSize:30, color:'black'}}>ĐĂNG NHẬP</Text>
                </View>
                <View style={styles.form}>
                    <View style={styles.group1}>
                        <TextInput
                            placeholder="Email Address"
                            value = {email}
                            onChangeText={text => setEmail(text)}
                            style={styles.ip}
                        />
                    </View>
                    <View style={styles.group1}>
                        <TextInput
                            secureTextEntry={true}
                            placeholder='PassWord'
                            value={password}
                            onChangeText={text => setPassWord(text)} 
                            style={styles.ip}
                        />
                    </View>
                    <View style={styles.group2}>
                        <View>
                            <TouchableOpacity style={styles.btn} onPress={signIn}>
                                <Text style={styles.btnText}>ĐĂNG NHẬP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.bottom} onPress={() => navigation.navigate('SignUp' as never)}>
                        <Text style={[styles.btnText, {color: ' #4c4c4c'}]}>ĐĂNG KÝ</Text>
                    </TouchableOpacity>
                </View>
        </SafeAreaView>
            
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 30
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
        borderRadius: 10
    },
    group1:{
        marginTop: 10
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

export default LoginScreen;
