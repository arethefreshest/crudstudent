import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from 'react-native-chart-kit'; // You'll likely need to install a charting library
import { Dimensions } from 'react-native'; // To get the screen width

const GradeDistribution = ({ navigation }) => {
    const [gradeCounts, setGradeCounts] = useState({});

    useEffect(() => {
        const calculateGradeDistribution = async () => {
            const studentsCollectionRef = collection(db, 'students');
            const querySnapshot = await getDocs(studentsCollectionRef);
            const studentData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const grades = studentData.map(student => student.Grade);
            const gradeDistribution = {};

            // Assuming letter grades:
            ['A', 'B', 'C', 'D', 'F'].forEach(grade => {
                gradeDistribution[grade] = grades.filter(g => g === grade).length;
            });

            setGradeCounts(gradeDistribution);
        };

        calculateGradeDistribution();
    }, []);

    // Chart Data (for BarChart component)
    const chartData = {
        labels: Object.keys(gradeCounts),
        datasets: [
            {
                data: Object.values(gradeCounts)
            }
        ]
    };

    const screenWidth = Dimensions.get("window").width;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Grade Distribution</Text>
            <BarChart
                data={chartData}
                width={screenWidth}
                height={220}
                yAxisLabel={'#'}
                chartConfig={chartConfig}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    }
});

const chartConfig = {
    // ... Add chart configurations here as needed
};

export default GradeDistribution;
