import { db } from './firebaseConfig'; // Import the Firestore instance from your firebase.js file

// Add a new student
const addStudent = async (studentData) => {
    try {
        await db.collection('students').add(studentData);
        console.log('Student added successfully!');
    } catch (error) {
        console.error('Error adding student: ', error);
    }
};


const updateStudent = async (studentId, newData) => {
    try {
        await db.collection('students').doc(studentId).update(newData);
        console.log('Student updated successfully!');
    } catch (error) {
        console.error('Error updating student: ', error);
    }
};


const deleteStudent = async (studentId) => {
    try {
        await db.collection('students').doc(studentId).delete();
        console.log('Student deleted successfully!');
    } catch (error) {
        console.error('Error deleting student: ', error);
    }
};

export { addStudent, updateStudent, deleteStudent };