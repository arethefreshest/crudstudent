import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Button } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const StudentList = ({ navigation }) => {
    const [students, setStudents] = useState([]);
    const [selectedId, setSelectedId] = useState(null); // New state for tracking selected row

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "students"));
                const studentList = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    // Format the date here if necessary
                    const formattedDOB = data.DOB.toDate().toLocaleDateString("en-US");
                    return { id: doc.id, ...data, DOB: formattedDOB };
                });
                setStudents(studentList);
            } catch (error) {
                console.error("Error fetching student data: ", error);
            }
        };

        fetchStudents();
    }, []);

    // Function to handle delete action
    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "students", id));
        setStudents(students.filter((student) => student.id !== id));
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.row, item.id === selectedId && { backgroundColor: 'lightgrey' }]}
            onPress={() => setSelectedId(item.id === selectedId ? null : item.id)}
        >
            {/* Student Data */}
            <Text style={styles.cell}>{item.classID}</Text>
            <Text style={styles.cell}>{item.fName}</Text>
            <Text style={styles.cell}>{item.lName}</Text>
            <Text style={styles.cell}>{item.DOB}</Text>
            <Text style={styles.cell}>{item.className}</Text>
            <Text style={styles.cell}>{item.Score}</Text>
            <Text style={styles.cell}>{item.Grade}</Text>

            {selectedId === item.id && (
                <View >
                    <Button style={styles.button} title="Edit" onPress={() => handleEdit(item.id)} color="Black" />
                    <Button style={styles.button} title="Delete" onPress={() => handleDelete(item.id)} color="Black" />
                </View>
            )}
        </TouchableOpacity>
    );


    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.table}>
                <Text style={styles.header}>Student List</Text>
                <View style={styles.row}>
                    <Text style={styles.cellHeader}>Class ID</Text>
                    <Text style={styles.cellHeader}>First Name</Text>
                    <Text style={styles.cellHeader}>Last Name</Text>
                    <Text style={styles.cellHeader}>DOB</Text>
                    <Text style={styles.cellHeader}>Class Name</Text>
                    <Text style={styles.cellHeader}>Score</Text>
                    <Text style={styles.cellHeader}>Grade</Text>
                </View>
                <FlatList
                    data={students}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    extraData={selectedId}
                />
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
    },
    table: {
        flex: 1,
        margin: 20,
        // Add additional styling for table-like appearance if necessary
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        // Add additional styling for rows if necessary
    },
    cell: {
        flex: 1,
        fontSize: 9,
        padding: 3,
        // Add additional styling for cells if necessary
    },
    cellHeader: {
        flex: 1,
        fontSize: 10,
        fontWeight: 'bold',
        padding: 3,
        // Add additional styling for header cells if necessary
    },

});

export default StudentList;