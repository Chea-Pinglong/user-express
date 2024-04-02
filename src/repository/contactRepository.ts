import {
  ContactCreateRepository,
  ContactUpdateRepository,
} from "./@types/contactRepository.type";
import DuplicateError from "../errors/duplicateError";
import APIError from "../errors/apiError";
import ContactModel from "../models/contact";

export default class ContactRepository {
  async createContact({ name, email, password }: ContactCreateRepository) {
    try {
      const existingContact = await this.checkEmail({ email });
      if (existingContact) {
        throw new DuplicateError("Email already exists");
      }

      const contact = new ContactModel({ name, email, password });
      const contactResult = await contact.save();
      return contactResult;
    } catch (error) {
      if (error instanceof DuplicateError) {
        throw error;
      }
      throw new APIError("Unable to create Contact in database");
    }
  }

  async findAllContacts(page: number = 1, size: number = 5) {
    try {
      const totalContacts = await ContactModel.countDocuments({});

      const currPage = Math.max(
        1,
        Math.min(page, Math.ceil(totalContacts / size))
      );
      const totalPages = Math.ceil(totalContacts / size);
      const skip = (currPage - 1) * size;
      const contact = await ContactModel.find({}, null, { skip, limit: size });

      // return {Contacts, totalContacts};
      return {
        contact,
        pagination: {
          currPage,
          totalPages,
        },
      };
    } catch (error) {
      throw new APIError("Unable to fetch all Contact");
    }
  }

  async checkEmail({ email }: { email: string }) {
    try {
      const existingContact = await ContactModel.findOne({ email: email });
      console.log(existingContact);
      return existingContact;
    } catch (error) {
      return null;
    }
  }

  async findContactById({ id }: { id: string }) {
    try {
      const existingContact = await ContactModel.findById(id);
      return existingContact;
    } catch (error) {
      throw new APIError("Unable to find Contact by Id");
    }
  }

  async updateContactById({ id, ...updateData }: ContactUpdateRepository) {
    try {
      const existingContact = await this.findContactById({ id });
      if (!existingContact) {
        throw new APIError("Contact not found");
      }

      existingContact.name = updateData.name || existingContact.name;
      existingContact.email = updateData.email || existingContact.email;
      existingContact.password = updateData.password || existingContact.password;

      const updatedContact = await existingContact.save();
      return updatedContact;
    } catch (error) {
      throw error;
    }
  }

  async deleteContactById({ id }: { id: string }) {
    try {
      const existingContact = await this.findContactById({ id });
      if (!existingContact) {
        throw new APIError("Contact not found");
      }

      await ContactModel.findByIdAndDelete(id);
      return { message: "Contact delete successfully" };
    } catch (error) {
      throw error;
    }
  }
}
