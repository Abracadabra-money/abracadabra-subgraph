export function isNullEthValue(value: string): boolean {
    if (value == '0x0000000000000000000000000000000000000001' || value == '0x0000000000000000000000000000000000000000') return true;
    return false;
}
