export function getIntersectSet(menteeInterests, mentorInterests) {
    let commonInterests = [];
    for (let element of menteeInterests) {
        if (mentorInterests.includes(element)) {
            commonInterests.push(element);
        }
    }
    return commonInterests;
}

export function calculateJaccard(menteeInterests, mentorInterests, commonInterests) {
    let menteeInterestsSize = menteeInterests.length;
    let mentorInterestsSize = mentorInterests.length;
    let commonInterestsSize = commonInterests.length;
    if (menteeInterestsSize == 0 && mentorInterestsSize == 0) {
        return 0;
    }
    let coefficient = commonInterestsSize / (menteeInterestsSize + mentorInterestsSize - commonInterestsSize);
    return `${coefficient*100}%`;
}

export function separateInterests(fetched) {
    // Check if fetched is a string
    if (typeof fetched === 'string') {
      const interestArray = fetched.split(',');
      return interestArray;
    } else {
      // Handle the case where fetched is not a string (e.g., if it's an array or null)
      console.error('Error: Expected a string, but received:', fetched);
      return [];
    }
  }

export async function fetchNameFromFirestore(docId) {
    try {
        const docRef = doc(db, 'users', docId);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            const interests = docSnapshot.data().interests;
            return interests;
        } 
        else {
            console.log('No such document!');
        }
    } 
    catch (error) {
        console.error('Error fetching document:', error);
    }
}

//export let array = ["Unsure", "Computer Science", "Medicine", "Finance", "Writing"];