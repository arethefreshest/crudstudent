import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const StudentList = ({ navigation }) => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const studentsCollectionRef = collection(db, 'students');
            const querySnapshot = await getDocs(studentsCollectionRef);
            const studentsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setStudents(studentsList);
        };

        fetchStudents();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.studentRow}>
            <Text style={styles.cell}>{item.fName} {item.lName}</Text>
            <Text style={styles.cell}>{item.DOB.toDate().toDateString()}</Text>
            <Text style={styles.cell}>{item.Grade}</Text>
            <Text style={styles.cell}>{item.Score}</Text>
            <Text style={styles.cell}>{item.classID}</Text>
            <TouchableOpacity style={styles.cell} onPress={() => navigation.navigate('ClassDetails', { classID: item.classID })}>
                <Text>{item.className}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('Dashboard')}>
                <Text>Edit</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={students}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    studentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    cell: {
        marginHorizontal: 5,
    },
    editButton: {
        padding: 'lightgray',
    },
});

export default StudentList;