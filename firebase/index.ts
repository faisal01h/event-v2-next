import firebase from 'firebase/app'
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import { 
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
    setDoc,
    updateDoc,
    doc,
    serverTimestamp, 
} from 'firebase/firestore'

async function signIn() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
    return getAuth().currentUser?.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
    return getAuth().currentUser?.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
    return !!getAuth().currentUser;
}


interface UserData {
    name: string,
    email: string,
    password: string,
    role: Number,
    profilePhotoUrl: string,
}

const createUser = (props: {userData: UserData}) => {
    addDoc(collection(getFirestore(), 'users'), props.userData)
    .then((e) => {
        console.log(e);
    })
    .catch((e) => {
        console.error('Error writing user to database!', e);
    })
}

interface CommentData {
    userId: string,
    eventId: string,
    comment: string,
    created_at: Date
}

const createComment = (props: { commentData: CommentData }) => {
    addDoc(collection(getFirestore(), 'comments'), props.commentData)
    .then((e) => {
        console.log(e);
    })
    .catch((e) => {
        console.error('Error writing comment to database!', e);
    })
}
