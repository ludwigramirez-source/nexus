import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env?.VITE_ENCRYPTION_SECRET_KEY || 'default-secret-key-change-in-production';

/**
 * Encrypts a string value using AES encryption
 * @param {string} value - The value to encrypt
 * @returns {string} Encrypted value
 */
export const encryptValue = (value) => {
  try {
    if (!value) return '';
    return CryptoJS?.AES?.encrypt(value, SECRET_KEY)?.toString();
  } catch (error) {
    console.error('Error encrypting value:', error);
    throw new Error('Error al cifrar el valor');
  }
};

/**
 * Decrypts an encrypted string value
 * @param {string} encryptedValue - The encrypted value
 * @returns {string} Decrypted value
 */
export const decryptValue = (encryptedValue) => {
  try {
    if (!encryptedValue) return '';
    const bytes = CryptoJS?.AES?.decrypt(encryptedValue, SECRET_KEY);
    return bytes?.toString(CryptoJS?.enc?.Utf8);
  } catch (error) {
    console.error('Error decrypting value:', error);
    throw new Error('Error al descifrar el valor');
  }
};

/**
 * Stores encrypted value in localStorage
 * @param {string} key - Storage key
 * @param {string} value - Value to encrypt and store
 */
export const storeEncrypted = (key, value) => {
  try {
    const encrypted = encryptValue(value);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error('Error storing encrypted value:', error);
    throw new Error('Error al guardar el valor cifrado');
  }
};

/**
 * Retrieves and decrypts value from localStorage
 * @param {string} key - Storage key
 * @returns {string} Decrypted value
 */
export const retrieveEncrypted = (key) => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return '';
    return decryptValue(encrypted);
  } catch (error) {
    console.error('Error retrieving encrypted value:', error);
    return '';
  }
};

export default {
  encryptValue,
  decryptValue,
  storeEncrypted,
  retrieveEncrypted
};