import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { Text, View , StyleSheet, StatusBar, Button, TouchableOpacity} from 'react-native'
import Swiper from 'react-native-swiper'
import { readDataToRealTimeDB } from '../untils/DataHelper';

interface Level {
  id: string;
  LevelSTT: number;
  Name: string;
  Description: string;
  NumRequired: number;
}

function LevelsScreen() {
  const navigation = useNavigation<any>();
  const [levelsData, setLevelsData] = useState<Level[]>([]);
  const [swiperLocked, setSwiperLocked] = useState(false);

  useEffect(() => {
    readDataToRealTimeDB('Levels', (data: any[]) => {
      const level : Level[] = data.map((item) => ({id: item.id,...item}));
      setLevelsData(level);
    });
  }, []);

  const renderLevels = ({ item, index }: { item: Level; index: number }) => {
    return(
      <View key={item.id} style={{alignItems: 'center'}}>
          <Text style={{ fontSize: 35 }}>{item.Name}</Text>
          <TouchableOpacity  onPress={() => { navigation.navigate('home', { id: item.id }) }} style={styles.btnReset}>
            <Text style={styles.btnText}>Vào làm</Text>
            </TouchableOpacity>          
      </View>
    )
  };

  const handleSwiperIndexChange = (index: number) => {
    if(index === levelsData.length - 1) {
      setSwiperLocked(true);
    } else { 
      setSwiperLocked(false);
    }
  };

  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <Swiper
     showsButtons
     loop={false}
     onIndexChanged={handleSwiperIndexChange}
     >
      {levelsData.map((level, index) => (
        <View style={styles.container}>
        <View style={styles.subContainer}>
          {renderLevels({item: level, index: index })}
        </View>
      </View>
      ))}
    </Swiper>
  )
}

export default LevelsScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#38588b",
    alignItems: "center",
    justifyContent: "center",
  },
  subContainer: {
    backgroundColor: "#38588b",
    width: "90%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  textWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 30,
  },
  score: {
    fontSize: 100,
    color: "#ffffff",
    fontWeight: "bold",
  },
  btnReset: {
    backgroundColor: "#333",
    paddingHorizontal: 5,
    paddingVertical: 15,
    width: "50%",
    borderRadius: 15,
    marginTop: 20,
  },
  btnText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 20,
    letterSpacing: 1,
  },
});