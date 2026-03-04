const Room = require('../models/Room');

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().sort({ createdAt: -1 });
        res.render('pages/admin/rooms/index', { title: 'Manage Rooms', rooms });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const showAddRoom = (req, res) => {
    res.render('pages/admin/rooms/add', { title: 'Add Room' });
};

const addRoom = async (req, res) => {
    try {
        const { name, type, description, pricePerNight, maxOccupancy, facilities, isAvailable, featured } = req.body;

        let facilitiesArray = [];
        if (facilities) {
            facilitiesArray = facilities.split(',').map(f => f.trim());
        }

        // Dummy image for now, later we integrate multer
        const newRoom = new Room({
            name,
            type,
            description,
            pricePerNight,
            maxOccupancy,
            facilities: facilitiesArray,
            isAvailable: isAvailable === 'on',
            featured: featured === 'on',
            images: ['/images/rooms/placeholder.jpg'] // Placeholder image
        });

        await newRoom.save();
        res.redirect('/admin/rooms');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const showEditRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).send('Room not found');
        }
        res.render('pages/admin/rooms/edit', { title: 'Edit Room', room });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const editRoom = async (req, res) => {
    try {
        const { name, type, description, pricePerNight, maxOccupancy, facilities, isAvailable, featured } = req.body;

        let facilitiesArray = [];
        if (facilities) {
            facilitiesArray = facilities.split(',').map(f => f.trim());
        }

        await Room.findByIdAndUpdate(req.params.id, {
            name,
            type,
            description,
            pricePerNight,
            maxOccupancy,
            facilities: facilitiesArray,
            isAvailable: isAvailable === 'on',
            featured: featured === 'on'
        });

        res.redirect('/admin/rooms');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const deleteRoom = async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        res.redirect('/admin/rooms');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { getRooms, showAddRoom, addRoom, showEditRoom, editRoom, deleteRoom };
