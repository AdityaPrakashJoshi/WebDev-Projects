const express = require("express");
const path = require('path');
const fs = require('fs');
const url = require('url');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Updated path to your JSON file
const dataFilePath = path.join(__dirname, 'datasets', 'User_detials.json');

// Helper function to read JSON data from file
const readDataFromFile = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data from file:', error);
        return [];
    }
};

// Helper function to write JSON data to file
const writeDataToFile = (data) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing data to file:', error);
    }
};

// Routes
app.get("/", (req, res) => {
    res.render('index'); // Ensure 'index.ejs' is in the 'views' directory
});

app.get("/add", (req, res) => {
    res.render('add'); // Ensure 'add.ejs' is in the 'views' directory
});

// POST route to add a user
app.post('/add-user', (req, res) => {
    try {
        const users = readDataFromFile();
        const newId = users.length ? users[users.length - 1].id + 1 : 1;
        const newUser = {
            id: newId,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            gender: req.body.gender,
            ip_address: req.body.ip_address,
        };
        users.push(newUser);

        // Write the updated data back to the file
        writeDataToFile(users);

        // Redirect or respond with a success message
        res.redirect('/'); // Replace '/success' with your success route or render a success page
    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).send('An error occurred');
    }
});

app.get("/read/:id", (req, res) => {
    // Read and parse the JSON data
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const users = JSON.parse(data);

    // Extract the user ID from the URL parameters
    const userId = parseInt(req.params.id, 10); // Convert to an integer

    // Find the user by ID
    const user = users.find(user => user.id === userId);

    // Render the user.ejs template and pass the user data
    res.render('read', { user: user });
});


app.get('/read', (req, res) => {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const users = JSON.parse(data);
    res.render('users', { users });
});


app.get("/update",(req,res)=>{
    res.render("update")
})


app.post('/update-user', (req, res) => {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const users = JSON.parse(data);
    const userId = parseInt(req.body.id, 10); // Assuming 'id' is used to input the ID

    // Find the index of the user by ID
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        // If user is not found, render a view with "Invalid User"
        return res.render('update-user', { errorMessage: 'Invalid User' });
    }

    // Update the user's details with the new data from the form
    users[userIndex] = {
        ...users[userIndex], // Spread existing user data
        first_name: req.body.first_name || users[userIndex].first_name,
        last_name: req.body.last_name || users[userIndex].last_name,
        email: req.body.email || users[userIndex].email,
        gender: req.body.gender || users[userIndex].gender,
        ip_address: req.body.ip_address || users[userIndex].ip_address,
    };

    // Write the updated data back to the file
    writeDataToFile(users);

    // Redirect or respond with a success message
    res.redirect('/'); // Redirect to the home page or a success page
});

app.get("/delete", (req, res) => {
    res.render('delete', { errorMessage: null }); // Pass errorMessage as null initially
});



app.post('/delete-user', (req, res) => {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const users = JSON.parse(data);
    const userId = parseInt(req.body.id, 10); // Assuming 'id' is sent in the request body

    // Find the index of the user by ID
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        // If user is not found, render the view with "User not found" message
        return res.render('delete', { errorMessage: 'User not found' });
    }

    // Remove the user from the array
    users.splice(userIndex, 1);

    // Write the updated data back to the file
    writeDataToFile(users);

    // Redirect to the home page or a success page
    res.redirect('/');
});





const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
