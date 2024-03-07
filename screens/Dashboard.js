import React, { useState, useEffect } from 'react';
import { Modal, View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Button, TextInput } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';


const Students = ({ navigation }) => {
    const [students, setStudents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [show, setShow] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [currentStudent, setCurrentStudent] = useState({
        id: '',
        classID: '',
        fName: '',
        lName: '',
        DOB: '',
        className: '',
        Score: '',
        Grade: ''
    });




    const sortClassName = (data) => {
        return [...data].sort((a, b) => a.className.localeCompare(b.className));
    };




    const fetchS = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "students"));
            let studentList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    DOB: forDate(data.DOB)
                };
            });
            studentList = sortClassName(studentList);
            setStudents(studentList);
        } catch (error) {
            console.error("Error fetching students: ", error);
        }
    };




    const forDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const isValidDate = date instanceof Date && !isNaN(date);
        return isValidDate ? date.toISOString().split('T')[0] : '';
    };





    useEffect(() => {
        fetchS();
    }, []);





    const toggleModal = (student = {
        id: '',
        classID: '',
        fName: '',
        lName: '',
        DOB: '',
        className: '',
        Score: '',
        Grade: ''
    }) => {
        setCurrentStudent(student);
        setIsModalVisible(!isModalVisible);
    };





    const SaveStudent = async () => {
        try {
            const { id, DOB, ...studentData } = currentStudent;
            const dobTimestamp = Timestamp.fromDate(new Date(DOB));
            const studentPayload = { ...studentData, DOB: dobTimestamp };

            if (id) {
                await updateDoc(doc(db, "students", id), studentPayload);
            } else {
                const docRef = await addDoc(collection(db, "students"), studentPayload);
                await updateDoc(doc(db, "students", docRef.id), { id: docRef.id });
                setCurrentStudent(prev => ({ ...prev, id: docRef.id }));
            }
            fetchS();
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error saving student: ", error);
        }
    };





    const InputChange = (name, value) => {
        console.log(`Input Changed - Name: ${name}, Value: ${value}`);
        setCurrentStudent((prev) => ({...prev, [name]: value,}));
    };






    const Delete = async (id) => {
        console.log("Deleting student with ID:", id);
        if (!id) {console.error("Invalid ID for deletion:", id);return;}
        try {await deleteDoc(doc(db, "students", id));fetchS();}
        catch (error) {console.error("Error deleting student:", error);}
    };






    const studentList = ({ item }) => (
        <View style={[styles.rowContainer, item.id === selectedId && styles.selectedRow]}>
            <TouchableOpacity onPress={() => {console.log("Row pressed", item.id);
                setSelectedId(item.id === selectedId ? null : item.id);}} style={styles.row}>
                <Text style={styles.cell}>{item.classID}</Text>
                <Text style={styles.cell}>{item.fName}</Text>
                <Text style={styles.cell}>{item.lName}</Text>
                <Text style={styles.cell}>{item.DOB}</Text>
                <Text style={styles.cell}>{item.className}</Text>
                <Text style={styles.cell}>{item.Score}</Text>
                <Text style={styles.cell}>{item.Grade}</Text>
            </TouchableOpacity>
            {item.id === selectedId && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonEditDelete}
                        onPress={() => toggleModal(item)}
                    >
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.buttonEditDelete, { backgroundColor: '#f6943f' }]}
                        onPress={() => Delete(item.id)}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );






    return (
        <View style={{ flex: 1 }}>
            <View style={styles.table}>
                <Text style={styles.header}>Student List</Text>
                <Text style={styles.info}>"Select row to edit or delete"</Text>
                <View style={styles.row}>
                    <Text style={styles.cellHeader}>Class ID</Text>
                    <Text style={styles.cellHeader}>First Name</Text>
                    <Text style={styles.cellHeader}>Last Name</Text>
                    <Text style={styles.cellHeader}>DOB</Text>
                    <Text style={styles.cellHeader}>Class Name</Text>
                    <Text style={styles.cellHeader}>Score</Text>
                    <Text style={styles.cellHeader}>Grade</Text>
                </View>
                <FlatList data={students} renderItem={studentList} keyExtractor={item => item.id ? item.id.toString() : `unique-${Math.random()}`} extraData={selectedId}/>
                <TouchableOpacity style={styles.Grade}
                    onPress={() => navigation.navigate('GradeDistribution')}>
                    <Text style={styles.GradeText}>Grade Distribution</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addStudent} onPress={() => toggleModal()}>
                    <Text style={styles.addStudentText}>Add New Student</Text>
                </TouchableOpacity>
            </View>
            <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => {setIsModalVisible(!isModalVisible);}}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {/* Inputs for editing or adding a student */}
                        <TextInput
                            style={styles.Input}
                            placeholder="Class ID"
                            placeholderTextColor="#888"
                            value={currentStudent.classID}
                            onChangeText={(text) => InputChange('classID', text)}
                        />
                        <TextInput
                            style={styles.Input}
                            placeholder="First Name"
                            placeholderTextColor="#888"
                            value={currentStudent.fName}
                            onChangeText={(text) => InputChange('fName', text)}
                        />
                        <TextInput
                            style={styles.Input}
                            placeholder="Last Name"
                            placeholderTextColor="#888"
                            value={currentStudent.lName}
                            onChangeText={(text) => InputChange('lName', text)}
                        />
                        <TextInput
                            style={styles.Input}
                            placeholder="DOB (YYYY-MM-DD)"
                            placeholderTextColor="#888"
                            value={currentStudent.DOB}
                            onChangeText={(text) => InputChange('DOB', text)}
                        />
                        <TextInput
                            style={styles.Input}
                            placeholder="Class Name"
                            placeholderTextColor="#888"
                            value={currentStudent.className}
                            onChangeText={(text) => InputChange('className', text)}
                        />
                        <TextInput
                            style={styles.Input}
                            placeholder="Score"
                            placeholderTextColor="#888"
                            value={String(currentStudent.Score)}
                            onChangeText={(text) => InputChange('Score', text)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.Input}
                            placeholder="Grade"
                            placeholderTextColor="#888"
                            value={currentStudent.Grade}
                            onChangeText={(text) => InputChange('Grade', text)}
                        />

                        <TouchableOpacity onPress={SaveStudent} style={styles.button}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setIsModalVisible(false)} style={[styles.button, {backgroundColor: 'orange'}]}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};








