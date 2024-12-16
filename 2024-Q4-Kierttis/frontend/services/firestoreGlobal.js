import { Timestamp } from 'firebase/firestore';

export const formatTimestamp = (timestamp) => {
    if (timestamp instanceof Timestamp) {
        const date = timestamp.toDate(); 
        return date.toLocaleString(); 
    }
    return timestamp;
};