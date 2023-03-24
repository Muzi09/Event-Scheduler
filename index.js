const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')

app.use(bodyParser.json())



const Schema = mongoose.Schema

const eventSchema = new Schema ({
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    startTime: { type: String },
    endTime: { type: String },
})

const Event = mongoose.model('Event', eventSchema)

mongoose.connect('mongodb://127.0.0.1:27017/Event_Scheduler')
console.log('Connected to mongodb')





app.post('/v1/events', async (req, res) => {
    try {
        let data = await Event.create(req.body)
        res.status(201).json({
            message: 'Event added successfully',
            data
        })
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

})



app.get('/v1/events', async (req, res) => {
    try {
        let data = await Event.find()
        res.status(200).json({
            data
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
})




app.get('/v1/events/:id', async (req, res) => {
    let data = await Event.findById(req.params.id)
    data == null ? res.status(404).json({message: 'There is no event with that id'}) : res.status(200).json({data})
})




app.delete('/v1/events/:id', async (req, res) => {
    let data = await Event.findByIdAndDelete(req.params.id)
    res.status(204).json({
        message: 'Event Deleted'
    })
})



app.put('/v1/events/:id', async (req, res) => {
    let data = await Event.findById(req.params.id)
    let updatedData = req.body

    let {title, description, location, startTime, endTime} = updatedData
    if (title == "" || description == "" || location == "" || startTime == "" || endTime == "") {
        res.status(400).json({
            message: 'Validation Error, Title is required'
        })
        return
    }


    let updatedEvent = await Event.updateOne(data, updatedData)
    data == null ? res.status(404).json({message: 'There is no event with that id'}) : res.status(200).json({
        message: 'Event updated',
        updatedData
    })
})







app.listen(3000, () => {
    console.log('Server is up and running at port 3000')
})