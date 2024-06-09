import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../untils/firebase';
import database from '@firebase/database'
import { User } from 'firebase/auth';
import { get, ref } from 'firebase/database';

interface UserProgress{
  id: string;
  idLevel: string,
  displayName: string,
  xp: number
}
const BSXScreen = () => {
  const [xp, setXp] = useState<UserProgress[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubcride = FIREBASE_AUTH.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubcride();
  }, []);

  useEffect(() => {
    const userRef = ref(FIREBASE_DB, 'UserProgress'); // tham chiếu đến node UserProgress
    get(userRef)
      .then((snapshot) => {
        const data: UserProgress[] = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          data.push({
            id: childSnapshot.key,
            displayName: childData.displayName,
            idLevel: childData.idLevel,
            xp: childData.xp,
          });
        });
        setXp(data);
      })
      .catch((error) => {
        console.error('Error getting data:', error);
      });
  }, []);
  console.log(xp)
  return (
    <View>
      {user &&xp.map((progress, index) => (
        <View key={index}>
           <TouchableOpacity style={styles.card}>
           {user.photoURL && (<Image style={styles.image} source={{ uri: user?.photoURL }} />)}
           <View style={styles.cardContent}>
                <Text style={styles.name}>{progress.displayName}</Text>
                <Text style={styles.count}>{progress.xp}</Text>
                <TouchableOpacity
                  style={styles.followButton}>
                  <Text style={styles.followButtonText}>Explore now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
        </View>
        
      ))}
    </View>
  );
}

export default BSXScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#ebf0f7',
  },
  contentList: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 20,
    marginTop: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#ebf0f7',
  },

  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
    borderRadius: 30,
  },

  name: {
    fontSize: 13,
    flex: 1,
    alignSelf: 'center',
    color: '#3399ff',
    fontWeight: 'bold',
  },
  count: {
    fontSize: 14,
    flex: 1,
    alignSelf: 'center',
    color: '#6666ff',
  },
  followButton: {
    marginTop: 10,
    height: 35,
    width: 100,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  followButtonText: {
    color: '#dcdcdc',
    fontSize: 12,
  },
})