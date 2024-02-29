import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, TextInput, ScrollView } from "react-native";

const StudentList = ({ navigation }) => {
    const [students, setStudents] = useState([]);
    const [editRowId, setEditRowId] = useState(null); // ID of row being edited
    const [editRowData, setEditRowData] = useState({}); // Data being edited

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                console.log('Fetching students...'); // Log start of fetch
                const studentsCollectionRef = collection(db, 'students');
                const querySnapshot = await getDocs(studentsCollectionRef);
                const studentsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log('Fetched students:', studentsList); // Log the result
                setStudents(studentsList);
            } catch (error) {
                console.error("Error fetching students:", error);
                // Consider displaying an error message to the user
            }
        };

        fetchStudents();
    }, []);

    const editableFields = ['fName', 'lName', 'DOB', 'Grade', 'Score', 'classId', 'className'];

    const handleChange = (field, value) => {
        setEditRowData(prev => ({ ...prev, [field]: value }));
    };

    const saveChanges = async () => {
        const studentDocRef = doc(db, 'students', editRowId);
        await updateDoc(studentDocRef, editRowData);
        setEditRowId(null); // Exit edit mode
        setEditRowData({}); // Clear edit data
        StudentList();
    };

    const renderHeader = () => (
        <ScrollView horizontal>
            <View style={styles.headerRow}>
                {editableFields.map((field, index) => (
                    <Text key={index} style={styles.headerCell}>{field}</Text>
                ))}
                <Text style={styles.headerCell}>Actions</Text>
            </View>
        </ScrollView>
    );

    const renderItem = ({ item }) => (
        <View style={styles.studentRow}>
            {editableFields.map((field, index) => (
                editRowId === item.id ? (
                    <TextInput
                        key={index}
                        style={styles.cellInput}
                        onChangeText={(text) => handleChange(field, text)}
                        value={editRowData[field]}
                    />
                ) : (
                    <Text key={index} style={styles.cell}>{item[field]}</Text>
                )
            ))}
            {editRowId === item.id ? (
                <>
                    <TouchableOpacity style={styles.actionButton} onPress={saveChanges}>
                        <Text>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => setEditRowId(null)}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <TouchableOpacity style={styles.editButton} onPress={() => {
                    setEditRowId(item.id);
                    setEditRowData(item);
                }}>
                    <Text>Edit</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={students}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
            />
            <Button title="Add Student" onPress={() => navigation.navigate('AddEditStudent', { mode: 'add' })} />
        </View>
    );
};

const styles = StyleSheet.create({
    studentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    cell: {
        marginHorizontal: 5,
        minWidth: 100, // Ensure minimum width for readability
    },
    cellInput: {
        marginHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        minWidth: 100, // Ensure minimum width for readability
    },
    actionButton: {
        marginHorizontal: 5,
        padding: 10,
        backgroundColor: 'lightgray',
    },
    headerRow: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#f3f3f3',
    },
    headerCell: {
        marginHorizontal: 5,
        minWidth: 60, // Match minWidth with cell for alignment
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#f9c2ff',
        padding: 10,
    },
});

export default StudentList;