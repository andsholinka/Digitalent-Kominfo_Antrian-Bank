import { Router } from 'express';
import { FirebaseClient } from '../database/firebase';
const firebaseClient = new FirebaseClient();

const router = Router();

// create antrian for CS
router.post('/antrian/cs', async (req, res, next) => {
    const { kode, status, no } = req.body;
    const result = ({
        kode: 'A',
        status: 0,
        no,
    })
    try {
        await firebaseClient.addData(result)
    } catch (error) {
        throw error;
    }

    res.json({
        message: 'success'
    });
});

// create antrian for Teller
router.post('/antrian/teller', async (req, res, next) => {
    const { kode, status, no } = req.body;
    const result = ({
        kode: 'B',
        status: 0,
        no,
    })
    try {
        await firebaseClient.addData(result)
    } catch (error) {
        throw error;
    }

    res.json({
        message: 'success'
    });
});

// get all antrian
router.get('/antrian', async (req, res, next) => {
    let antrians;

    try {
        const result = await firebaseClient.getData();
        antrians = result.map(({ no, kode, status }) => {
            return {
                no_urut: `${kode}${no}`,
                status
            }
        })
    } catch (error) {
        return next(error);
    }

    res.json(antrians);
});

// get antrian By status 
router.get('/antrian/status/:status', async (req, res, next) => {
    const status = Number(req.params.status)
    let antrians;
    try {
        const result = await firebaseClient.getDataByStatus(status);
        antrians = result.map(({ no, kode, status }) => {
            return {
                no_urut: `${kode}${no}`,
                status
            }
        })
    } catch (error) {
        return next(error)
    }
    res.send(antrians)
});

// update status
router.put('/antrian/:id', async (req, res, next) => {
    const id = req.params.id;
    const update = req.body;
    let antrian;
    try {
        antrian = await firebaseClient.updateData(id, update)
    } catch (error) {
        return next(error)
    }
    res.json(antrian)
});

//delete antrian By Id
router.delete('/antrian/:id', async (req, res, next) => {
    const id = req.params.id;
    // let account;
    try {
        await firebaseClient.deleteData(id)
    } catch (error) {
        return next(error);
    }
    res.json({
        message: 'Data deleted',
    })
});

export default router;