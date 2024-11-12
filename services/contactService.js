const db = require('../config/database');
const EmailService = require('./emailService');

class ContactService {
  static async createContact(contactData) {
    const { name, email, subject, message } = contactData;
    
    const query = `
      INSERT INTO contacts (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [name, email, subject, message]);
    await EmailService.sendNotification(contactData);
    
    return result.insertId;
  }

  static async getAllContacts() {
    const [rows] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
    return rows;
  }

  static async searchContacts(searchTerm) {
    const query = `
      SELECT * FROM contacts 
      WHERE name LIKE ? OR email LIKE ?
      ORDER BY created_at DESC
    `;
    const searchParam = `%${searchTerm}%`;
    
    const [rows] = await db.query(query, [searchParam, searchParam]);
    return rows;
  }

  static async deleteContact(id) {
    await db.query('DELETE FROM contacts WHERE id = ?', [id]);
  }
}

module.exports = ContactService;