const styles = StyleSheet.create({
    rowContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        padding: 10,
    },
    selectedRow: {
        backgroundColor: 'lightgrey',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
    },
    info: {
        fontSize: 12,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
    },
    table: {
        flex: 1,
        margin: 8,
    },
    row: {
        flexDirection: 'row',
        borderColor: "#000",
        borderWidth: 1,
        padding: 0,
        width: "100%",
    },
    cell: {
        flex: 4,
        fontSize: 6,
        padding: 6,
        textAlign: "center",
        borderColor: "#000",
        width: "auto",
    },
    cellHeader: {
        flex: 1,
        fontSize: 12,
        fontWeight: 'bold',
        padding: 6,
        textAlign: "center",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 100,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    Input: {
        height: 40,
        width: 200,
        borderColor: 'gray',
        textAlign: "center",
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 15,
        marginTop: 8,
        marginBottom: 8,
        color: "#000000",
    },
    button: {
        backgroundColor: "#595858",
        padding: 10,
        width: "auto",
        borderRadius: 5,
        marginTop: 10,
    },
    buttonEditDelete: {
        backgroundColor: "#595858",
        padding: 6,
        marginHorizontal: 5,
        borderRadius: 5,
        borderColor: "#000",
        borderWidth: 2,
    },
    buttonText: {
        fontSize: 10,
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
    addStudent: {
        backgroundColor: '#ffb471',
        padding: 10,
        borderRadius: 5,
        borderColor: "#000",
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        marginBottom: 30,
    },
    addStudentText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    Grade: {
        backgroundColor: '#ffb471',
        padding: 10,
        borderRadius: 5,
        borderColor: "#000",
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        marginBottom: 30,
    },
    GradeText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Students;
