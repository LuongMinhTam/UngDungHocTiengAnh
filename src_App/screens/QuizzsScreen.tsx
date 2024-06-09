import React, { useEffect, useState } from 'react'
import { Alert, Animated, Text, TouchableOpacity, View } from 'react-native'
import { StyleSheet } from 'react-native'
import QuizzHeader from  './../components/QuizzsHeader'
import { useNavigation, useRoute } from '@react-navigation/native';
import { readDataToRealTimeDB, writeDataToRealTimeDB } from '../untils/DataHelper';
import { User } from 'firebase/auth';
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from '../untils/firebase';
import  firebase  from 'firebase/app';
import 'firebase/database';
import { get, ref, set, update } from 'firebase/database';

interface Quizz{
    id: string;
    Id_Lesson: string;
    QuizzsStt: number;
    Type: string;
    Question: string;
    Answers: string[];
    CorrectAnswer: string;
    Explanation: string;
}
interface UserProgress {
    id: string;
    idLevel: string;
    idUser: string;
    xp: number;
}
function QuizzsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const {idLesson} = route.params as {idLesson: string}
    //Dữ liệu
    const [quizzsData, setQuizzsData] = useState<Quizz[]>([]);
    const [user, setUser] = useState<User | null>(null)
    //Dùng trong trang
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswerSelected, setCorrectAnswerSelected] = useState<null | Boolean>(null);
    const [showScore, setShowScore] = useState(false);
    const [answerSelected, setAnswerSelected] = useState(false);

