const express = require('express');
const router = express.Router();

const UserData = require('../models/UserData');


// route to diplay the form (get request)
router.get('/add',(req,res) => {
    res.render('form'); // render the form file from view folder
});

// route to handle form submission (post request)
router.post('/add', async (req,res) => {
    try {
        // create a new instance of UserData model with the data from the form
        const newData = new UserData({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });

        // await wait upper code to finish fully before moving on
        await newData.save(); // save the data to the database
        res.redirect('/data'); // redirect to the display route after saving
    } catch (error) {
        if (error.name === 'validationError') {
            const data = await UserData.findById(res.params.id);
            return res.status(400).render('edit-form', {
                errors: Object.values(error.errors).map(e => e.message),
                item:{...data.toObject(), ...req.body} // this will keep the old data and update the new data
            });
        }
        console.error('error will saving data', error );
        res.status(500).send("Internal Server Error"); 
    }
});

// route to display all data (get request)
router.get('/data', async (req,res) => {
    try {
        // adding .sort() will return the data newest to oldest
        const allData = await UserData.find().sort({createdAt: -1});
        // render the data-list file from view folder and this "{data: allData}" pass the allData to the veiw
        res.render('data-list', {data: allData}); 
    } catch (error) {
        console.error('error while fetching data', error);
        
    }
});

// route to display a specific data (only one data) by id (get request)
router.get('/data/:id', async (req,res) => {
    try {
        const singleData = await UserData.findById(req.params.id);
        if (!singleData){
            return res.status(404).send("Data not found");
        }
        // if the data is found, render the data-single file from view folder and pass the singleData to the view
        res.render('data-single', {item: singleData});
    } catch (error) {
        console.error('error while fetching single data', error);
        res.status(500).send("Internal Server Error");
    }
});

// router to show the edit form (get request)
router.get('/edit/:id', async (req, res) => {
    try {
        const dataToEdit = await UserData.findById(req.params.id);
        if (!dataToEdit) {
            return res.status(404).send('data not found');
        }
        res.render('edit-form', {item: dataToEdit});
    } catch (error) {
        console.error('error while fetching data for edit', error);
        res.status(500).send("Internal Server Error");
    }
});

// router to handle the edit form submission (post request), thsi will update the data in the database
router.post('/edit/:id', async (req,res) => {
    // this get the data from the form and now we can update the data in the database
    try {
        const updatedData = {
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        };
    // find the data by id and update it with the new data
    await UserData.findByIdAndUpdate(req.params.id, updatedData);
    res.redirect(`/data/${req.params.id}`); // redirect to the single data view after updating
    } catch (error) {
        if (error.name === 'validationError') {
            const data = await UserData.findById(res.params.id);
            return res.status(400).render('edit-form', {
                errors: Object.values(error.errors).map(e => e.message),
                item:{...data.toObject(), ...req.body} // this will keep the old data and update the new data
            });
        }
        console.error('error while updating data', error);
        res.status(500).send("Internal Server Error");
    }
});

// router to handle the delete request (delete request)
router.post(`/delete/:id`, async (req, res) => {
    try {
        // find the data by id and delete it from the database
        const dataToDelete = await UserData.findByIdAndDelete(req.params.id);
        res.redirect('/data'); // redirect to the data list after deleting
    } catch (error) {
        console.error('error while deleting data', error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;