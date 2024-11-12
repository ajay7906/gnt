const db = require('../config/database');

class Contact {
  static async create(contactData) {
    try {
      const [result] = await db.query(
        'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [contactData.name, contactData.email, contactData.subject, contactData.message]
      );
      return result;
    } catch (error) {
      throw new Error('Error creating contact: ' + error.message);
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw new Error('Error fetching contacts: ' + error.message);
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM contacts WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Error fetching contact: ' + error.message);
    }
  }
}