// Hàm chọn đáp án
    const handleSelect = () => {
        setAnswerSelected(true); // Đánh dấu là đã chọn đáp án
    }

    useEffect(() => {
        readDataToRealTimeDB('Quizzs', (data: any[]) => {
            const quizz : Quizz[] = data.filter((quizz) => quizz.Id_Lesson === idLesson) //data.map((item) => ({id:item.id,...item}));
            console.log(quizz);
            setQuizzsData(quizz);
        });
    }, [idLesson]);
    useEffect(() => {
        const unsubcride = FIREBASE_AUTH.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubcride();
        
    }, []);
    console.log(correctAnswerSelected);
    console.log(score);


    
    //Hàm chọn đáp án
    const handleAnswer = (selectedAnswer: any) => {
        const answer = quizzsData[currentIndex]?.CorrectAnswer;
            setCorrectAnswerSelected(answer === selectedAnswer);
            setAnswerSelected(true);
    }
    
    //Hàm chuyển sang quizz nếu đáp án đúng và nếu đã xong hết quizz thì sẽ hiện điểm
    const handldeNextQuizz = () => {
        const nextQuizz = currentIndex + 1;
        console.log([nextQuizz,quizzsData.length])
        if(nextQuizz < quizzsData.length && correctAnswerSelected){
            setScore((prevScore) => prevScore + 1);
            setCorrectAnswerSelected(null);
            setCurrentIndex(nextQuizz);
            setAnswerSelected(false);
        } else if (nextQuizz < quizzsData.length && !correctAnswerSelected){
            setCorrectAnswerSelected(null);
            setCurrentIndex(nextQuizz);
            setAnswerSelected(false);
        } else if (nextQuizz >= quizzsData.length && correctAnswerSelected) { 
            setScore((prevScore) => prevScore + 1);
            setShowScore(true);
        } else if (nextQuizz >= quizzsData.length && !correctAnswerSelected) {
            setShowScore(true);
        }
        Animated.timing(progress, {
            toValue: currentIndex+1,
            duration: 400,
            useNativeDriver: false
        }).start()
    }

    const handleFinish = async () => {
        setCurrentIndex(0);
        setScore(0);
        setShowScore(false);
        Animated.timing(progress, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false
        }).start()
        /*const lessonCompleted = ref(FIREBASE_DB, 'LessonCompleted/');
        set(lessonCompleted, {
            idLesson: idLesson,
            idUserProgress: user?.uid
        })*/
        navigation.navigate('home' as never)
    }
    const handleExit = () => {
        setCurrentIndex(0);
        setScore(0);
        setShowScore(false);
        Animated.timing(progress, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false
        }).start()
        navigation.navigate('home' as never)
    }

    firebase
    const updateScore = async (newScore: number) => {
        try {
            // Xác định đường dẫn cụ thể cho điểm số của người dùng
            const userScoreRef = ref(FIREBASE_DB, `UserProgress/${user?.uid}/xp`);
            const snapshot = await get(userScoreRef);
            const currentScore = snapshot.val();
            if (currentScore == null) {
                console.error('Current score is not available');
                console.log("Snapshot: " + userScoreRef)
                console.log("user id: " + user?.uid);
                console.log("currentScore: " + currentScore);
                return;
            }
            const newXp = currentScore + newScore;
            console.log("New Score: " + newScore);
            await set(userScoreRef, newXp);
        
            console.log('Score updated successfully');
          } catch (error) {
            console.error('Error updating score:', error);
          }
    }

    const [progress, setProgress] = useState(new Animated.Value(0));
    const progressAnim = progress.interpolate({
        inputRange:[0, quizzsData.length],
        outputRange: ['0%', '100%']

    })
    const renderProgressBar = () => {
        return (
            <View style={{
                width:'100%',
                height: 20,
                borderRadius: 20,
                backgroundColor: '#4c4c4c',
            }}>
                <Animated.View style={[{
                    height: 20,
                    borderRadius: 20,
                    backgroundColor: '#8ee000',
                },{
                    width: progressAnim
                }]}>
                    
                </Animated.View>
            </View>
        )
    }

    const renderQuestion = () => {
        return (
            <View>
                <View style={{flexDirection:'row', alignItems:'flex-end'}}>
                    <Text style={{fontSize:20, opacity: 0.6, marginRight:2}}>{currentIndex + 1}</Text>
                    <Text style={{fontSize: 18, opacity: 0.6, }}>/ {quizzsData.length}</Text>
                </View>
                <Text style={{fontSize: 30}}>{quizzsData[currentIndex]?.Question}</Text>
            </View>
        )
    }

    const renderAnswers = () => {
        return quizzsData[currentIndex]?.Answers.map((item, index) => {
          return (
            <TouchableOpacity
              key={index} // Thêm key vào mỗi phần tử
              onPress={() => handleAnswer(item)}
              style={styles.answerContainer}
            >
              <Text style={styles.answerText}>{item}</Text>
            </TouchableOpacity>
          );
        });
      };

  return (
    <View style={styles.mainContainer}>
        
        {showScore ? 
        <View>
            <Text style={{ fontSize: 35 }}>{score}</Text>
            <TouchableOpacity  onPress={() => { handleFinish(), updateScore(score) }} style={styles.btnReset}>
            <Text style={styles.btnText}>KẾT THÚC</Text>
            </TouchableOpacity>
        </View> : 
            <View style={styles.Container}>
                <View style={styles.btnExit}>
                    <TouchableOpacity onPress={() => handleFinish()}>
                        <Text style={styles.exitText}>X</Text>
                    </TouchableOpacity>  
                </View>
                    {renderProgressBar()}
                    {renderQuestion()}
                    {renderAnswers()}
                    
                    {!answerSelected && (
                    <View>
                        <TouchableOpacity
                            style={styles.btnCheck}
                        >
                            <Text style={{ color: '#f0f0f0', fontWeight: 'bold', fontSize: 20 }}>CHECK ANSWER</Text>
                        </TouchableOpacity>
                    </View>
                    )}
                    {answerSelected && (
                    <View>
                        <TouchableOpacity
                            onPress={() => handldeNextQuizz()}
                            style={styles.btnCheck}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>NEXT QUESTION</Text>
                        </TouchableOpacity>
                    </View>
                    )}
        </View>
        }
    </View>
  )
}

export default QuizzsScreen

const styles = StyleSheet.create({

mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
},
Container: { 
    flex: 1,
    width: '100%',
    paddingHorizontal: 10
},
btnExit: {
    marginTop: 20,
    marginLeft: 10,
},
exitText: {
    fontSize:30,
    fontWeight:'bold',
},
QuizzContainer: {
    flex: 3,
    backgroundColor: '@DDDDDD',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    justifyContent: 'center'
},
questionText: {
    fontSize: 25,
    top: 0,
    marginBottom: 200
},
answerContainer: {
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 20,
    marginVertical: 10,
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,


},
answerText: {
    fontSize: 18,
    padding: 5,
    alignSelf: 'center',
    color: '##2d2e2d'
},
btnCheck: {
    backgroundColor: 'green',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderWidth: 0.5,
    borderRadius: 20,
    bottom: 0,
    left: 0,
    right: 0,  
},
btnText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 20,
    letterSpacing: 1,
  },
btnReset: {
backgroundColor: "#333",
paddingHorizontal: 5,
paddingVertical: 15,
width: "50%",
borderRadius: 15,
marginTop: 20,
},
})