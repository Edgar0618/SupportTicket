const mongoose = require('mongoose');

const testConnection = async () => {
    try {
        const uri = 'mongodb+srv://edgarguerrero591:Taliaandres20!@edgarcluster.klcioho.mongodb.net/SUPPORTDESK?retryWrites=true&w=majority&appName=EdgarCluster';
        
        console.log('Testing connection string:', uri);
        console.log('Attempting to connect...');
        
        const conn = await mongoose.connect(uri);
        
        console.log('✅ SUCCESS! MongoDB Connected!');
        console.log('Host:', conn.connection.host);
        console.log('Database:', conn.connection.name);
        console.log('Ready state:', conn.connection.readyState);
        
        // Test creating a simple document
        const testSchema = new mongoose.Schema({ name: String });
        const TestModel = mongoose.model('TestConnection', testSchema);
        
        const testDoc = new TestModel({ name: 'Connection Test' });
        await testDoc.save();
        console.log('✅ Document saved successfully!');
        
        await mongoose.disconnect();
        console.log('✅ Disconnected successfully!');
        
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        console.log('Full error:', error);
    }
};

testConnection();
