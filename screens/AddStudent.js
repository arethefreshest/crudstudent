import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { db } from '../firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AddStudent = ({navigation}) => {
    const [classID, setClassID] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [DOB, setDOB] = useState(''); // Store date as a string
    const [className, setClassName] = useState('');
    const [score, setScore] = useState('');
    const [grade, setGrade] = useState('');

    const convertToDate = (dateString) => {
        // Expected format: MM/DD/YYYY
        const parts = dateString.split('/');
        const date = new Date(parts[2], parts[0] - 1, parts[1]);
        return date;
    };

    const handleAddStudent = async () => {
        const newStudent = {
            classID: classID,
            fName: fName,
            lName: lName,
            DOB: convertToDate(DOB), // Convert string to Date object
            className: className,
            Score: parseInt(score, 10), // Convert score to a number
            Grade: grade
        };

        try {
            await addDoc(collection(db, "students"), newStudent);
            // Reset form
            setClassID('');
            setFName('');
            setLName('');
            setDOB('');
            setClassName('');
            setScore('');
            setGrade('');
            // Optionally navigate back or show a success message
        } catch (error) {
            console.error("Error adding student: ", error);
            // Handle errors, perhaps show an error message
        }
    };

    return (
        <View style={styles.container}>
            <Text>Add
                Student</Text>
            <TextInput placeholder="Class ID" value={classID} onChangeText={setClassID} />
            <TextInput placeholder="First Name" value={fName} onChangeText={setFName} />
            <TextInput placeholder="Last Name" value={lName} onChangeText={setLName} />
            <TextInput
                placeholder="DOB (MM/DD/YYYY)"
                value={DOB}
                onChangeText={setDOB}
                // If you want to add validation or masking for the date input, this is where you would do it
            />
            <TextInput placeholder="Class Name" value={className} onChangeText={setClassName} />
            <TextInput
                placeholder="Score"
                value={score}
                onChangeText={setScore}
                keyboardType="numeric"
            />
            <TextInput placeholder="Grade" value={grade} onChangeText={setGrade} />
            <Button title="Add Student" onPress={handleAddStudent} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
// Additional styling can be applied here
    },
// Add styles for your input fields as necessary
});

export default AddStudent;