import React from "react";
import { View, Text, Button} from "react-native";

const Dashboard = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Student list</Text>

            <Button title="View Students" onPress={() => navigation.navigate('StudentList')} />
            <Button title="Add Student" onPress={() => navigation.navigate('AddStudent')} />
        </View>
    );
};

export default Dashboard;