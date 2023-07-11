export function arrayUnique<T>(array: T[]): T[] {
    let unique: T[] = new Array<T>();
    for (let i: i32 = 0; i < array.length; i++) {
        if (!array.includes(array[i])) {
            unique.push(array[i])
        }
    }

    return unique;
}
