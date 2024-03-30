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
    return coefficient;
}

export let array = ["Unsure", "Computer Science", "Medicine", "Finance", "Writing"];