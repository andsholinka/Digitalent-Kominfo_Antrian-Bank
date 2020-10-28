import admin from 'firebase-admin';
import { serviceAccountCredentials } from '../serviceAccountKey';
const serviceAccount = serviceAccountCredentials as admin.ServiceAccount;

export type Antrian = {
    status: number;
    kode: string;
    no: string;
};


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://digitalent-be-21-05.firebaseio.com',
});

const db = admin.firestore();
const accountRef = db.collection('antrian');

export class FirebaseClient {
    private db: FirebaseFirestore.Firestore;
    private accountRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

    constructor() {
        this.db = db;
        this.accountRef = accountRef;
    }

    async addData(antrian: Antrian) {
        try {
            await accountRef.add(antrian);
        } catch (error) {
            throw error
        }
        return;
    }

    async getData() {
        let snapshot;
        try {
            snapshot = await this.accountRef.get();
        } catch (error) {
            throw error;
        }
        return snapshot.docs.map(doc => doc.data());
    }

    async getDataByStatus(status: number) {
        let snapshot;
        try {
            snapshot = await accountRef.where('status', '==', status).get();
        } catch (error) {
            throw error;
        }
        return snapshot.docs.map(doc => doc.data());
    }

    async updateData(id: string, update: Object) {
        let snapshot;
        try {
            await accountRef.doc(id).update({
                ...update
            });
            snapshot = await accountRef.doc(id).get();
        } catch (error) {
            throw error;
        }
        return snapshot.data();
    }

    async deleteData(id: string) {
        try {
            await accountRef.doc(id).delete();
        } catch (error) {
            throw error;
        }
        return;
    }
}