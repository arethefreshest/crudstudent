import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
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

    const deleteStudent = async (studentId) => {
        try {
            const studentDocRef = doc(db, 'students', studentId);
            await deleteDoc(studentDocRef);
            // Remove the student from the local state to update the UI
            setStudents(currentStudents => currentStudents.filter(student => student.id !== studentId));
        } catch (error) {
            console.error("Error removing student: ", error);
        }
    };

    const renderItem = ({ item }) => (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.studentRow}>
                    {editableFields.map((field, index) => (
                        <View key={`${item.id}_${field}`} style={{ flexDirection: 'row' }}>
                            {editRowId === item.id ? (
                                <TextInput
                                    style={styles.cellInput}
                                    onChangeText={(text) => handleChange(field, text)}
                                    value={editRowData[field]}
                                />
                            ) : (
                                <Text style={styles.cell}>{item[field]}</Text>
                            )}
                            {index < editableFields.length - 1 && <View style={styles.verticalLine} />}
                        </View>
                    ))}
                    {editRowId === item.id ? (
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.actionButton} onPress={saveChanges}>
                                <Text>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={() => setEditRowId(null)}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.editButton} onPress={() => {
                                setEditRowId(item.id);
                                setEditRowData(item);
                            }}>
                                <Text>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteStudent(item.id)}>
                                <Text>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={students}
                keyExtractor={(item, index) => item.id || index.toString()}
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
        borderBottomWidth: 2,
        borderBottomColor: '#000',
    },
    cell: {
        marginHorizontal: 5,
        minWidth: 80, // Ensure minimum width for readability
        paddingHorizontal: 10, // Add padding for spacing
        borderRightWidth: 1, // Add a border to represent a line
        borderRightColor: '#000', // Light color for the line
    },
    cellInput: {
        marginHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        minWidth: 80, // Ensure minimum width for readability
        padding: 10, // Add padding for spacing
        borderRightWidth: 1, // Add a border to represent a line
        borderRightColor: '#ddd', // Light color for the line
    },
    actionButton: {
        marginHorizontal: 5,
        padding: 10,
        backgroundColor: 'lightgray',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f3f3f3',
        padding: 10,
    },
    headerCell: {
        marginHorizontal: 5,
        minWidth: 80, // Match minWidth with cell for alignment
        padding: 10, // Add padding for spacing
        fontWeight: 'bold',
        borderRightWidth: 1, // Add a border to represent a line
        borderRightColor: '#000', // Light color for the line
        borderRadius: 10,
        backgroundColor: '#f3f3f3', // Match header background
    },
    editButton: {
        backgroundColor: '#f9c2ff',
        padding: 10,
        marginRight: 5,
    },
    verticalLine: {
        height: '100%',
        width: 1,
        backgroundColor: '#000',
    },
    deleteButton: {
        backgroundColor: '#f9c2ff',
        padding: 10,
    },
});

export default StudentList;