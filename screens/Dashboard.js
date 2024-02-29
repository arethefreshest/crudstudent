import React from "react";
import { View, Text, Button} from "react-native";

const Dashboard = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Student Dashboard</Text>
            <Button title="View Students" onPress={() => navigation.navigate('StudentList')} />
            <Button title="Add Student" onPress={() => navigation.navigate('AddEditStudent', { mode: 'add' })} />
        </View>
    );
};

export default Dashboard;
