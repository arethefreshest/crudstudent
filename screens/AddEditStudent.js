import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { db } from "../firebaseConfig";
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';

const AddEditStudent = ({ route, navigation }) => {
    const { mode, studentId } = route.params || {}; // Get mode and studentId (if in edit mode)

    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [DOB, setDOB] = useState('');
    const [Grade, setGrade] = useState('');
    const [Score, setScore] = useState('');
    const [classId, setClassId] = useState('');
    const [className, setClassName] = useState('');


    useEffect(() => {
        // If editing, fetch student data by studentId and populate the form fields
        if (mode === 'edit' && studentId) {
            const fetchStudent = async () => {
                const studentDocRef = doc(db, 'students', studentId);
                const docSnapshot = await getDoc(studentDocRef);
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setFName(data.fName || '');
                    setLName(data.lName || '');
                    setDOB(data.DOB || '');
                    setGrade(data.Grade || '');
                    setScore(data.Score ? data.Score.toString() : '');
                    setClassId(data.classId || '');
                    setClassName(data.className || '');

                } else {
                    // Handle case where student with the ID isn't found
                }
            };
            fetchStudent();
        }
    }, [mode, studentId]);

    const handleSubmit = async () => {
        const studentData = {
            fName,
            lName,
            DOB,
            // Convert back to numbers if necessary
            Grade,
            Score: Score ? Number(Score) : 0,
            classId,
            className,
        };

        if (mode === 'add') {
            try {
                await addDoc(collection(db, 'students'), studentData);
                navigation.navigate('StudentList'); // Return to list
            } catch (error) {
                console.error("Error adding student:", error);
            }
        } else if (mode === 'edit') {
            try {
                const studentDocRef = doc(db, 'students', studentId);
                await updateDoc(studentDocRef, studentData);
                navigation.navigate('StudentList');
            } catch (error) {
                console.error("Error updating student:", error);
            }
        }
    };

    return (
        <View>
            <Text>{(mode === 'add') ? 'Add Student' : 'Edit Student'}</Text>
            {/* Input fields for student data */}
            <TextInput placeholder="First Name" value={fName} onChangeText={setFName} />
            <TextInput placeholder="Last Name" value={lName} onChangeText={setLName} />
            <TextInput placeholder="DOB" value={DOB} onChangeText={setDOB} />
            <TextInput placeholder="Grade" value={Grade} onChangeText={setGrade} />
            <TextInput placeholder="Score" value={Score} onChangeText={setScore} />
            <TextInput placeholder="Class ID" value={classId} onChangeText={setClassId} />
            <TextInput placeholder="Class Name" value={className} onChangeText={setClassName} />

            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

export default AddEditStudent;
