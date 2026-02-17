import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const Calendar = ({ journalEntries }) => {
    const renderItem = ({ item }) => (
        <View style={styles.entryContainer}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.entry}>{item.entry}</Text>
        </View>
    );

    return (
        <FlatList
            data={journalEntries}
            renderItem={renderItem}
            keyExtractor={(item) => item.date}
        />
    );
};

const styles = StyleSheet.create({
    entryContainer: {
        padding: 20,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    date: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    entry: {
        fontSize: 14,
    },
});

export default Calendar;