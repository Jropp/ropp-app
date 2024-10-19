/**
 * @typedef {Object} Todo
 * @property {number} id - The unique identifier for the todo item
 * @property {string} text - The text content of the todo item
 * @property {boolean} completed - Whether the todo item is completed or not
 */

/**
 * @typedef {Object} Person
 * @property {number} [id] - The unique identifier for the person
 * @property {string} firstName - The first name of the person
 * @property {string} lastName - The last name of the person
 * @property {string} [email] - The email address of the person
 * @property {string} [phone] - The phone number of the person
 * @property {number} [birthDate] - The birth date of the person
 * @property {string} [address] - The address of the person
 * @property {string} [address2] - The address line 2 of the person
 * @property {string} [city] - The city of the person
 * @property {string} [state] - The state of the person
 * @property {string} [zipCode] - The zip code of the person
 * @property {number} [createdAt] - The creation date of the person
 * @property {number} [updatedAt] - The update date of the person
 */

/**
 * @typedef {Object} Conversation
 * @property {number} id - The unique identifier for the conversation
 * @property {number} personId - The unique identifier for the person
 * @property {string} content - The content of the conversation
 * @property {string} tags - The tags of the conversation
 * @property {number} createdAt - The creation date of the conversation
 * @property {number} updatedAt - The update date of the conversation
 */
