import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FIREBASE_DB } from '../untils/firebase';
import {getDatabase, ref, onValue} from 'firebase/database'
import { useNavigation, useRoute } from '@react-navigation/native';
import { readDataToRealTimeDB } from '../untils/DataHelper';
import {LinearGradient} from 'react-native-linear-gradient';

interface Level {
  id: string;
  LevelSTT: number;
  Name: string;
  Description: string;
  NumRequired: number;
}
interface Topic {
  id: string;
  Id_Levels: string;
  TopicSTT: number;
  Name: string;
  Description: string;
  NumRequired: number;
}
interface Lessons {
  id : string;
  IdTopic : string;
  Name: string;
}

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [itemdata, setItemData] = useState<Lessons[]>([]);
  const [titledata, setTitleData] = useState<Topic[]>([]);
  const [levelsData, setLevelsData] = useState<Level[]>([]);
  const route = useRoute();
  const {id} = route.params as {id: string} || {id: '-NsEcdVB-psJKN0bOw01'};

  useEffect(() => {

    const fetchDataItem = () => {
      const quizzsRef = ref(FIREBASE_DB, 'Lessons');
      onValue(quizzsRef, (snapshot) => {
        const data: Lessons[] = [];
        snapshot.forEach((childSnapshot) => {
          data.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setItemData(data);
      });
    };

    const fetchDataTitle = () => {
      const quizzsRef = ref(FIREBASE_DB, 'Topics');
      onValue(quizzsRef, (snapshot) => {
        const data: Topic[] = [];
        snapshot.forEach((childSnapshot) => {
          data.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setTitleData(data);
      });
    };

    readDataToRealTimeDB('Levels', (data: any[]) => {
      // Chuyển đổi dữ liệu thành mảng các đối tượng Level với ID
      const levels: Level[] = data.map((item) => ({ id: item.id, ...item }));
      setLevelsData(levels); // Cập nhật state levelsData với dữ liệu đã thêm ID
    });

    fetchDataItem();
    fetchDataTitle();
    
  }, []);

  const renderTitle = () => {
    const filteredTitles = titledata.filter((topic) => topic.Id_Levels === id);
    // Render title cho từng mục đã lọc
    return filteredTitles.map((topic, index) => (
      <View key={index}>
        <LinearGradient colors={['#62cff4', '#2c67f2']}>
          <View style={styles.title}>
            <Text style={styles.titleText}>{topic.Name}</Text>
          </View>  
        </LinearGradient>   
         {renderItem(topic.id)}
      </View>
    ));
  };

  const renderItem = (Id_Topic: string) => {
    const lessonInTopic = itemdata.filter((lesson ) => lesson.IdTopic === Id_Topic);
    if (lessonInTopic.length === 0) {
      return null;
    }
    return lessonInTopic.map((lesson, index) => (
      
        <LinearGradient colors={['#edf2f2', '#edf2f2']}>
          <View key={index} style={styles.item} >
          <TouchableOpacity onPress={() => {navigation.navigate('Quizzs', {idLesson: lesson.id}) }}>
            <Text style={styles.itemText}>{lesson.Name}</Text>
          </TouchableOpacity>
          </View>
        </LinearGradient>
      
    ))
  };

  const filteredTitles = titledata.filter((topic) => topic.Id_Levels === id);

  return (
    <View style={styles.container}>
      <LinearGradient style={styles.header} colors={['#18A5A7', '#BFFFC7']}> 
        <TouchableOpacity onPress={() => { navigation.navigate('Levels' as never) }}>
          {levelsData && levelsData
          .filter((level: Level) => level.id === id) //-NsEcdVB-psJKN0bOw01
          .map((level: Level, index: number) => (
            <Text key={index} style={styles.headerText}>{level.Name}</Text>
          ))}
        </TouchableOpacity>

      </LinearGradient>
        {renderTitle()}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'lightblue',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    color: '#8ee000'
  },
  itemText: {
    fontSize: 16,
  },
  title: {
    padding: 10,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    
  },
});

export default HomeScreen