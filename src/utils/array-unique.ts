export function arrayUnique<T>(array: T[]): T[] {
    let unique: T[] = new Array<T>();
    for (let i: i32 = 0; i < array.length; i++) {
        if (!array.includes(array[i])) {
            unique = unique.concat([array[i]]);
        }
    }

    return unique;
}
