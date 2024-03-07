import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {collection, doc, getDocs, query, where} from 'firebase/firestore';
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';


const GradeDistribution = ({ navigation }) => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [gradeCounts, setGradeCounts] = useState({});
    const screenWidth = Dimensions.get("window").width;




    useEffect(() => {
        const fetchC = async () => {
            const CollectionRef = collection(db, 'students');
            const Snapshot = await getDocs(CollectionRef);



            const Map = {};
            Snapshot.forEach((doc) => {
                const data = doc.data();
                Map[data.classID] = data.className;
            });
            setClasses(Object.keys(Map).map(key => ({ classID: key, className: Map[key] })));
        };
        fetchC();
    }, []);




    useEffect(() => {

        if (selectedClass) {
            calculate(selectedClass);
        }
    }, [selectedClass]);




    const calculate = async (selectedClassId) => {
        try {
            const studentsCollectionRef = collection(db, 'students');
            const q = query(studentsCollectionRef, where("classID", "==", selectedClass));
            const querySnapshot = await getDocs(q);
            const grades = querySnapshot.docs.map(doc => doc.data().Grade);
            const gradeDistribution = {};

            ['A', 'B', 'C', 'D', 'E', 'F'].forEach(grade => {
                gradeDistribution[grade] = grades.filter(g => g === grade).length;
            });
            setGradeCounts(gradeDistribution);
        } catch (error) {
            console.error("Failed to calculate grade distribution: ", error);
        }
    };





    const Data = {
        labels: Object.keys(gradeCounts).length > 0 ? Object.keys(gradeCounts) : ['A', 'B', 'C', 'D', 'E', 'F'],
        datasets: [
            {
                data: Object.values(gradeCounts).length > 0 ? Object.values(gradeCounts) : [0, 0, 0, 0, 0, 0],
            }
        ]
    };




    return (
        <View style={styles.container}>
            <Text style={styles.title}>Grade Distribution</Text>
            <Picker
                selectedValue={selectedClass}
                onValueChange={(itemValue, itemIndex) => {setSelectedClass(itemValue);calculate(itemValue);}}
                style={styles.pickerStyle}>
                {classes.map((cls) => (<Picker.Item key={cls.classID} label={cls.className} value={cls.classID} />))}
            </Picker>
            {selectedClass && <View style={styles.chartWrapper}>
                <BarChart
                    data={Data}
                    width={400}
                    height={300}
                    yAxisLabel={''}
                    chartConfig={chartConfig}
                    fromZero={true}
                    yAxisInterval={0}
                    style={styles.BarChart}/>
            </View>}
        </View>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 80,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    pickerStyle: {
        height: 50,
        width: 250,
        marginBottom: 250,
    },
    BarChart: {
        borderRadius: 15,
        borderColor: "#964700",
        borderWidth: 1,
    },
});

const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#ffa726'
    },
    barPercentage: 1,
};

export default GradeDistribution;