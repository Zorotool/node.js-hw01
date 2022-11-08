import { promises as fs } from "fs";
import { nanoid } from 'nanoid';
import path from 'path';


const contactsPath = path.resolve("./db/contact.json");

async function readContacts() {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
}

async function writeContacts(newContacts) {
  await fs.writeFile(contactsPath, JSON.stringify(newContacts));
}

export async function listContacts() {
  try {
    const contacts = await readContacts();
    console.table(contacts);
  } catch (err) {
    console.error(err.message);
  }
}

export async function getContactById(contactId) {
    try {
        const contacts = await readContacts();
        const searchedContacts = contacts.find(
            ({ id }) => id === contactId
        );
        if (searchedContacts) {
            console.table(searchedContacts);
            return searchedContacts;
        } else {
            console.error('Contact not found :(')
        }
    } catch (err) {
    console.error(err.message);
  }
}

export async function removeContact(contactId) {
    try {
        const contacts = await readContacts();
        const leftContacts = contacts.filter(
            ({ id }) => contactId !== id
        );
        if (contacts.length === leftContacts.length) {
            console.error('Contact not found :(')
            return
        } else {
            await writeContacts(leftContacts);
            console.log(`Contact with id ${contactId} was successfully remowed!`);
            console.table(leftContacts);
        }
    } catch (err) {
    console.error(err.message);
  }
}

export async function addContact(name, email, phone) {
    try {
        const contacts = await readContacts();
        const isExistContact = contacts.some(
            ({ email: oldEmail }) => email === oldEmail
        );
        if (!isExistContact) {
            const contactToAdd = {
                id: nanoid(),
                name,
                email,
                phone,
            };
            const newContacts = [...contacts, contactToAdd];
            await writeContacts(newContacts);
            console.table(newContacts);
        }  else {
      console.error("Error! Such contact has already exist!");
            return;
        }
    } catch (err) {
    console.error(err.message);
  }
}